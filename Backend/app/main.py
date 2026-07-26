"""FastAPI application entry point — health check + router mounting."""
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    admin,
    alerts,
    auth,
    cards,
    customer,
    notifications,
    payments,
    reversals,
    support,
    transactions,
    ussd,
)

scheduler = AsyncIOScheduler()


async def auto_decline_expired_payments():
    """Background job: auto-decline pending payments past their expiry."""
    from datetime import datetime, timezone

    from app.db.session import AsyncSessionLocal
    from app.models.models import Customer, Notification, PendingPayment
    from app.services.sms_gateway import SMS_TEMPLATES, send_sms
    from sqlalchemy import select

    async with AsyncSessionLocal() as db:
        now = datetime.now(timezone.utc)
        result = await db.execute(
            select(PendingPayment).where(
                PendingPayment.status == "pending",
                PendingPayment.is_urgent == True,  # noqa: E712
                PendingPayment.expires_at < now,
            )
        )
        expired = result.scalars().all()

        for payment in expired:
            payment.status = "declined"

            # Send SMS
            cust_result = await db.execute(
                select(Customer).where(Customer.id == payment.customer_id)
            )
            customer = cust_result.scalar_one_or_none()
            if customer:
                await send_sms(
                    db,
                    customer.phone,
                    SMS_TEMPLATES["payment_auto_declined"].format(
                        merchant=payment.merchant,
                        amount=f"MWK {abs(payment.amount):,.2f}",
                        last4="****",
                    ),
                    "payment_auto_declined",
                    str(customer.id),
                )

            # Create notification
            notif = Notification(
                customer_id=payment.customer_id,
                title="Payment auto-declined",
                detail=f"Your {payment.merchant} payment was automatically declined (no response in time).",
                tone="warning",
                icon_key="Clock",
                navigation_to="/payment-approval",
            )
            db.add(notif)

        await db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    # Start background scheduler for auto-declining expired payments
    scheduler.add_job(auto_decline_expired_payments, "interval", seconds=30)
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(
    title="SwitchGuard API",
    description="Instant ATM dispense-error detection and automatic fund reversal",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend dev server and any local access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:80", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers
app.include_router(auth.router)
app.include_router(auth.admin_router)
app.include_router(customer.router)
app.include_router(cards.router)
app.include_router(transactions.router)
app.include_router(reversals.router)
app.include_router(alerts.router)
app.include_router(payments.router)
app.include_router(notifications.router)
app.include_router(admin.router)
app.include_router(ussd.router)
app.include_router(support.router)


@app.get("/health")
async def health_check():
    """Health check endpoint — returns 200 when the service is running."""
    return {"status": "ok", "service": "SwitchGuard API"}
