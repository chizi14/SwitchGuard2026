import { useState } from "react";
import { Wifi, AlertTriangle, CheckCircle2, ShieldOff, ShieldCheck } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import Button from "../Components/Button";
import Chip from "../Components/Chip";
import PhoneSmsPreview from "../Components/PhoneSmsPreview";
import { cards as initialCards, customer } from "../Data/mockData";

export default function BlockCard() {
  const [cards, setCards] = useState(initialCards);
  const [selectedId, setSelectedId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastSms, setLastSms] = useState(null);

  const selected = cards.find((c) => c.id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id);
    setConfirming(true);
  };

  const handleConfirm = () => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === selectedId ? { ...c, status: c.status === "Active" ? "Blocked" : "Active" } : c
      )
    );
    const wasActive = selected?.status === "Active";
    const last4 = selected?.last4 ?? "****";
    const sms = wasActive
      ? `SwitchGuard: Your card ending ${last4} has been blocked. No new transactions can be made. Reply HELP for support.`
      : `SwitchGuard: Your card ending ${last4} has been unblocked and is ready to use.`;
    setLastSms(sms);
    setToast(wasActive ? "Card blocked. No new transactions can be made." : "Card unblocked and ready to use.");
    setConfirming(false);
    setSelectedId(null);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <Shell mobileTitle="Security" showSearch>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-on-surface mb-2">Secure your cards</h1>
          <p className="text-sm text-on-surface-variant">
            Select a card to block it instantly, or unblock a card you previously secured.
            Blocking can be undone at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`relative text-left rounded-md p-5 h-40 flex flex-col justify-between transition-all ${
                c.status === "Blocked"
                  ? "bg-surface-highest opacity-70"
                  : "bg-gradient-to-br from-primary to-primary-container"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-xs font-medium ${c.status === "Blocked" ? "text-on-surface-variant" : "text-white/60"}`}>
                    {c.network}
                  </p>
                  <p className={`font-semibold text-sm ${c.status === "Blocked" ? "text-on-surface" : "text-white"}`}>
                    {c.label}
                  </p>
                </div>
                <Wifi size={20} className={c.status === "Blocked" ? "text-outline rotate-90" : "text-white/50 rotate-90"} />
              </div>
              <div>
                <p className={`font-mono text-lg tracking-widest ${c.status === "Blocked" ? "text-on-surface-variant" : "text-white"}`}>
                  •••• •••• •••• {c.last4}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs ${c.status === "Blocked" ? "text-on-surface-variant" : "text-white/60"}`}>
                    Exp {c.exp}
                  </p>
                  <Chip status={c.status} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {confirming && selected && (
          <Card className="text-center py-8 border-2 border-secondary-container mb-6">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                selected.status === "Active" ? "bg-error-container" : "bg-tertiary-container/20"
              }`}
            >
              {selected.status === "Active" ? (
                <ShieldOff size={26} className="text-error" />
              ) : (
                <ShieldCheck size={26} className="text-on-tertiary-container" />
              )}
            </div>
            <h3 className="font-bold text-lg text-on-surface mb-1.5">
              {selected.status === "Active" ? "Confirm card block" : "Confirm card unblock"}
            </h3>
            <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-6">
              {selected.status === "Active"
                ? `Are you sure you want to block the card ending in ${selected.last4}? This will immediately prevent all new transactions.`
                : `Unblock the card ending in ${selected.last4}? It will be usable for transactions again right away.`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button variant={selected.status === "Active" ? "danger" : "primary"} onClick={handleConfirm}>
                {selected.status === "Active" ? "Block card" : "Unblock card"}
              </Button>
            </div>
          </Card>
        )}

        {!confirming && (
          <Card className="flex items-start gap-3 bg-surface-low mb-6">
            <AlertTriangle size={18} className="text-secondary shrink-0 mt-0.5" />
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Blocking a card stops all new transactions immediately, including recurring payments.
              You can unblock it any time, right from this screen — no branch visit needed. Reported
              your card lost or stolen for good? Contact <a href={`tel:${customer.phone.replace(/\s/g, "")}`} className="font-semibold text-primary hover:underline">{customer.phone}</a> support to request a replacement.
            </p>
          </Card>
        )}

        {/* Phone SMS preview — shows after block/unblock */}
        <Card>
          <p className="text-sm font-bold text-on-surface mb-4 text-center">What the customer receives</p>
          <PhoneSmsPreview
            visible={!!lastSms}
            time="now"
            message={lastSms || "Block or unblock a card above to see the confirmation SMS."}
          />
          {!lastSms && (
            <p className="text-xs text-on-surface-variant text-center mt-3">
              Confirm a block or unblock to see the SMS arrive on the customer's phone.
            </p>
          )}
        </Card>

        {toast && (
          <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-sm font-medium px-5 py-3 rounded-full shadow-soft-hover flex items-center gap-2 z-40">
            <CheckCircle2 size={16} className="text-tertiary-container" />
            {toast}
          </div>
        )}
      </div>
    </Shell>
  );
}