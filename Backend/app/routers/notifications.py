"""Notification routes — list, mark read, and SSE stream."""
import asyncio
import json
from collections import defaultdict
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sse_starlette.sse import EventSourceResponse

from app.core.deps import get_current_customer, get_db
from app.models.models import Notification
from app.schemas.schemas import NotificationOut

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

# In-memory SSE connection tracking (per customer)
_sse_connections: dict[str, list[asyncio.Queue]] = defaultdict(list)


@router.get("", response_model=list[NotificationOut])
async def list_notifications(
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """List all notifications for the customer."""
    customer_id = UUID(claims["sub"])

    result = await db.execute(
        select(Notification)
        .where(Notification.customer_id == customer_id)
        .order_by(Notification.created_at.desc())
    )
    notifications = result.scalars().all()

    return [
        NotificationOut(
            id=str(n.id),
            title=n.title,
            detail=n.detail,
            tone=n.tone,
            iconKey=n.icon_key,
            read=n.is_read,
            time=_format_time(n.created_at),
            to=n.navigation_to,
        )
        for n in notifications
    ]


@router.post("/{notification_id}/read")
async def mark_read(
    notification_id: str,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Mark a single notification as read."""
    try:
        nid = UUID(notification_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid notification ID")

    result = await db.execute(
        select(Notification).where(
            Notification.id == nid,
            Notification.customer_id == UUID(claims["sub"]),
        )
    )
    notif = result.scalar_one_or_none()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    notif.is_read = True
    await db.commit()

    return {"message": "Marked read"}


@router.post("/read-all")
async def mark_all_read(
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Mark all notifications as read."""
    customer_id = UUID(claims["sub"])

    result = await db.execute(
        select(Notification).where(
            Notification.customer_id == customer_id,
            Notification.is_read == False,  # noqa: E712
        )
    )
    for notif in result.scalars().all():
        notif.is_read = True
    await db.commit()

    return {"message": "All notifications marked read"}


@router.get("/stream")
async def notification_stream(
    request: Request,
    claims: dict = Depends(get_current_customer),
):
    """SSE stream for real-time notifications."""
    customer_id = claims["sub"]
    queue: asyncio.Queue = asyncio.Queue()
    _sse_connections[customer_id].append(queue)

    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    data = await asyncio.wait_for(queue.get(), timeout=30)
                    yield {"event": "notification", "data": json.dumps(data)}
                except asyncio.TimeoutError:
                    yield {"event": "ping", "data": "{}"}
        finally:
            _sse_connections[customer_id].remove(queue)

    return EventSourceResponse(event_generator())


def push_notification_to_sse(customer_id: str, notification_data: dict):
    """Push a notification to all SSE connections for a customer."""
    for queue in _sse_connections.get(customer_id, []):
        try:
            queue.put_nowait(notification_data)
        except asyncio.QueueFull:
            pass


def _format_time(dt) -> str:
    """Format a datetime as a relative or absolute time string."""
    if dt is None:
        return ""
    from datetime import datetime, timezone

    now = datetime.now(timezone.utc)
    diff = now - dt

    if diff.total_seconds() < 3600:
        mins = int(diff.total_seconds() / 60)
        return f"{mins} minutes ago" if mins > 0 else "Just now"
    if diff.total_seconds() < 86400:
        hrs = int(diff.total_seconds() / 3600)
        return f"{hrs} hours ago"
    if diff.days == 1:
        return "Yesterday"
    return dt.strftime("%b %d, %Y")
