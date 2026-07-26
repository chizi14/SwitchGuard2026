"""USSD callback route — Africa's Talking session state machine."""
from fastapi import APIRouter, Depends, Form
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.services.ussd_engine import handle_ussd_callback

router = APIRouter(prefix="/api/ussd", tags=["ussd"])


@router.post("/callback")
async def ussd_callback(
    sessionId: str = Form(...),
    serviceCode: str = Form(...),
    phoneNumber: str = Form(...),
    text: str = Form(""),
    db: AsyncSession = Depends(get_db),
):
    """Handle Africa's Talking USSD callback.

    Africa's Talking POSTs form data with these fields:
      - sessionId: unique session identifier
      - serviceCode: the USSD shortcode
      - phoneNumber: caller's phone number
      - text: accumulated user input (empty on first dial)
    """
    response_text = await handle_ussd_callback(
        db=db,
        session_id=sessionId,
        phone_number=phoneNumber,
        text=text,
    )
    return response_text
