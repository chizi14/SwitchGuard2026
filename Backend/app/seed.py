"""Seed script — populates the database with realistic Malawian data.

Matches the frontend mockData.js shapes exactly.
Run once: python -m app.seed
"""

import asyncio
import json
from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.core.security import hash_secret
from app.db.session import AsyncSessionLocal
from app.models.models import (
    Account,
    AdminUser,
    AtmFailureStat,
    Card,
    Customer,
    CustomerPreferences,
    FaqEntry,
    LoginHistory,
    Notification,
    PendingPayment,
    SecurityAlert,
    Transaction,
)


async def seed():
    async with AsyncSessionLocal() as db:
        # Check if already seeded
        result = await db.execute(select(Customer).limit(1))
        if result.scalar_one_or_none():
            print("Database already seeded — skipping.")
            return

        now = datetime.now(timezone.utc)

        # ── Customer: Thoko Mvula ──────────────────────────────
        pin_hash = hash_secret("1234")
        pwd_hash = hash_secret("admin123")

        customer = Customer(
            name="Thoko Mvula",
            account_number="**** **** 5829",
            phone="+265991442018",
            home_city="Blantyre",
            initials="TM",
            password_hash=pwd_hash,
            pin_hash=pin_hash,
        )
        db.add(customer)
        await db.flush()

        # Account
        account = Account(
            customer_id=customer.id,
            account_number="**** **** 5829",
            balance=45280.64,
            currency="MWK",
        )
        db.add(account)

        # Preferences
        prefs = CustomerPreferences(
            customer_id=customer.id,
            sms_alerts=True,
            push_alerts=True,
            two_factor_enabled=True,
            language="en",
        )
        db.add(prefs)

        # Cards
        card1 = Card(
            customer_id=customer.id,
            network="Visa",
            label="NBM Visa Debit",
            last4="4242",
            expiry="12/26",
            status="Active",
            frozen=False,
        )
        card2 = Card(
            customer_id=customer.id,
            network="Mastercard",
            label="NBM Travel Card",
            last4="8891",
            expiry="08/26",
            status="Active",
            frozen=False,
        )
        db.add_all([card1, card2])
        await db.flush()

        # ── Transactions ───────────────────────────────────────
        txns = [
            Transaction(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="Chipiku Stores",
                amount=-124000,
                timestamp=now - timedelta(hours=1),
                status="Verified",
                type="purchase",
                icon_category="cart",
            ),
            Transaction(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="NBM ATM Blantyre Main",
                amount=-50000,
                timestamp=now - timedelta(hours=2),
                status="Reversed",
                type="atm",
                icon_category="atm",
                atm_location="NBM Blantyre Main — Lobby 1",
                lat=-15.7861,
                lng=35.0058,
            ),
            Transaction(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="Airtel Money",
                amount=-15000,
                timestamp=now - timedelta(days=1),
                status="Verified",
                type="mobile",
                icon_category="mobile",
            ),
            Transaction(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="Salary Deposit",
                amount=560000,
                timestamp=now - timedelta(days=1, hours=10),
                status="Verified",
                type="income",
                icon_category="income",
            ),
            Transaction(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="Airtel Money",
                amount=-25000,
                timestamp=now - timedelta(days=3),
                status="Verified",
                type="mobile",
                icon_category="mobile",
            ),
            Transaction(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="Kibanda Market",
                amount=-18750,
                timestamp=now - timedelta(days=3, hours=2),
                status="Verified",
                type="purchase",
                icon_category="cart",
            ),
            Transaction(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="NBM ATM Lilongwe City",
                amount=-50000,
                timestamp=now - timedelta(days=4),
                status="Reversed",
                type="atm",
                icon_category="atm",
                atm_location="NBM Lilongwe City Centre",
                lat=-13.9626,
                lng=33.7741,
            ),
            Transaction(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="National Switch transfer",
                amount=-7500,
                timestamp=now - timedelta(days=4, hours=8),
                status="Verified",
                type="mobile",
                icon_category="mobile",
            ),
            Transaction(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="NBM ATM Mzuzu Main",
                amount=-60000,
                timestamp=now - timedelta(days=5),
                status="Reversed",
                type="atm",
                icon_category="atm",
                atm_location="NBM Mzuzu Branch ATM",
                lat=-11.4587,
                lng=34.0151,
            ),
            Transaction(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="TotalEnergies",
                amount=-22000,
                timestamp=now - timedelta(days=5, hours=5),
                status="Verified",
                type="purchase",
                icon_category="cart",
            ),
        ]
        db.add_all(txns)
        await db.flush()

        # ── Security Alert: velocity fraud ─────────────────────
        alert = SecurityAlert(
            customer_id=customer.id,
            transaction_id=txns[6].id,  # Lilongwe ATM txn
            amount=450,
            atm_location="ATM #4922 — Area 47, Lilongwe",
            method="Physical Debit Card",
            home_city="Blantyre",
            flagged_city="Lilongwe",
            status="Needs Review",
            reason=(
                "Two withdrawals detected in different cities 6 minutes apart. "
                "This distance is physically impossible to travel in that time."
            ),
            distance_km=320,
            minutes_apart=6,
            risk_score=94,
            detection_ms=340,
        )
        db.add(alert)

        # ── Notifications ──────────────────────────────────────
        notifs = [
            Notification(
                customer_id=customer.id,
                title="Funds reversed",
                detail="MWK 50,000.00 was returned to your account after a failed ATM withdrawal.",
                tone="success",
                icon_key="RotateCcw",
                is_read=False,
                navigation_to="/activity",
                created_at=now - timedelta(hours=2),
            ),
            Notification(
                customer_id=customer.id,
                title="Suspicious activity flagged",
                detail="A withdrawal in Lilongwe was flagged — two withdrawals in different cities minutes apart.",
                tone="warning",
                icon_key="ShieldAlert",
                is_read=False,
                navigation_to="/security/alert",
                created_at=now - timedelta(hours=3),
            ),
            Notification(
                customer_id=customer.id,
                title="SMS confirmation sent",
                detail="A confirmation text was sent to your number ending in *2018.",
                tone="primary",
                icon_key="MessageSquare",
                is_read=True,
                navigation_to="/activity",
                created_at=now - timedelta(hours=3),
            ),
            Notification(
                customer_id=customer.id,
                title="Card blocked",
                detail="Your NBM Visa Debit card was blocked at your request.",
                tone="error",
                icon_key="Lock",
                is_read=True,
                navigation_to="/security",
                created_at=now - timedelta(days=1),
            ),
        ]
        db.add_all(notifs)

        # ── Pending Payments ───────────────────────────────────
        pending = [
            PendingPayment(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="Amazon Purchase",
                type="One-time purchase",
                amount=42000,
                is_urgent=True,
                expires_at=now + timedelta(seconds=45),
                status="pending",
            ),
            PendingPayment(
                customer_id=customer.id,
                card_id=card1.id,
                merchant="Netflix Subscription",
                type="Recurring subscription",
                amount=12500,
                is_urgent=False,
                status="pending",
            ),
            PendingPayment(
                customer_id=customer.id,
                card_id=card2.id,
                merchant="Prime Video Subscription",
                type="Recurring subscription",
                amount=8900,
                is_urgent=False,
                status="pending",
            ),
            PendingPayment(
                customer_id=customer.id,
                card_id=card2.id,
                merchant="Alibaba Order",
                type="One-time purchase",
                amount=67500,
                is_urgent=False,
                status="pending",
            ),
        ]
        db.add_all(pending)

        # ── Login History ──────────────────────────────────────
        logins = [
            LoginHistory(
                customer_id=customer.id,
                city="Blantyre",
                region="Southern Region",
                latitude=-15.7861,
                longitude=35.0058,
                timestamp=now - timedelta(hours=1),
            ),
            LoginHistory(
                customer_id=customer.id,
                city="Lilongwe",
                region="Central Region",
                latitude=-13.9626,
                longitude=33.7741,
                timestamp=now - timedelta(days=1),
            ),
            LoginHistory(
                customer_id=customer.id,
                city="Mzuzu",
                region="Northern Region",
                latitude=-11.4587,
                longitude=34.0151,
                timestamp=now - timedelta(days=3),
            ),
        ]
        db.add_all(logins)

        # ── Admin User ─────────────────────────────────────────
        admin = AdminUser(
            staff_id="ADMIN001",
            password_hash=hash_secret("admin123"),
            role="admin",
        )
        db.add(admin)

        # ── ATM Failure Hotspots ───────────────────────────────
        hotspots = [
            AtmFailureStat(atm_location="NBM Blantyre Main — Lobby 1", failures_count=14, trend="up"),
            AtmFailureStat(atm_location="NBM Lilongwe City Centre", failures_count=9, trend="up"),
            AtmFailureStat(atm_location="NBM Mzuzu Branch ATM", failures_count=5, trend="down"),
        ]
        db.add_all(hotspots)

        # ── FAQ Entries ────────────────────────────────────────
        faqs = [
            FaqEntry(
                question_en="What is a dispense error?",
                answer_en="A dispense error happens when an ATM deducts money from your account but fails to physically release the cash. It's usually a machine fault — not something you did wrong. SwitchGuard detects these automatically and starts the reversal process.",
                question_ch="Ndi chiyani dispense error?",
                answer_ch="Dispense error ndi chinthu chomwe chimachitika poti ATM yabadwa ndalama paakaunti yanu koma sinapatsire ndalama zimenezi. Nthawi zambiri ndi vuto la chida — osati chifukwa chomwe mwachita. SwitchGuard amadziwa zimenezi ndikuyamba kubwezera ndalama.",
                keywords=json.dumps(["dispense", "error", "atm", "took", "money", "cash", "didn't give", "no cash", "failed withdrawal", "deducted"]),
            ),
            FaqEntry(
                question_en="How fast do reversals happen?",
                answer_en="Once SwitchGuard confirms the dispense error through the ATM log, transaction ID, and ownership checks, the reversal is processed automatically. Most reversals complete within 2 to 10 minutes, and you'll receive an SMS confirmation when the funds are credited back.",
                question_ch="Bwezera amachitika msangawi?",
                answer_ch="SwitchGuard atapoona kuti ndi dispense error kudzera pa ATM log, transaction ID, ndi kuyeza milandu, bwezera amachitika otomoka. Bwezera ambiri amaliza m'ma mphindi 2 mpaka 10, ndipo mudzalandira SMS kutsimikizira poti ndalama zabwezeredwa.",
                keywords=json.dumps(["reversal", "how fast", "how long", "minutes", "time", "credit", "back", "refund"]),
            ),
            FaqEntry(
                question_en="How do I block a lost or stolen card?",
                answer_en="Go to the Security page and tap Block Card, or use USSD by dialling *384*46# and selecting option 3 from any phone. Blocking takes effect immediately — no branch visit needed. You can unblock it later from the same page if you find it.",
                question_ch="Ndiwonetsera bwanji kadi yotayidwa kapena yabedwa?",
                answer_ch="Pita ku Security page ndikudina Block Card, kapena gwiritsani USSD pochira *384*46# ndikusankha option 3 kuchoka ku foni iliyonse. Kutsekera kumayamba nthawi yomwe — osafunika kupita ku bank. Mungatsegule kembali ku page yomweyo muli kupeza.",
                keywords=json.dumps(["block", "lost", "stolen", "stole", "card", "someone", "theft"]),
            ),
            FaqEntry(
                question_en="What is the security tip / 2FA for?",
                answer_en="Two-factor authentication adds a second approval step when logging in, so even if someone gets your password, they still can't access your account without the second verification. You can manage it from the Security settings.",
                question_ch="Security tip / 2FA ndi ya chiyani?",
                answer_ch="Two-factor authentication imapatsa chilolezo chachiwiri poti mulowe m'akaunti, kotero ngati munthu ali ndi mawu achinsinsi anu, sadzatha kulowa m'akaunti yanu popanda kuyezetsa kachiwiri. Mungayimange mu Security settings.",
                keywords=json.dumps(["2fa", "two-factor", "two factor", "security tip", "authentication", "approve", "verification"]),
            ),
            FaqEntry(
                question_en="How do I use USSD banking?",
                answer_en="Dial *384*46# from any phone — smartphone or basic feature phone. No internet or app required. You can check your balance, report a failed withdrawal, block your card, and see recent alerts, all through a simple text menu.",
                question_ch="Ndiwagwiritsa bwanji USSD banking?",
                answer_ch="Pechirani *384*46# kuchoka ku foni iliyonse — smartphone kapena foni yosavuta. Osafunika intaneti kapena app. Mungaone baki, muziwuza za withdrawal yolephera, kutsekera kadi yanu, ndikuona alerts zachilendo, zonse kudzera pa menyu yosavuta.",
                keywords=json.dumps(["ussd", "phone", "feature phone", "no internet", "no app", "no smartphone", "dial", "code", "any phone", "*384*46"]),
            ),
        ]
        db.add_all(faqs)

        await db.commit()
        print("✅ Database seeded successfully!")
        print(f"   Customer: {customer.name} (PIN: 1234)")
        print(f"   Admin: ADMIN001 (PIN: admin123)")
        print(f"   Cards: Visa **4242, MC **8891")
        print(f"   Balance: MWK 45,280.64")
        print(f"   Transactions: {len(txns)} seeded")
        print(f"   Alerts: 1 velocity fraud case (Lilongwe)")
        print(f"   Pending payments: 4 (1 urgent with countdown)")


if __name__ == "__main__":
    asyncio.run(seed())
