"""Authentication routes — customer and admin login, forgot password."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.core.security import create_access_token, verify_secret
from app.models.models import AdminUser, Customer
from app.schemas.schemas import (
    AdminLoginRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    TokenResponse,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def customer_login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate a customer and return a JWT."""
    result = await db.execute(
        select(Customer).where(
            (Customer.account_number.ilike(f"%{body.account_id}%"))
            | (Customer.id.cast(str) == body.account_id)
        )
    )
    customer = result.scalar_one_or_none()

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid account number or PIN",
        )

    if customer.locked_until and customer.locked_until > datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail="Account is locked. Try again later.",
        )

    if not verify_secret(body.pin, customer.pin_hash):
        customer.failed_login_attempts += 1
        if customer.failed_login_attempts >= 5:
            customer.locked_until = datetime.now(timezone.utc)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid account number or PIN",
        )

    # Reset on success
    customer.failed_login_attempts = 0
    customer.locked_until = None
    await db.commit()

    token = create_access_token(
        subject=str(customer.id),
        extra_claims={"role": "customer"},
        expires_minutes=60 * 24 if body.remember_me else None,
    )

    return LoginResponse(
        token=token,
        customer={
            "name": customer.name,
            "accountNumber": customer.account_number,
            "accountId": f"SG-{customer.account_number[-4:]}-{customer.id.hex[:4]}".upper(),
            "phone": customer.phone,
            "initials": customer.initials,
            "homeCity": customer.home_city,
        },
    )


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(body: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Stub: request a PIN reset. In production, sends an SMS with a reset link."""
    result = await db.execute(
        select(Customer).where(Customer.account_number == body.account_number)
    )
    customer = result.scalar_one_or_none()

    if not customer:
        # Don't reveal whether the account exists
        return MessageResponse(
            message="If the account exists, a reset link has been sent to the registered phone number."
        )

    return MessageResponse(
        message="If the account exists, a reset link has been sent to the registered phone number."
    )


# ── Admin auth ──────────────────────────────────────────────────
admin_router = APIRouter(prefix="/api/admin", tags=["admin-auth"])


@admin_router.post("/login", response_model=TokenResponse)
async def admin_login(body: AdminLoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate an admin/staff user and return an elevated JWT."""
    result = await db.execute(
        select(AdminUser).where(AdminUser.staff_id == body.staff_id)
    )
    admin = result.scalar_one_or_none()

    if not admin or not verify_secret(body.pin, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid staff ID or PIN",
        )

    admin.last_login = datetime.now(timezone.utc)
    await db.commit()

    token = create_access_token(
        subject=str(admin.id),
        extra_claims={"role": "admin", "staff_id": admin.staff_id},
    )

    return TokenResponse(token=token)
