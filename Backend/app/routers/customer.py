"""Customer profile, balance, and preferences routes."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_customer, get_db
from app.models.models import Account, Customer, CustomerPreferences
from app.schemas.schemas import (
    BalanceOut,
    CustomerOut,
    PreferencesOut,
    PreferencesUpdate,
)

router = APIRouter(prefix="/api/customer", tags=["customer"])


@router.get("/profile", response_model=CustomerOut)
async def get_profile(
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Get the authenticated customer's profile."""
    customer = await _get_customer(claims, db)
    return CustomerOut(
        name=customer.name,
        accountNumber=customer.account_number,
        accountId=f"SG-{customer.account_number[-4:]}-{customer.id.hex[:4]}".upper(),
        phone=customer.phone,
        initials=customer.initials,
        homeCity=customer.home_city,
    )


@router.get("/balance", response_model=BalanceOut)
async def get_balance(
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Get the customer's current account balance."""
    customer = await _get_customer(claims, db)

    result = await db.execute(
        select(Account).where(Account.customer_id == customer.id)
    )
    account = result.scalars().first()

    if not account:
        return BalanceOut(amount=0.0, accountNumber=customer.account_number, lastUpdated="N/A")

    return BalanceOut(
        amount=account.balance,
        accountNumber=account.account_number,
        lastUpdated=account.last_updated.strftime("Today, %I:%M %p") if account.last_updated else "N/A",
    )


@router.put("/preferences", response_model=PreferencesOut)
async def update_preferences(
    body: PreferencesUpdate,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Update customer notification and security preferences."""
    customer = await _get_customer(claims, db)

    result = await db.execute(
        select(CustomerPreferences).where(CustomerPreferences.customer_id == customer.id)
    )
    prefs = result.scalar_one_or_none()

    if not prefs:
        prefs = CustomerPreferences(customer_id=customer.id)
        db.add(prefs)

    if body.sms_alerts is not None:
        prefs.sms_alerts = body.sms_alerts
    if body.push_alerts is not None:
        prefs.push_alerts = body.push_alerts
    if body.two_factor_enabled is not None:
        prefs.two_factor_enabled = body.two_factor_enabled
    if body.language is not None:
        prefs.language = body.language

    await db.commit()
    await db.refresh(prefs)

    return PreferencesOut(
        smsAlerts=prefs.sms_alerts,
        pushAlerts=prefs.push_alerts,
        twoFactorEnabled=prefs.two_factor_enabled,
        language=prefs.language,
    )


async def _get_customer(claims: dict, db: AsyncSession) -> Customer:
    """Helper: fetch Customer from JWT claims."""
    cust_id = UUID(claims["sub"])
    result = await db.execute(select(Customer).where(Customer.id == cust_id))
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer
