"""Transaction routes — listing, webhook ingestion for ATM/switch pushes."""
from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_customer, get_db
from app.models.models import Card, Customer, Transaction
from app.schemas.schemas import (
    AtmErrorWebhookPayload,
    AtmWebhookPayload,
    TransactionOut,
)
from app.services.velocity_check import run_velocity_check

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.get("")
async def list_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """List the authenticated customer's transactions, paginated."""
    customer_id = UUID(claims["sub"])

    count_q = select(func.count()).select_from(Transaction).where(
        Transaction.customer_id == customer_id
    )
    total = (await db.execute(count_q)).scalar() or 0

    txns_q = (
        select(Transaction)
        .where(Transaction.customer_id == customer_id)
        .order_by(Transaction.timestamp.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(txns_q)
    transactions = result.scalars().all()

    return {
        "transactions": [
            TransactionOut(
                id=str(t.id),
                merchant=t.merchant,
                timestamp=t.timestamp.strftime("%b %d, %Y, %I:%M %p"),
                amount=t.amount,
                status=t.status,
                icon=t.icon_category or "cart",
            )
            for t in transactions
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("/webhook", status_code=status.HTTP_201_CREATED)
async def atm_webhook(
    payload: AtmWebhookPayload,
    db: AsyncSession = Depends(get_db),
):
    """Ingest a new transaction from the ATM switch.

    In production, this would be called by the National Switch or ATM network.
    """
    # Find card by last4
    card_result = await db.execute(
        select(Card).where(Card.last4 == payload.card_last4)
    )
    card = card_result.scalar_one_or_none()

    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    # Get customer via card
    cust_result = await db.execute(
        select(Customer).where(Customer.id == card.customer_id)
    )
    customer = cust_result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    # Parse timestamp
    try:
        txn_ts = datetime.fromisoformat(payload.timestamp.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        txn_ts = datetime.now(timezone.utc)

    # Create transaction
    txn = Transaction(
        customer_id=customer.id,
        card_id=card.id,
        merchant=payload.atm_location,
        amount=-abs(payload.amount),  # Debit = negative
        timestamp=txn_ts,
        status="Verified",
        type="atm",
        icon_category="atm",
        atm_location=payload.atm_location,
        lat=payload.lat,
        lng=payload.lng,
    )
    db.add(txn)

    # Run velocity check against last transaction
    last_txn_result = await db.execute(
        select(Transaction)
        .where(Transaction.customer_id == customer.id)
        .order_by(Transaction.timestamp.desc())
        .offset(1)
        .limit(1)
    )
    last_txn = last_txn_result.scalar_one_or_none()

    if last_txn and last_txn.atm_location:
        # Infer city from ATM location string
        current_city = _infer_city(payload.atm_location)
        previous_city = _infer_city(last_txn.atm_location)

        if current_city and previous_city:
            from app.models.models import SecurityAlert
            from app.services.velocity_check import run_velocity_check

            result = run_velocity_check(
                current_city=current_city,
                previous_city=previous_city,
                current_time=txn_ts,
                previous_time=last_txn.timestamp,
            )

            if result.flagged:
                alert = SecurityAlert(
                    customer_id=customer.id,
                    transaction_id=txn.id,
                    amount=abs(payload.amount),
                    atm_location=payload.atm_location,
                    method="Physical Debit Card",
                    home_city=customer.home_city,
                    flagged_city=current_city,
                    status="Needs Review",
                    reason=result.reason,
                    distance_km=result.distance_km,
                    minutes_apart=result.minutes_apart,
                    risk_score=result.risk_score,
                    detection_ms=340,  # simulated
                )
                db.add(alert)

    await db.commit()

    return {"message": "Transaction ingested", "transaction_id": str(txn.id)}


@router.post("/atm/error-webhook", status_code=status.HTTP_201_CREATED)
async def atm_error_webhook(
    payload: AtmErrorWebhookPayload,
    db: AsyncSession = Depends(get_db),
):
    """Ingest an ATM hardware dispense error.

    In production, this would be pushed by the ATM's own diagnostic system.
    """
    # In a real system, this creates an atm_error_log record.
    # For the hackathon, we look up the transaction and trigger reversal check.
    try:
        txn_uuid = UUID(payload.transaction_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid transaction ID")

    txn_result = await db.execute(
        select(Transaction).where(Transaction.id == txn_uuid)
    )
    txn = txn_result.scalar_one_or_none()

    if not txn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    # Trigger the reversal engine
    from app.services.reversal_engine import ReversalEngine

    engine = ReversalEngine(db)
    result = await engine.verify_and_reverse(
        transaction_id=payload.transaction_id,
        atm_location=payload.atm_location,
        claimed_by_customer_id=str(txn.customer_id),
    )

    return {
        "message": "ATM error logged",
        "reversal_triggered": result.success,
        "reversal_status": result.status,
        "detail": result.message,
    }


def _infer_city(atm_location: str) -> str | None:
    """Infer city name from an ATM location string."""
    location_lower = atm_location.lower()
    for city in ["Blantyre", "Lilongwe", "Mzuzu"]:
        if city.lower() in location_lower:
            return city
    return None
