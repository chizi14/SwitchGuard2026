import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldAlert, History, CheckCircle2, Lock } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import Button from "../Components/Button";
import Chip from "../Components/Chip";
import { currency } from "../api";

export default function SecurityAlert() {
  const navigate = useNavigate();
  const location = useLocation?.() || {};
  const alertData = location.state?.alert || {};
  const [resolved, setResolved] = useState(null);

  if (resolved) {
    return (
      <Shell mobileTitle="Security" showSearch>
        <div className="max-w-xl mx-auto">
          <Card className="flex flex-col items-center text-center py-14">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                resolved === "confirmed" ? "bg-tertiary-container/20" : "bg-error-container"
              }`}
            >
              {resolved === "confirmed" ? (
                <CheckCircle2 size={30} className="text-on-tertiary-container" />
              ) : (
                <Lock size={30} className="text-error" />
              )}
            </div>
            <h3 className="font-bold text-lg text-on-surface mb-1.5">
              {resolved === "confirmed" ? "Thanks — activity confirmed" : "Card temporarily frozen"}
            </h3>
            <p className="text-sm text-on-surface-variant max-w-sm">
              {resolved === "confirmed"
                ? "We've marked this transaction as recognized. No further action needed."
                : "Your card is frozen while we investigate. Visit Security to unfreeze it once you've confirmed it's safe."}
            </p>
            <Button variant="primary" className="mt-6" onClick={() => navigate("/dashboard")}>
              Back to dashboard
            </Button>
          </Card>
        </div>
      </Shell>
    );
  }

  return (
    <Shell mobileTitle="Security" showSearch>
      <div className="max-w-2xl mx-auto space-y-5">
        <Card className="flex items-start gap-4 border-l-4 border-secondary">
          <div className="w-11 h-11 rounded-full bg-secondary-container/40 flex items-center justify-center shrink-0">
            <ShieldAlert size={20} className="text-on-secondary-container" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-on-surface">Security alert</h1>
            <p className="text-sm text-on-surface-variant mt-0.5">
              We've detected unusual activity that needs your review to keep your account safe.
            </p>
          </div>
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="font-bold text-on-surface text-sm uppercase tracking-wide">
              Transaction anomaly detected
            </h3>
            <Chip status="Needs Review" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 pt-2">
            {/* Simple two-point map visual, no external map dependency */}
            <div className="relative bg-surface-container rounded-md h-48 overflow-hidden">
              <svg viewBox="0 0 300 220" className="w-full h-full">
                <path
                  d="M40 170 Q120 60 260 60"
                  fill="none"
                  stroke="#c5c6d1"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                <circle cx="40" cy="170" r="9" fill="#000519" />
                <circle cx="260" cy="60" r="9" fill="#775a00" />
              </svg>
              <div className="absolute bottom-3 left-3 bg-surface-lowest rounded px-2.5 py-1.5 shadow-soft">
                <p className="text-[10px] font-semibold text-on-surface-variant">HOME CITY</p>
                <p className="text-xs font-bold text-on-surface">{alertData.homeCity}</p>
              </div>
              <div className="absolute top-3 right-3 bg-surface-lowest rounded px-2.5 py-1.5 shadow-soft">
                <p className="text-[10px] font-semibold text-secondary">FLAGGED LOCATION</p>
                <p className="text-xs font-bold text-on-surface">{alertData.flaggedCity}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Transaction amount</span>
                <span className="font-bold text-on-surface">{currency(alertData.amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Time</span>
                <span className="font-semibold text-on-surface text-sm">{alertData.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Location</span>
                <span className="font-semibold text-on-surface text-sm text-right">{alertData.atmLocation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Method</span>
                <span className="font-semibold text-on-surface text-sm">{alertData.method}</span>
              </div>
            </div>
          </div>

          <div className="mx-5 mb-5 flex items-start gap-3 bg-secondary-container/20 rounded p-4">
            <History size={16} className="text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-on-surface">Velocity alert</p>
              <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{alertData.reason}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 px-5 pb-5">
            <Button variant="primary" icon={CheckCircle2} className="flex-1" onClick={() => setResolved("confirmed")}>
              This was me
            </Button>
            <Button variant="secondary" icon={Lock} className="flex-1" onClick={() => setResolved("froze")}>
              Not me — secure account
            </Button>
          </div>
          <p className="text-xs text-on-surface-variant text-center pb-5">
            Choosing "Not me" will temporarily freeze your card.
          </p>
        </Card>

        <p className="text-center text-sm text-on-surface-variant">
          Need help? <button onClick={() => navigate("/contact-support")} className="font-semibold text-primary hover:underline">Contact our 24/7 security team</button>
        </p>
      </div>
    </Shell>
  );
}
