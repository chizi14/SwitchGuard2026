"""Admin dashboard routes — stats, transaction monitoring, CSV export, ATM hotspots."""
import csv
import io
from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_admin, get_db
from app.models.models import (
    AtmFailureStat,
    Customer,
    Reversal,
    SecurityAlert,
    Transaction,
)
from app.schemas.schemas import (
    AdminStatsOut,
    AdminTransactionRowOut,
    AtmHotspotOut,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats", response_model=AdminStatsOut)
async def get_stats(
    claims: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get admin dashboard aggregate stats."""
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    # Total reversals today
    reversals_today_q = select(func.count()).select_from(Reversal).where(
        Reversal.created_at >= today
    )
    total_reversals = (await db.execute(reversals_today_q)).scalar() or 0

    # Active flagged items
    flagged_q = select(func.count()).select_from(SecurityAlert).where(
        SecurityAlert.status == "Needs Review"
    )
    active_flagged = (await db.execute(flagged_q)).scalar() or 0

    # Average resolution time (simulated for hackathon)
    avg_resolution = 184  # from frontend mockData

    return AdminStatsOut(
        totalReversalsToday=total_reversals,
        reversalsGrowthPct=12.5,
        activeFlagged=active_flagged,
        avgResolutionSeconds=avg_resolution,
        avgResolutionDeltaSeconds=-14,
        manualProcessDays="3–14 days",
    )


@router.get("/transactions")
async def list_admin_transactions(
    search: str = Query(""),
    status_filter: str = Query("All", alias="status"),
    date_filter: str = Query("All", alias="date"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    claims: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all transactions for admin monitoring, with filters and pagination."""
    # Join transactions with customers
    base_q = select(Transaction, Customer).join(
        Customer, Transaction.customer_id == Customer.id
    )

    # Apply filters
    if status_filter != "All":
        base_q = base_q.where(Transaction.status == status_filter)

    if date_filter == "Today":
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        base_q = base_q.where(Transaction.timestamp >= today)
    elif date_filter == "Yesterday":
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        from datetime import timedelta
        yesterday = today - timedelta(days=1)
        base_q = base_q.where(Transaction.timestamp >= yesterday, Transaction.timestamp < today)

    if search:
        search_term = f"%{search}%"
        base_q = base_q.where(
            (Customer.name.ilike(search_term))
            | (Transaction.id.cast(str).ilike(search_term))
        )

    base_q = base_q.order_by(Transaction.timestamp.desc())

    # Count total
    count_q = select(func.count()).select_from(base_q.subquery())
    total = (await db.execute(count_q)).scalar() or 0

    # Paginate
    offset = (page - 1) * page_size
    result = await db.execute(base_q.offset(offset).limit(page_size))
    rows = result.all()

    entries = []
    for txn, cust in rows:
        date_label = "Today"  # simplified
        entries.append(
            AdminTransactionRowOut(
                id=f"TXN-{txn.id.hex[:8].upper()}-S",
                customer=cust.name,
                account=f"**** {cust.account_number[-4:]}",
                amount=txn.amount,
                status=txn.status,
                time=txn.timestamp.strftime("%I:%M:%S %p") if txn.timestamp else "",
                dateLabel=date_label,
            )
        )

    return {
        "entries": entries,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": max(1, (total + page_size - 1) // page_size),
    }


@router.get("/transactions/export")
async def export_csv(
    claims: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Export transactions as CSV."""
    result = await db.execute(
        select(Transaction, Customer)
        .join(Customer, Transaction.customer_id == Customer.id)
        .order_by(Transaction.timestamp.desc())
        .limit(1000)
    )
    rows = result.all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Customer Name", "Transaction ID", "Amount", "Status", "Time"])

    for txn, cust in rows:
        writer.writerow([
            cust.name,
            f"TXN-{txn.id.hex[:8].upper()}",
            txn.amount,
            txn.status,
            txn.timestamp.strftime("%Y-%m-%d %H:%M:%S") if txn.timestamp else "",
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=switchguard-transactions-{datetime.now(timezone.utc).strftime('%Y-%m-%d')}.csv"
        },
    )


@router.get("/atm-hotspots", response_model=list[AtmHotspotOut])
async def get_atm_hotspots(
    claims: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get ATM failure hotspot statistics."""
    result = await db.execute(
        select(AtmFailureStat).order_by(AtmFailureStat.failures_count.desc())
    )
    stats = result.scalars().all()

    return [
        AtmHotspotOut(
            location=s.atm_location,
            failures=s.failures_count,
            trend=s.trend,
        )
        for s in stats
    ]
