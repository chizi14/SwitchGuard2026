"""Reversal routes — detail, timeline, and manual trigger."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.deps import get_current_customer, get_db
from app.models.models import Reversal, ReversalTimeline, Transaction
from app.schemas.schemas import ReversalDetailOut, ReversalTimelineStepOut, ReversalTriggerRequest

router = APIRouter(prefix="/api/reversals", tags=["reversals"])


@router.get("/{txn_id}", response_model=ReversalDetailOut)
async def get_reversal_detail(
    txn_id: str,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Get reversal detail with the full 6-step timeline."""
    try:
        txn_uuid = UUID(txn_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid transaction ID")

    result = await db.execute(
        select(Reversal)
        .options(selectinload(Reversal.timeline))
        .where(Reversal.transaction_id == txn_uuid)
    )
    reversal = result.scalar_one_or_none()

    if not reversal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reversal not found")

    timeline = sorted(reversal.timeline, key=lambda s: s.timestamp)

    return ReversalDetailOut(
        transactionId=f"TXN-{reversal.id.hex[:8].upper()}-S",
        atmLocation=reversal.atm_location,
        amount=reversal.amount,
        originalTimestamp=reversal.original_timestamp.strftime("%b %d, %Y · %H:%M:%S"),
        reversedOn=reversal.reversed_on.strftime("%b %d, %Y · %H:%M:%S") if reversal.reversed_on else None,
        timeline=[
            ReversalTimelineStepOut(
                key=s.step_key,
                title=s.title,
                detail=s.detail,
                time=s.timestamp.strftime("%H:%M:%S"),
                state=s.state,
            )
            for s in timeline
        ],
    )


@router.post("/trigger")
async def trigger_reversal(
    body: ReversalTriggerRequest,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Manually trigger a reversal check (backup path).

    Still enforces the 3-step verification gate.
    """
    from app.services.reversal_engine import ReversalEngine

    engine = ReversalEngine(db)
    result = await engine.verify_and_reverse(
        transaction_id=body.transaction_id,
        atm_location="Manual trigger",
        claimed_by_customer_id=claims["sub"],
    )

    if not result.success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": result.message,
                "failed_check": result.failed_check,
            },
        )

    return {"message": result.message, "status": result.status}
