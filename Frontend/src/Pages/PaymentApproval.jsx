import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ShoppingBag,
  Tv,
  PlayCircle,
  CheckCircle2,
  XCircle,
  CreditCard,
  Lock,
  ShieldAlert,
  Clock,
} from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import Button from "../Components/Button";
import Chip from "../Components/Chip";
import PhoneSmsPreview from "../Components/PhoneSmsPreview";
import { getPendingPayments, getCards, approvePayment, declinePayment, blockPayment, currency } from "../api";

const tabs = [
  { id: "pending", label: "Pending Approval" },
  { id: "controls", label: "Card Controls" },
];

const merchantIcons = {
  "Amazon Purchase": ShoppingCart,
  "Netflix Subscription": Tv,
  "Prime Video Subscription": PlayCircle,
  "Alibaba Order": ShoppingBag,
};

function ToggleRow({ icon: Icon, title, detail, checked, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0">
          <Icon size={16} className="text-on-surface-variant" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-on-surface">{title}</p>
          {detail && <p className="text-xs text-on-surface-variant mt-0.5">{detail}</p>}
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full shrink-0 transition-colors disabled:opacity-40 ${
          checked ? "bg-primary" : "bg-surface-highest"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-soft transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function PendingRow({ item, card, onAction }) {
  const [countdown, setCountdown] = useState(item.urgent ? item.countdown : null);
  const [status, setStatus] = useState("pending");
  const intervalRef = useRef(null);
  const Icon = merchantIcons[item.merchant] || ShoppingCart;

  useEffect(() => {
    if (!item.urgent || status !== "pending") return;
    intervalRef.current = setInterval(() => {
      setCountdown((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setStatus("declined");
          onAction(item, "declined", true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [status]);

  const act = (newStatus) => {
    clearInterval(intervalRef.current);
    setStatus(newStatus);
    onAction(item, newStatus, false);
  };

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center shrink-0">
            <Icon size={19} className="text-on-surface-variant" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-on-surface truncate">{item.merchant}</p>
            <p className="text-xs text-on-surface-variant">
              {item.type} · {card?.label}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-on-surface">{currency(item.amount)}</p>
          {status === "pending" && item.urgent && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary mt-0.5">
              <Clock size={11} /> {countdown}s left
            </span>
          )}
        </div>
      </div>

      {status === "pending" ? (
        <div className="flex gap-2">
          <Button
            variant="primary"
            icon={CheckCircle2}
            className="flex-1 !h-10 !text-xs"
            onClick={() => act("accepted")}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            icon={XCircle}
            className="flex-1 !h-10 !text-xs"
            onClick={() => act("declined")}
          >
            Decline
          </Button>
          <Button
            variant="danger"
            icon={Lock}
            className="flex-1 !h-10 !text-xs"
            onClick={() => act("blocked")}
          >
            Block
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-surface-container rounded p-2.5">
          <Chip status={status === "accepted" ? "Reversed" : "Alert"} />
          <span className="text-[11px] text-on-surface-variant">SMS sent</span>
        </div>
      )}
    </Card>
  );
}

function PendingApprovalTab() {
  const [cardFilter, setCardFilter] = useState("all");
  const [lastSms, setLastSms] = useState(null);
  const [payments, setPayments] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    getPendingPayments().then(setPayments).catch(() => {});
    getCards().then(setCards).catch(() => {});
  }, []);

  const visible = payments.filter(
    (p) => cardFilter === "all" || p.cardId === cardFilter
  );
  const cardById = Object.fromEntries(cards.map((c) => [c.id, c]));

  const handleAction = (item, status, autoDeclined) => {
    const card = cardById[item.cardId];
    const verb =
      status === "accepted"
        ? "approved"
        : status === "blocked"
          ? "blocked, and the merchant was flagged"
          : autoDeclined
            ? "automatically declined (no response in time)"
            : "declined";
    setLastSms(
      `SwitchGuard: Your ${item.merchant} payment of ${currency(item.amount)} on card ending ${card?.last4} was ${verb}.`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-on-surface-variant mr-1">
            Filter by card:
          </span>
          <button
            onClick={() => setCardFilter("all")}
            className={`h-8 px-3 rounded-full text-xs font-semibold transition-colors ${
              cardFilter === "all"
                ? "bg-primary text-white"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            All cards
          </button>
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => setCardFilter(c.id)}
              className={`h-8 px-3 rounded-full text-xs font-semibold transition-colors ${
                cardFilter === c.id
                  ? "bg-primary text-white"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              •••• {c.last4}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-sm text-on-surface-variant">
              No pending payments for this card.
            </p>
          </Card>
        ) : (
          visible.map((item) => (
            <PendingRow
              key={item.id}
              item={item}
              card={cardById[item.cardId]}
              onAction={handleAction}
            />
          ))
        )}
      </div>

      <Card className="lg:col-span-2 lg:sticky lg:top-24">
        <p className="text-sm font-bold text-on-surface mb-4 text-center">
          What the customer receives
        </p>
        <PhoneSmsPreview
          visible={!!lastSms}
          time="now"
          message={lastSms || "Waiting for an action…"}
        />
        {!lastSms && (
          <p className="text-xs text-on-surface-variant text-center mt-3">
            Accept, decline, or block a payment on the left to see the SMS arrive
            here.
          </p>
        )}
      </Card>
    </div>
  );
}

function CardControlsTab() {
  const [controls, setControls] = useState(
    cards.reduce(
      (acc, c) => ({
        ...acc,
        [c.id]: { requireApproval: true, blockOnline: false },
      }),
      {}
    )
  );

  const updateControl = (cardId, key, value) => {
    setControls((prev) => {
      const next = { ...prev[cardId], [key]: value };
      if (key === "blockOnline" && value) next.requireApproval = false;
      return { ...prev, [cardId]: next };
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <p className="text-sm text-on-surface-variant text-center max-w-lg mx-auto">
        Choose how each card handles online payments — require your approval for
        every purchase, or block online payments on that card entirely.
      </p>
      {cards.map((c) => {
        const control = controls[c.id];
        return (
          <Card key={c.id} padded={false}>
            <div className="flex items-center gap-3 p-5 pb-3">
              <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-on-surface">{c.label}</p>
                <p className="text-xs text-on-surface-variant">
                  •••• {c.last4} · Exp {c.exp}
                </p>
              </div>
            </div>
            <div className="px-5 pb-2 divide-y divide-outline-variant">
              <ToggleRow
                icon={ShieldAlert}
                title="Require approval for online payments"
                detail="You'll get a prompt like the one in Pending Approval before it goes through"
                checked={control.requireApproval}
                onChange={(v) => updateControl(c.id, "requireApproval", v)}
                disabled={control.blockOnline}
              />
              <ToggleRow
                icon={Lock}
                title="Block online payments entirely"
                detail="No online payment will be accepted on this card, approved or not"
                checked={control.blockOnline}
                onChange={(v) => updateControl(c.id, "blockOnline", v)}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default function PaymentApproval() {
  const [activeTab, setActiveTab] = useState("pending");
  const pendingCount = pendingPayments.length;

  return (
    <Shell mobileTitle="Payment Approval">
      <div className="flex items-center gap-1 bg-surface-container rounded-full p-1 max-w-sm mx-auto mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 h-10 rounded-full text-sm font-semibold transition-colors ${
              activeTab === t.id
                ? "bg-primary text-white"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t.label}
            {t.id === "pending" ? ` (${pendingCount})` : ""}
          </button>
        ))}
      </div>

      {activeTab === "pending" ? <PendingApprovalTab /> : <CardControlsTab />}
    </Shell>
  );
}