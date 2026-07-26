"""Card management routes — list, block/unblock, freeze/unfreeze, controls."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_customer, get_db
from app.models.models import Card, Customer
from app.schemas.schemas import CardControlsOut, CardControlsUpdate, CardOut
from app.services.sms_gateway import SMS_TEMPLATES, send_sms

router = APIRouter(prefix="/api/cards", tags=["cards"])


async def _get_customer(claims: dict, db: AsyncSession) -> Customer:
    result = await db.execute(
        select(Customer).where(Customer.id == UUID(claims["sub"]))
    )
    cust = result.scalar_one_or_none()
    if not cust:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return cust


@router.get("", response_model=list[CardOut])
async def list_cards(
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """List all cards for the authenticated customer."""
    customer = await _get_customer(claims, db)
    result = await db.execute(
        select(Card).where(Card.customer_id == customer.id)
    )
    cards = result.scalars().all()

    return [
        CardOut(
            id=str(c.id),
            network=c.network,
            label=c.label,
            last4=c.last4,
            exp=c.expiry,
            status=c.status,
            frozen=c.frozen,
        )
        for c in cards
    ]


@router.post("/{card_id}/block")
async def block_card(
    card_id: str,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Block a card — stops all new transactions immediately."""
    customer = await _get_customer(claims, db)
    card = await _get_card(card_id, customer.id, db)

    card.status = "Blocked"
    await db.commit()

    await send_sms(
        db,
        customer.phone,
        SMS_TEMPLATES["card_blocked"].format(last4=card.last4),
        "block",
        str(customer.id),
    )
    await db.commit()

    return {"message": f"Card ending {card.last4} blocked"}


@router.post("/{card_id}/unblock")
async def unblock_card(
    card_id: str,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Unblock a previously blocked card."""
    customer = await _get_customer(claims, db)
    card = await _get_card(card_id, customer.id, db)

    card.status = "Active"
    await db.commit()

    await send_sms(
        db,
        customer.phone,
        SMS_TEMPLATES["card_unblocked"].format(last4=card.last4),
        "unblock",
        str(customer.id),
    )
    await db.commit()

    return {"message": f"Card ending {card.last4} unblocked"}


@router.post("/{card_id}/freeze")
async def freeze_card(
    card_id: str,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Freeze a card temporarily (e.g., from a security alert)."""
    customer = await _get_customer(claims, db)
    card = await _get_card(card_id, customer.id, db)

    card.frozen = True
    await db.commit()

    await send_sms(
        db,
        customer.phone,
        SMS_TEMPLATES["card_frozen"].format(
            name=customer.name.split(" ")[0], city=customer.home_city
        ),
        "freeze",
        str(customer.id),
    )
    await db.commit()

    return {"message": f"Card ending {card.last4} frozen"}


@router.post("/{card_id}/unfreeze")
async def unfreeze_card(
    card_id: str,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Unfreeze a card."""
    customer = await _get_customer(claims, db)
    card = await _get_card(card_id, customer.id, db)

    card.frozen = False
    await db.commit()

    return {"message": f"Card ending {card.last4} unfrozen"}


@router.get("/{card_id}/controls", response_model=CardControlsOut)
async def get_card_controls(
    card_id: str,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Get card control settings."""
    customer = await _get_customer(claims, db)
    card = await _get_card(card_id, customer.id, db)

    return CardControlsOut(
        requireApproval=card.require_approval,
        blockOnline=card.block_online,
    )


@router.put("/{card_id}/controls", response_model=CardControlsOut)
async def update_card_controls(
    card_id: str,
    body: CardControlsUpdate,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Update card control settings."""
    customer = await _get_customer(claims, db)
    card = await _get_card(card_id, customer.id, db)

    if body.require_approval is not None:
        card.require_approval = body.require_approval
    if body.block_online is not None:
        card.block_online = body.block_online
        if body.block_online:
            card.require_approval = False

    await db.commit()

    return CardControlsOut(
        requireApproval=card.require_approval,
        blockOnline=card.block_online,
    )


async def _get_card(card_id: str, customer_id: UUID, db: AsyncSession) -> Card:
    try:
        cid = UUID(card_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    result = await db.execute(
        select(Card).where(Card.id == cid, Card.customer_id == customer_id)
    )
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    return card
