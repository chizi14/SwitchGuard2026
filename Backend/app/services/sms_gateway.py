"""SMS gateway service — simulated for hackathon.

Writes to sms_log with status="sent". Swapping in the real Africa's Talking
client later is a one-file change.
"""

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import SmsLog


async def send_sms(
    db: AsyncSession,
    phone: str,
    message: str,
    trigger_event: str,
    customer_id: str | None = None,
) -> SmsLog:
    """Simulate sending an SMS by logging it to sms_log.

    In production, this would call Africa's Talking SMS API:
      - https://africastalking.com/sms
      - POST to https://api.africastalking.com/version1/messaging
      - Auth via ApiKey header

    Args:
        db: Database session
        phone: Recipient phone number (e.g. +265991442018)
        message: SMS body text
        trigger_event: What triggered this SMS (block, unblock, reversal, etc.)
        customer_id: Optional customer UUID string

    Returns:
        The created SmsLog record.
    """
    from uuid import UUID

    sms = SmsLog(
        phone=phone,
        message=message,
        trigger_event=trigger_event,
        status="sent",
    )
    if customer_id:
        try:
            sms.customer_id = UUID(customer_id)
        except (ValueError, TypeError):
            pass

    db.add(sms)
    await db.flush()
    return sms


# Message templates matching frontend PhoneSmsPreview patterns
SMS_TEMPLATES = {
    "card_blocked": "SwitchGuard: Your card ending {last4} has been blocked. No new transactions can be made. Reply HELP for support.",
    "card_unblocked": "SwitchGuard: Your card ending {last4} has been unblocked and is ready to use.",
    "card_frozen": "Hi {name}, your card is temporarily frozen after you flagged the {city} withdrawal as not you. Visit Security to unfreeze it.",
    "alert_confirmed": "Hi {name}, thanks for confirming the {amount} withdrawal in {city}. No further action needed.",
    "reversal_complete": "SwitchGuard: {amount} has been returned to your account ending {account_last4}. Ref {txn_id}.",
    "payment_approved": "SwitchGuard: Your {merchant} payment of {amount} on card ending {last4} was approved.",
    "payment_declined": "SwitchGuard: Your {merchant} payment of {amount} on card ending {last4} was declined.",
    "payment_blocked": "SwitchGuard: Your {merchant} payment of {amount} on card ending {last4} was blocked, and the merchant was flagged.",
    "payment_auto_declined": "SwitchGuard: Your {merchant} payment of {amount} on card ending {last4} was automatically declined (no response in time).",
}
