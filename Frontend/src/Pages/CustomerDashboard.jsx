import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowRight,
  Banknote,
  Blocks,
  ChevronRight,
  CreditCard,
  Eye,
  ShieldCheck,
  Sparkles,
  Smartphone,
  TicketSlash,
  Wallet,
  X,
} from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import Button from "../Components/Button";
import Chip from "../Components/Chip";
import IconBadge from "../Components/IconBadge";
import Carousel from "../Components/Carousel";
import {
  currency,
  customerBalance,
  customerCards,
  customerTransactions,
  loginHistory,
  carouselSlides,
} from "../Data/mockData";

const quickActions = [
  { label: "Block Card", icon: CreditCard, panel: "block" },
  { label: "Activity", icon: Eye, panel: "activity" },
  { label: "Security", icon: ShieldCheck, panel: "security" },
  { label: "Reversals", icon: TicketSlash, panel: "reversals" },
];

const transactionIcons = {
  cart: Sparkles,
  atm: Banknote,
  mobile: Smartphone,
  income: Wallet,
};

const securityTips = [
  {
    title: "Use two-factor authentication",
    detail:
      "Keep a second approval step turned on so account access needs more than just a password.",
    icon: ShieldCheck,
    tone: "success",
  },
  {
    title: "Protect your PIN",
    detail:
      "Never share your PIN, and avoid typing it where anyone can watch or capture it.",
    icon: Blocks,
    tone: "warning",
  },
  {
    title: "Manage trusted devices",
    detail:
      "Review signed-in devices regularly and log out of phones you no longer use.",
    icon: Smartphone,
    tone: "neutral",
  },
];

function TransactionRow({ transaction }) {
  const TransactionIcon = transactionIcons[transaction.icon] || Wallet;
  const positive = transaction.amount > 0;

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <IconBadge
          icon={TransactionIcon}
          tone={
            transaction.status === "Reversed"
              ? "neutral"
              : positive
                ? "success"
                : "primary"
          }
          size={40}
        />
        <div className="min-w-0">
          <p className="font-semibold text-on-surface truncate">
            {transaction.merchant}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            {transaction.timestamp}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p
          className={`font-bold ${positive ? "text-on-tertiary-container" : "text-on-surface"}`}
        >
          {currency(transaction.amount)}
        </p>
        <div className="mt-1 flex justify-end">
          <Chip status={transaction.status} />
        </div>
      </div>
    </div>
  );
}

