"""Support routes — report issue, help chat, FAQ."""
import json
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_customer, get_db
from app.models.models import FaqEntry, SupportIssue, Transaction
from app.schemas.schemas import (
    ChatQueryRequest,
    ChatQueryResponse,
    FaqEntryOut,
    ReportIssueRequest,
    ReportIssueResponse,
)

router = APIRouter(prefix="/api", tags=["support"])


# ── Report Issue ───────────────────────────────────────────────
@router.post("/issues", response_model=ReportIssueResponse)
async def report_issue(
    body: ReportIssueRequest,
    claims: dict = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
):
    """Submit a support issue regarding a transaction."""
    customer_id = UUID(claims["sub"])

    try:
        txn_uuid = UUID(body.transaction_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid transaction ID")

    # Verify the transaction exists and belongs to the customer
    txn_result = await db.execute(
        select(Transaction).where(
            Transaction.id == txn_uuid,
            Transaction.customer_id == customer_id,
        )
    )
    txn = txn_result.scalar_one_or_none()
    if not txn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    ref_id = f"TXN-{txn.id.hex[:8].upper()}-RPT"

    issue = SupportIssue(
        customer_id=customer_id,
        transaction_id=txn.id,
        category=body.category,
        details=body.details,
        reference_id=ref_id,
    )
    db.add(issue)
    await db.commit()

    return ReportIssueResponse(referenceId=ref_id)


# ── Help Chat ──────────────────────────────────────────────────
@router.post("/chat/query", response_model=ChatQueryResponse)
async def chat_query(
    body: ChatQueryRequest,
    db: AsyncSession = Depends(get_db),
):
    """Answer a help chat question by keyword-matching against FAQ entries."""
    result = await db.execute(select(FaqEntry))
    faqs = result.scalars().all()

    lower_q = body.question.lower()

    for faq in faqs:
        keywords = []
        if faq.keywords:
            try:
                keywords = json.loads(faq.keywords)
            except (json.JSONDecodeError, TypeError):
                keywords = []

        for kw in keywords:
            if kw.lower() in lower_q:
                answer = faq.answer_ch if body.language == "ch" else faq.answer_en
                return ChatQueryResponse(answer=answer, isFallback=False)

    # Fallback
    fallback_en = "I'm not sure about that yet — try Contact Support for help from our team."
    fallback_ch = "Sindine woyimira kale — yesetsani Contact Support kuti mupeze thandizo kuchoka kwa ife."
    return ChatQueryResponse(
        answer=fallback_ch if body.language == "ch" else fallback_en,
        isFallback=True,
    )


# ── FAQ ────────────────────────────────────────────────────────
@router.get("/faq", response_model=list[FaqEntryOut])
async def list_faq(
    language: str = "en",
    db: AsyncSession = Depends(get_db),
):
    """List all FAQ entries in the requested language."""
    result = await db.execute(select(FaqEntry))
    faqs = result.scalars().all()

    return [
        FaqEntryOut(
            id=str(f.id),
            question=f.question_ch if language == "ch" else f.question_en,
            answer=f.answer_ch if language == "ch" else f.answer_en,
        )
        for f in faqs
    ]
