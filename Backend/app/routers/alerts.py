"""Security alert routes — list, detail, and resolve."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.deps import get_current_customer, get_db
from app.models.models import Card, Customer, Notification, SecurityAlert
from app.schemas.schemas import (
    AlertHistoryOut,
    AlertResolveRequest,
    SecurityAlertOut,
)
from app.services.sms_gateway import SMS_TEMPLATES, send_sms

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("", response_model=list[SecurityAlertOut])
async def list_alerts(
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """List security alerts for the authenticated customer."""
    customer_id = UUID(claims["sub"])

    result = await db.execute(
        select(SecurityAlert)
        .where(SecurityAlert.customer_id == customer_id)
        .order_by(SecurityAlert.created_at.desc())
    )
    alerts = result.scalars().all()

    return [
        SecurityAlertOut(
            id=str(a.id),
            amount=a.amount,
            time=a.created_at.strftime("Today, %I:%M %p") if a.created_at else "",
            atmLocation=a.atm_location or "",
            method=a.method or "Physical Debit Card",
            homeCity=a.home_city,
            flaggedCity=a.flagged_city,
            status=a.status,
            reason=a.reason or "",
            distanceKm=a.distance_km or 0,
            minutesApart=a.minutes_apart or 0,
            riskScore=a.risk_score,
            detectionMs=a.detection_ms,
        )
        for a in alerts
    ]


@router.get("/{alert_id}", response_model=SecurityAlertOut)
async def get_alert(
    alert_id: str,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific security alert."""
    try:
        aid = UUID(alert_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid alert ID")

    result = await db.execute(
        select(SecurityAlert).where(
            SecurityAlert.id == aid,
            SecurityAlert.customer_id == UUID(claims["sub"]),
        )
    )
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")

    return SecurityAlertOut(
        id=str(alert.id),
        amount=alert.amount,
        time=alert.created_at.strftime("Today, %I:%M %p"),
        atmLocation=alert.atm_location or "",
        method=alert.method or "Physical Debit Card",
        homeCity=alert.home_city,
        flaggedCity=alert.flagged_city,
        status=alert.status,
        reason=alert.reason or "",
        distanceKm=alert.distance_km or 0,
        minutesApart=alert.minutes_apart or 0,
        riskScore=alert.risk_score,
        detectionMs=alert.detection_ms,
    )


@router.post("/{alert_id}/resolve")
async def resolve_alert(
    alert_id: str,
    body: AlertResolveRequest,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Resolve a security alert — confirm or freeze."""
    try:
        aid = UUID(alert_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid alert ID")

    cust_id = UUID(claims["sub"])
    result = await db.execute(
        select(SecurityAlert).where(SecurityAlert.id == aid, SecurityAlert.customer_id == cust_id)
    )
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")

    if alert.status != "Needs Review":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Alert already resolved")

    cust_result = await db.execute(select(Customer).where(Customer.id == cust_id))
    customer = cust_result.scalar_one_or_none()

    if body.action == "confirm":
        alert.status = "Confirmed"
        # Create notification
        notif = Notification(
            customer_id=cust_id,
            title="Alert confirmed",
            detail=f"You confirmed the {alert.flagged_city} withdrawal was you. Case closed.",
            tone="success",
            icon_key="CheckCircle2",
            navigation_to="/alerts",
        )
        db.add(notif)

        if customer:
            await send_sms(
                db,
                customer.phone,
                SMS_TEMPLATES["alert_confirmed"].format(
                    name=customer.name.split(" ")[0],
                    amount=f"MWK {alert.amount:,.2f}",
                    city=alert.flagged_city,
                ),
                "alert_confirmed",
                str(customer.id),
            )

    elif body.action == "freeze":
        alert.status = "Blocked"
        # Freeze all customer cards
        cards_result = await db.execute(
            select(Card).where(Card.customer_id == cust_id)
        )
        for card in cards_result.scalars().all():
            card.frozen = True

        # Create notification
        notif = Notification(
            customer_id=cust_id,
            title="Card frozen",
            detail=f"Card frozen after the {alert.flagged_city} withdrawal was flagged as not you.",
            tone="error",
            icon_key="Lock",
            navigation_to="/security",
        )
        db.add(notif)

        if customer:
            await send_sms(
                db,
                customer.phone,
                SMS_TEMPLATES["card_frozen"].format(
                    name=customer.name.split(" ")[0],
                    city=alert.flagged_city,
                ),
                "freeze",
                str(customer.id),
            )
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid action. Use 'confirm' or 'freeze'.")

    await db.commit()
    return {"message": f"Alert {body.action}ed", "status": alert.status}
