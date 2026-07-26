"""USSD session state machine — Africa's Talking callback format.

Simulates the *384*46# USSD menu tree from the frontend mockData.js.
"""
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Customer, UssdSession

USSD_SHORTCODE = "*384*46#"

# Simplified menu tree — matches frontend's ussdMenu in mockData.js
MENU = {
    "root": {
        "text": "SwitchGuard\n1. Check balance\n2. Report failed withdrawal\n3. Block my card\n4. Recent alerts\n0. Exit",
        "actions": {"1": "balance", "2": "report-start", "3": "block-confirm", "4": "alerts", "0": "exit"},
    },
    "balance": {
        "text": "Account balance:\nMWK 45,280.64\n\n0. Back to menu\n00. Exit",
        "actions": {"0": "root", "00": "exit"},
    },
    "report-start": {
        "text": "Report failed withdrawal\nEnter the amount you were charged but not given, e.g. 50000\n\n0. Back",
        "actions": {"0": "root"},
        "is_input": True,
        "next": "report-confirm",
    },
    "report-confirm": {
        "text": "We found a matching ATM error for MWK 50,000.\n\n1. Confirm and reverse\n0. Back to menu",
        "actions": {"1": "report-done", "0": "root"},
    },
    "report-done": {
        "text": "Reversal started.\nMWK 50,000 will be credited within 10 minutes.\nSMS confirmation will follow.\n\n0. Back to menu\n00. Exit",
        "actions": {"0": "root", "00": "exit"},
    },
    "block-confirm": {
        "text": "Block your card ending 4242?\n1. Yes, block it\n2. No, go back",
        "actions": {"1": "block-done", "2": "root"},
    },
    "block-done": {
        "text": "Your card ending 4242 is now blocked.\nSMS confirmation sent.\n\n0. Back to menu\n00. Exit",
        "actions": {"0": "root", "00": "exit"},
    },
    "alerts": {
        "text": "Recent alerts:\n1. Withdrawal flagged in Lilongwe\n2. Card blocked (self-requested)\n\n0. Back to menu",
        "actions": {"1": "root", "2": "root", "0": "root"},
    },
    "exit": {
        "text": f"Session ended. Dial {USSD_SHORTCODE} any time to check your account.",
        "actions": {},
    },
}


async def handle_ussd_callback(
    db: AsyncSession,
    session_id: str,
    phone_number: str,
    text: str,
) -> str:
    """Process a USSD callback and return the response string.

    Africa's Talking USSD API format:
      - "CON <text>" = continue (user still in session)
      - "END <text>" = end session

    Args:
        db: Database session
        session_id: Africa's Talking session ID
        phone_number: Caller's phone number
        text: User's input (empty on first dial, then accumulated choices)

    Returns:
        Response string to send back (CON ... or END ...)
    """
    # Find or create session
    result = await db.execute(
        select(UssdSession).where(UssdSession.session_id == session_id)
    )
    session = result.scalar_one_or_none()

    if session is None:
        # Try to identify the customer by phone
        cust_result = await db.execute(
            select(Customer).where(Customer.phone == phone_number)
        )
        customer = cust_result.scalar_one_or_none()

        session = UssdSession(
            session_id=session_id,
            customer_id=customer.id if customer else None,
            current_menu="root",
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=5),
        )
        db.add(session)
        await db.flush()

    # Parse user input
    inputs = text.split("*") if text else []
    current_menu = "root"

    # Navigate through the menu based on accumulated inputs
    for i, inp in enumerate(inputs):
        if not inp:
            continue

        menu = MENU.get(current_menu, MENU["root"])

        if menu.get("is_input") and i == len(inputs) - 1:
            # This is the input for an input-expected menu
            session.input_value = inp
            session.current_menu = current_menu
            await db.commit()

            next_menu_key = menu.get("next", "root")
            next_menu = MENU.get(next_menu_key, MENU["root"])
            session.current_menu = next_menu_key
            await db.commit()

            if next_menu.get("actions"):
                return f"CON {next_menu['text']}"
            return f"END {next_menu['text']}"

        # Navigate based on the option selected
        action = menu.get("actions", {}).get(inp)
        if action:
            current_menu = action
        else:
            # Invalid input, restart
            current_menu = "root"

    session.current_menu = current_menu
    await db.commit()

    target_menu = MENU.get(current_menu, MENU["root"])

    if target_menu.get("actions"):
        return f"CON {target_menu['text']}"
    return f"END {target_menu['text']}"
