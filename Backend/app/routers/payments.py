"""Payment approval routes — pending payments list, approve/decline/block."""
from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_customer, get_db
from app.models.models import Card, Customer, Notification, PendingPayment
from app.schemas.schemas import PendingPaymentOut
from app.services.sms_gateway import SMS_TEMPLATES, send_sms

router = APIRouter(prefix="/api/payments", tags=["payments"])


@router.get("/pending", response_model=list[PendingPaymentOut])
async def list_pending_payments(
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """List pending payments for the authenticated customer."""
    customer_id = UUID(claims["sub"])

    result = await db.execute(
        select(PendingPayment)
        .where(PendingPayment.customer_id == customer_id, PendingPayment.status == "pending")
        .order_by(PendingPayment.created_at.desc())
    )
    payments = result.scalars().all()

    now = datetime.now(timezone.utc)
    return [
        PendingPaymentOut(
            id=str(p.id),
            merchant=p.merchant,
            type=p.type,
            amount=p.amount,
            cardId=str(p.card_id) if p.card_id else "",
            urgent=p.is_urgent,
            countdown=(
                max(0, int((p.expires_at - now).total_seconds()))
                if p.is_urgent and p.expires_at
                else None
            ),
        )
        for p in payments
    ]


@router.post("/{payment_id}/approve")
async def approve_payment(
    payment_id: str,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Approve a pending payment."""
    return await _handle_payment_action(payment_id, claims, db, "accepted")


@router.post("/{payment_id}/decline")
async def decline_payment(
    payment_id: str,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Decline a pending payment."""
    return await _handle_payment_action(payment_id, claims, db, "declined")


@router.post("/{payment_id}/block")
async def block_payment(
    payment_id: str,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Block a pending payment and flag the merchant."""
    return await _handle_payment_action(payment_id, claims, db, "blocked")


async def _handle_payment_action(
    payment_id: str,
    claims: dict,
    db: AsyncSession,
    new_status: str,
):
    try:
        pid = UUID(payment_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payment ID")

    customer_id = UUID(claims["sub"])
    result = await db.execute(
        select(PendingPayment).where(
            PendingPayment.id == pid,
            PendingPayment.customer_id == customer_id,
            PendingPayment.status == "pending",
        )
    )
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found or already resolved")

    payment.status = new_status
    await db.commit()

    # Get customer and card for SMS
    cust_result = await db.execute(select(Customer).where(Customer.id == customer_id))
    customer = cust_result.scalar_one_or_none()

    card_last4 = ""
    if payment.card_id:
        card_result = await db.execute(select(Card).where(Card.id == payment.card_id))
        card = card_result.scalar_one_or_none()
        if card:
            card_last4 = card.last4

    amount_str = f"MWK {abs(payment.amount):,.2f}"

    sms_map = {
        "accepted": SMS_TEMPLATES["payment_approved"],
        "declined": SMS_TEMPLATES["payment_declined"],
        "blocked": SMS_TEMPLATES["payment_blocked"],
    }

    if customer:
        await send_sms(
            db,
            customer.phone,
            sms_map[new_status].format(
                merchant=payment.merchant,
                amount=amount_str,
                last4=card_last4,
            ),
            f"payment_{new_status}",
            str(customer.id),
        )
        await db.commit()

    return {"message": f"Payment {new_status}", "status": new_status}
