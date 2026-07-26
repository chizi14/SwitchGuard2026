"""Pydantic schemas for all SwitchGuard API request/response models.

Field names and shapes match the frontend mockData.js structures exactly
so the frontend swap-over doesn't require component rewrites.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


# ── Auth ───────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    account_id: str = Field(alias="accountId")
    pin: str
    remember_me: bool = Field(default=False, alias="rememberMe")

    model_config = {"populate_by_name": True}


class AdminLoginRequest(BaseModel):
    staff_id: str = Field(alias="staffId")
    pin: str

    model_config = {"populate_by_name": True}


class ForgotPasswordRequest(BaseModel):
    account_number: str = Field(alias="accountNumber")

    model_config = {"populate_by_name": True}


class TokenResponse(BaseModel):
    token: str


class LoginResponse(BaseModel):
    token: str
    customer: "CustomerOut"


# ── Customer ───────────────────────────────────────────────────
class CustomerOut(BaseModel):
    name: str
    account_number: str = Field(alias="accountNumber")
    account_id: str = Field(alias="accountId")
    phone: str
    initials: str
    home_city: str = Field(alias="homeCity")

    model_config = {"populate_by_name": True, "from_attributes": True}


class BalanceOut(BaseModel):
    amount: float
    account_number: str = Field(alias="accountNumber")
    last_updated: str = Field(alias="lastUpdated")

    model_config = {"populate_by_name": True}


class PreferencesUpdate(BaseModel):
    sms_alerts: bool | None = Field(default=None, alias="smsAlerts")
    push_alerts: bool | None = Field(default=None, alias="pushAlerts")
    two_factor_enabled: bool | None = Field(default=None, alias="twoFactorEnabled")
    language: str | None = None

    model_config = {"populate_by_name": True}


class PreferencesOut(BaseModel):
    sms_alerts: bool = Field(alias="smsAlerts")
    push_alerts: bool = Field(alias="pushAlerts")
    two_factor_enabled: bool = Field(alias="twoFactorEnabled")
    language: str

    model_config = {"populate_by_name": True, "from_attributes": True}


# ── Cards ──────────────────────────────────────────────────────
class CardOut(BaseModel):
    id: str  # UUID as string
    network: str
    label: str
    last4: str
    exp: str  # expiry
    status: str
    frozen: bool = False

    model_config = {"from_attributes": True}


class CardControlsOut(BaseModel):
    require_approval: bool = Field(alias="requireApproval")
    block_online: bool = Field(alias="blockOnline")

    model_config = {"populate_by_name": True, "from_attributes": True}


class CardControlsUpdate(BaseModel):
    require_approval: bool | None = Field(default=None, alias="requireApproval")
    block_online: bool | None = Field(default=None, alias="blockOnline")

    model_config = {"populate_by_name": True}


# ── Transactions ───────────────────────────────────────────────
class TransactionOut(BaseModel):
    id: str
    merchant: str
    timestamp: str
    amount: float
    status: str
    icon: str

    model_config = {"from_attributes": True}


class TransactionListOut(BaseModel):
    transactions: list[TransactionOut]
    total: int
    page: int
    page_size: int


class AtmWebhookPayload(BaseModel):
    transaction_id: str = Field(alias="transactionId")
    card_last4: str = Field(alias="cardLast4")
    amount: float
    atm_location: str = Field(alias="atmLocation")
    timestamp: str
    lat: float | None = None
    lng: float | None = None

    model_config = {"populate_by_name": True}


class AtmErrorWebhookPayload(BaseModel):
    transaction_id: str = Field(alias="transactionId")
    atm_location: str = Field(alias="atmLocation")
    error_code: str = Field(default="Failed to Dispense", alias="errorCode")

    model_config = {"populate_by_name": True}


# ── Reversals ──────────────────────────────────────────────────
class ReversalTimelineStepOut(BaseModel):
    key: str
    title: str
    detail: str
    time: str
    state: str

    model_config = {"from_attributes": True}


class ReversalDetailOut(BaseModel):
    transaction_id: str = Field(alias="transactionId")
    atm_location: str = Field(alias="atmLocation")
    amount: float
    original_timestamp: str = Field(alias="originalTimestamp")
    reversed_on: str | None = Field(default=None, alias="reversedOn")
    timeline: list[ReversalTimelineStepOut]

    model_config = {"populate_by_name": True}


class ReversalTriggerRequest(BaseModel):
    transaction_id: str = Field(alias="transactionId")

    model_config = {"populate_by_name": True}


# ── Security Alerts ────────────────────────────────────────────
class SecurityAlertOut(BaseModel):
    id: str
    amount: float
    time: str
    atm_location: str = Field(alias="atmLocation")
    method: str
    home_city: str = Field(alias="homeCity")
    flagged_city: str = Field(alias="flaggedCity")
    status: str
    reason: str
    distance_km: float = Field(alias="distanceKm")
    minutes_apart: int = Field(alias="minutesApart")
    max_realistic_speed_kmh: int = Field(default=120, alias="maxRealisticSpeedKmh")
    risk_score: int = Field(alias="riskScore")
    detection_ms: int = Field(alias="detectionMs")

    model_config = {"populate_by_name": True, "from_attributes": True}


class AlertHistoryOut(BaseModel):
    id: str
    title: str
    detail: str
    time: str
    status: str

    model_config = {"from_attributes": True}


class AlertResolveRequest(BaseModel):
    action: str  # "confirm" | "freeze"


# ── Payments ───────────────────────────────────────────────────
class PendingPaymentOut(BaseModel):
    id: str
    merchant: str
    type: str
    amount: float
    card_id: str = Field(alias="cardId")
    urgent: bool
    countdown: int | None = None  # seconds remaining

    model_config = {"from_attributes": True}


# ── Notifications ──────────────────────────────────────────────
class NotificationOut(BaseModel):
    id: str
    title: str
    detail: str
    tone: str
    icon_key: str | None = Field(default=None, alias="iconKey")
    read: bool
    time: str
    to: str | None = Field(default=None, alias="navigationTo")

    model_config = {"populate_by_name": True, "from_attributes": True}


# ── Admin ──────────────────────────────────────────────────────
class AdminStatsOut(BaseModel):
    total_reversals_today: int = Field(alias="totalReversalsToday")
    reversals_growth_pct: float = Field(alias="reversalsGrowthPct")
    active_flagged: int = Field(alias="activeFlagged")
    avg_resolution_seconds: int = Field(alias="avgResolutionSeconds")
    avg_resolution_delta_seconds: int = Field(alias="avgResolutionDeltaSeconds")
    manual_process_days: str = Field(default="3–14 days", alias="manualProcessDays")

    model_config = {"populate_by_name": True}


class AdminTransactionRowOut(BaseModel):
    id: str
    customer: str
    account: str
    amount: float
    status: str
    time: str
    date_label: str = Field(alias="dateLabel")

    model_config = {"populate_by_name": True, "from_attributes": True}


class AtmHotspotOut(BaseModel):
    location: str
    failures: int
    trend: str

    model_config = {"from_attributes": True}


# ── USSD ───────────────────────────────────────────────────────
class UssdCallbackRequest(BaseModel):
    session_id: str = Field(alias="sessionId")
    service_code: str = Field(alias="serviceCode")
    phone_number: str = Field(alias="phoneNumber")
    text: str

    model_config = {"populate_by_name": True}


class UssdCallbackResponse(BaseModel):
    response: str  # "CON ..." for continue or "END ..." for end


# ── Support ────────────────────────────────────────────────────
class ReportIssueRequest(BaseModel):
    transaction_id: str = Field(alias="transactionId")
    category: str
    details: str | None = ""

    model_config = {"populate_by_name": True}


class ReportIssueResponse(BaseModel):
    reference_id: str = Field(alias="referenceId")

    model_config = {"populate_by_name": True}


class ChatQueryRequest(BaseModel):
    question: str
    language: str = "en"


class ChatQueryResponse(BaseModel):
    answer: str
    is_fallback: bool = Field(alias="isFallback")

    model_config = {"populate_by_name": True}


class FaqEntryOut(BaseModel):
    id: str
    question: str  # localized
    answer: str  # localized

    model_config = {"from_attributes": True}


# ── Pagination ─────────────────────────────────────────────────
class PaginatedResponse(BaseModel):
    entries: list
    total: int
    page: int
    page_size: int
    total_pages: int


# ── Generic messages ───────────────────────────────────────────
class MessageResponse(BaseModel):
    message: str