function DashboardModal({
  panel,
  onClose,
  onConfirmBlock,
  blockConfirmed,
  selectedCard,
  onToggleFreeze,
}) {
  const dialogRef = useRef(null);
  const previousActiveElement = useRef(null);
  const [cardView, setCardView] = useState("detail");
  const blockTargetLabel = "****5829";
  const reversedTransactions = useMemo(
    () =>
      customerTransactions.filter(
        (transaction) => transaction.status === "Reversed",
      ),
    [],
  );

  useEffect(() => {
    if (!panel || !dialogRef.current) {
      return undefined;
    }

    previousActiveElement.current = document.activeElement;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

    const focusFirst = () => {
      const focusables = Array.from(
        dialog.querySelectorAll(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        dialog.focus();
      }
    };

    focusFirst();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusables = Array.from(
        dialog.querySelectorAll(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (!focusables.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (
        previousActiveElement.current &&
        typeof previousActiveElement.current.focus === "function"
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [onClose, panel]);

  useEffect(() => {
    setCardView("detail");
  }, [panel]);

  if (!panel) {
    return null;
  }

  const titleMap = {
    block: "Block Card",
    activity: "Activity",
    security: "Security",
    reversals: "Reversals",
    about: "About SwitchGuard",
    "card-detail": "Card Details",
  };

  const bodyMap = {
    block: `Are you sure you want to block your card ending in ${blockTargetLabel}?`,
    activity:
      "These are the same transactions shown in the Recent Transactions feed.",
    security:
      "A few simple habits keep your account safer without adding friction.",
    reversals: "Only reversed transactions are shown here.",
    about:
      "SwitchGuard watches ATM activity, spots dispense errors, and helps reverse failed charges quickly.",
    "card-detail": selectedCard
      ? `${selectedCard.network} card ending in ${selectedCard.last4}`
      : "",
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/70 px-4 py-5 sm:px-6 sm:py-8 overflow-y-auto"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`dashboard-modal-${panel}-title`}
        aria-describedby={`dashboard-modal-${panel}-description`}
        tabIndex={-1}
        className="mx-auto w-full max-w-2xl outline-none"
      >
        <Card className="overflow-hidden border border-outline-variant shadow-soft-hover bg-surface-lowest p-0">
          <div className="flex items-start justify-between gap-4 border-b border-outline-variant px-5 py-4 md:px-6">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">
                {titleMap[panel]}
              </p>
              <h2
                id={`dashboard-modal-${panel}-title`}
                className="mt-1 text-lg font-bold text-on-surface"
              >
                {panel === "block"
                  ? "Confirm card block"
                  : panel === "activity"
                    ? "Recent activity"
                    : panel === "security"
                      ? "Stay one step ahead"
                      : panel === "about"
                        ? "How SwitchGuard works"
                        : "Reversal history"}
              </h2>
              <p
                id={`dashboard-modal-${panel}-description`}
                className="mt-1 text-sm text-on-surface-variant leading-6"
              >
                {bodyMap[panel]}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close dialog"
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-lowest text-on-surface-variant transition-colors hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-lowest"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {panel === "block" && (
              <div className="px-5 py-5 md:px-6">
                <div className="rounded-lg border border-secondary-container bg-secondary-container/15 p-4">
                  <p className="text-sm font-semibold text-on-surface">
                    {blockConfirmed ? "Card blocked" : "Confirm this action"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                    {blockConfirmed
                      ? "Your card is now blocked locally for this session. No backend call has been made."
                      : `Blocking stops new transactions immediately. The card ending in ${blockTargetLabel} will be locked until you unblock it later.`}
                  </p>
                </div>

                {!blockConfirmed && (
                  <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={onConfirmBlock}>
                      Confirm block
                    </Button>
                  </div>
                )}
              </div>
            )}

            {panel === "activity" && (
              <div className="divide-y divide-outline-variant max-h-[60vh] overflow-y-auto">
                {customerTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </div>
            )}

            {panel === "security" && (
              <div className="space-y-3 px-5 py-5 md:px-6">
                {securityTips.map((tip) => (
                  <div
                    key={tip.title}
                    className="flex gap-3 rounded-lg border border-outline-variant bg-surface-lowest p-4"
                  >
                    <IconBadge icon={tip.icon} tone={tip.tone} size={44} />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-on-surface">
                        {tip.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                        {tip.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {panel === "reversals" && (
              <div className="divide-y divide-outline-variant max-h-[60vh] overflow-y-auto">
                {reversedTransactions.length ? (
                  reversedTransactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))
                ) : (
                  <div className="px-5 py-8 md:px-6 text-center">
                    <p className="text-sm font-semibold text-on-surface">
                      No reversed transactions yet
                    </p>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      Any reversed activity will appear here automatically.
                    </p>
                  </div>
                )}
              </div>
            )}

            {panel === "about" && (
              <div className="space-y-4 px-5 py-5 md:px-6">
                <img
                  src="/images/atm-machine.jpg"
                  alt="ATM machine"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <p className="text-sm leading-7 text-on-surface-variant">
                  SwitchGuard watches ATM transactions in real time and compares
                  each charge against the machine log. When an ATM takes money
                  but fails to dispense cash, the system flags the error instead
                  of waiting for a manual report.
                </p>
                <p className="text-sm leading-7 text-on-surface-variant">
                  It verifies that the dispense error belongs to the same
                  transaction record, then starts the reversal flow
                  automatically. That means the charge can be sent back to the
                  customer’s account within minutes, not days.
                </p>
                <p className="text-sm leading-7 text-on-surface-variant">
                  The result is less waiting for customers and less manual
                  processing for the bank, while keeping the experience simple
                  and transparent.
                </p>
              </div>
            )}

            {panel === "card-detail" &&
              selectedCard &&
              cardView === "detail" && (
                <div className="space-y-4 px-5 py-5 md:px-6">
                  <div className="rounded-lg border border-outline-variant bg-surface-low p-4">
                    <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">
                      {selectedCard.network}
                    </p>
                    <p className="mt-1 text-lg font-bold text-on-surface">
                      **** **** **** {selectedCard.last4}
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Expires {selectedCard.exp}
                    </p>
                    {selectedCard.frozen && (
                      <Chip status="Frozen" className="mt-2" />
                    )}
                  </div>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                      variant="outline"
                      onClick={() => onToggleFreeze(selectedCard.id)}
                    >
                      {selectedCard.frozen ? "Unfreeze Card" : "Freeze Card"}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setCardView("statement")}
                    >
                      View Statement
                    </Button>
                  </div>

                  {selectedCard.frozen && (
                    <div className="rounded-lg border border-secondary-container/30 bg-secondary-container/10 p-4">
                      <p className="text-sm font-semibold text-on-surface">
                        Card frozen
                      </p>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        This card is temporarily blocked for transactions. Tap
                        "Unfreeze Card" to restore access.
                      </p>
                    </div>
                  )}

                  {!selectedCard.frozen && (
                    <div className="rounded-lg border border-outline-variant bg-surface-low p-4">
                      <p className="text-sm font-semibold text-on-surface">
                        Statement view coming soon
                      </p>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        Detailed card statements will be available in a future
                        update.
                      </p>
                    </div>
                  )}
                </div>
              )}

            {panel === "card-detail" &&
              selectedCard &&
              cardView === "statement" && (
                <div className="space-y-4 px-5 py-5 md:px-6">
                  <div className="rounded-lg border border-outline-variant bg-surface-low p-4">
                    <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">
                      Statement
                    </p>
                    <p className="mt-1 text-sm font-semibold text-on-surface">
                      {selectedCard.label} — **** **** **** {selectedCard.last4}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        date: "Jul 25, 2026",
                        desc: "Chipiku Stores",
                        amount: -124000,
                      },
                      {
                        date: "Jul 24, 2026",
                        desc: "NBM ATM Blantyre Main",
                        amount: -50000,
                      },
                      {
                        date: "Jul 23, 2026",
                        desc: "Salary Deposit",
                        amount: 560000,
                      },
                    ].map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3 rounded-md border border-outline-variant bg-surface-lowest px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-on-surface truncate">
                            {entry.desc}
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            {entry.date}
                          </p>
                        </div>
                        <p
                          className={`text-sm font-bold shrink-0 ${entry.amount > 0 ? "text-on-tertiary-container" : "text-on-surface"}`}
                        >
                          {currency(entry.amount)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCardView("detail")}
                    className="w-full"
                  >
                    Back to Card Details
                  </Button>
                </div>
              )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Real coordinates for login-history cities (same map style as Alerts)
const CITY_COORDS = {
  Blantyre: [-15.7861, 35.0058],
  Lilongwe: [-13.9626, 33.7741],
  Mzuzu: [-11.4587, 34.0151],
};

function dotIcon(color) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:3px solid #ffffff;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function MalawiActivityMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [activePin, setActivePin] = useState(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const points = loginHistory
      .map((pin) => {
        const coords = CITY_COORDS[pin.city];
        if (!coords) return null;
        return { ...pin, coords };
      })
      .filter(Boolean);

    if (points.length >= 2) {
      L.polyline(
        points.map((p) => p.coords),
        { color: "#9aa0ac", weight: 3, dashArray: "6 8" },
      ).addTo(map);
    }

    points.forEach((pin, i) => {
      const color =
        i === 0 ? "#000519" : i === points.length - 1 ? "#775a00" : "#7185bd";
      const marker = L.marker(pin.coords, { icon: dotIcon(color) }).addTo(map);
      marker.bindPopup(
        `<strong>${pin.city}</strong><br/>${pin.region}<br/><span style="opacity:.75">${pin.timestamp}</span>`,
      );
      marker.on("click", () => setActivePin(pin.city));
    });

    if (points.length) {
      map.fitBounds(L.latLngBounds(points.map((p) => p.coords)), {
        padding: [40, 40],
      });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const home = loginHistory[0];
  const latest = loginHistory[loginHistory.length - 1];

  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">
            Recent Activity Map
          </p>
          <h2 className="mt-1 text-lg font-bold text-on-surface">
            Login history
          </h2>
        </div>
      </div>

      <div className="relative isolate">
        <div
          ref={containerRef}
          className="switchguard-map w-full h-72 sm:h-80 rounded-md overflow-hidden border border-outline-variant"
        />
        {home && (
          <div className="absolute bottom-3 left-3 bg-surface-lowest rounded px-2.5 py-1.5 shadow-soft pointer-events-none">
            <p className="text-[10px] font-semibold text-on-surface-variant">
              HOME CITY
            </p>
            <p className="text-xs font-bold text-on-surface">{home.city}</p>
          </div>
        )}
        {latest && latest.city !== home?.city && (
          <div className="absolute top-3 right-3 bg-surface-lowest rounded px-2.5 py-1.5 shadow-soft pointer-events-none">
            <p className="text-[10px] font-semibold text-secondary">
              LATEST LOGIN
            </p>
            <p className="text-xs font-bold text-on-surface">{latest.city}</p>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {loginHistory.map((pin) => (
          <button
            key={pin.city}
            type="button"
            onClick={() => setActivePin(pin.city)}
            className={`w-full flex items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left transition-colors ${
              activePin === pin.city
                ? "border-primary bg-primary-container/5"
                : "border-outline-variant bg-surface-lowest hover:bg-surface-container"
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-on-surface">
                {pin.city}
              </p>
              <p className="text-[11px] text-on-surface-variant">
                {pin.region}
              </p>
            </div>
            <p className="text-xs text-on-surface-variant shrink-0">
              {pin.timestamp}
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(null);
  const [blockConfirmed, setBlockConfirmed] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState(customerCards);

  const openPanel = (panel) => setActivePanel(panel);
  const closePanel = () => {
    setActivePanel(null);
    setSelectedCard(null);
  };

  const handleConfirmBlock = () => {
    setBlockConfirmed(true);
    setStatusMessage("Card blocked");
    setActivePanel(null);

    window.clearTimeout(window.__switchGuardStatusTimer);
    window.__switchGuardStatusTimer = window.setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleToggleFreeze = (cardId) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, frozen: !card.frozen } : card,
      ),
    );
    setSelectedCard((prev) =>
      prev && prev.id === cardId ? { ...prev, frozen: !prev.frozen } : prev,
    );
  };

  return (
    <Shell mobileTitle="Dashboard" showSearch>
      <div className="space-y-5 lg:space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6 items-start">
          <div className="xl:col-span-2 space-y-5 lg:space-y-6">
            <Card className="border border-tertiary-container/30 bg-tertiary-container/10">
              <div className="flex items-start gap-4">
                <IconBadge icon={ShieldCheck} tone="success" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">
                    Account status
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-on-surface">
                    No issues detected
                  </h1>
                  <p className="mt-2 text-sm text-on-surface-variant leading-6 max-w-2xl">
                    Your accounts and cards are fully protected. No suspicious
                    activity found in the last 24 hours.
                  </p>
                  {statusMessage && (
                    <div className="mt-4 inline-flex items-center rounded-full bg-tertiary-container px-3 py-1 text-xs font-semibold text-on-tertiary-container">
                      {statusMessage}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              <Card>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">
                      Quick Actions
                    </p>
                    <h2 className="text-lg font-bold text-on-surface mt-1">
                      Shortcuts
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      icon={action.icon}
                      className="h-20 flex-col gap-2 px-3 justify-center text-sm bg-surface-lowest"
                      aria-label={action.label}
                      onClick={() => openPanel(action.panel)}
                    >
                      <span className="text-center leading-tight">
                        {action.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </Card>

              <Card className="relative overflow-hidden bg-primary text-on-primary shadow-soft">
                <img
                  src="/images/bank-building.jpg"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/70" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-primary/60">
                        Security tip
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-on-primary">
                        Enable Two-Factor Authentication
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-on-primary/75">
                        Add a second approval step to protect your account from
                        unauthorized access and make every login safer.
                      </p>
                    </div>
                    <div className="rounded-full bg-on-primary/10 p-3 shrink-0">
                      <Blocks size={20} className="text-on-primary" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      variant="secondary"
                      className="w-full sm:w-auto text-on-secondary-container"
                      icon={ArrowRight}
                      onClick={() => openPanel("about")}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <Card padded={false}>
              <div className="flex items-center justify-between gap-3 p-5 md:p-6 border-b border-outline-variant">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">
                    Recent Transactions
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-on-surface">
                    Activity feed
                  </h2>
                </div>
                <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-lowest">
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="divide-y divide-outline-variant">
                {customerTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-5 lg:space-y-6">
            <Card className="bg-primary text-on-primary shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-primary/60">
                    Total Balance
                  </p>
                  <p className="mt-3 text-3xl font-bold text-on-primary">
                    {currency(customerBalance.amount)}
                  </p>
                  <p className="mt-3 text-sm text-on-primary/70">
                    {customerBalance.accountNumber}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-on-primary/50">
                    Updated {customerBalance.lastUpdated}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-on-primary/10 flex items-center justify-center shrink-0">
                  <div className="grid grid-cols-2 gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-on-primary/80" />
                    <span className="w-2 h-2 rounded-full bg-on-primary/40" />
                    <span className="w-2 h-2 rounded-full bg-on-primary/40" />
                    <span className="w-2 h-2 rounded-full bg-on-primary/80" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-primary text-on-primary shadow-soft">
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-primary/60">
                      No smartphone needed
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-on-primary">
                      Bank from any phone
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-on-primary/75">
                      No internet, no app — SwitchGuard works on any phone
                      through USSD, right where you are.
                    </p>
                  </div>
                  <div className="rounded-full bg-on-primary/10 p-3 shrink-0">
                    <Smartphone size={20} className="text-on-primary" />
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto text-on-secondary-container"
                    icon={ArrowRight}
                    onClick={() => navigate("/ussd-demo")}
                  >
                    Try USSD Demo
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">
                    My Cards
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-on-surface">
                    Linked cards
                  </h2>
                </div>
              </div>
              <div className="space-y-3">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className="w-full flex items-center justify-between gap-3 rounded-md border border-outline-variant bg-surface-lowest px-4 py-3 text-left transition-colors hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-lowest"
                    onClick={() => {
                      setSelectedCard(card);
                      openPanel("card-detail");
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                        <CreditCard size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-on-surface truncate">
                            {card.label}
                          </p>
                          {card.frozen && <Chip status="Frozen" />}
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {card.network} · Expires {card.exp}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-outline shrink-0" />
                  </button>
                ))}
              </div>
            </Card>

            <Carousel slides={carouselSlides} />

            <MalawiActivityMap />
          </div>
        </div>
      </div>

      <DashboardModal
        panel={activePanel}
        onClose={closePanel}
        onConfirmBlock={handleConfirmBlock}
        blockConfirmed={blockConfirmed}
        selectedCard={selectedCard}
        onToggleFreeze={handleToggleFreeze}
      />
    </Shell>
  );
}
