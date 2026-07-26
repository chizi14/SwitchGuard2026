import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ShieldAlert,
  History,
  CheckCircle2,
  Lock,
  Zap,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import Button from "../Components/Button";
import Chip from "../Components/Chip";
import PhoneSmsPreview from "../Components/PhoneSmsPreview";
import { useNotifications } from "../Context/NotificationsContext";
import { securityAlert, alertHistory, currency, customer } from "../Data/mockData";

// Real-world coordinates — used to plot the actual cities on a real map.
const HOME_COORDS = [-15.7861, 35.0058]; // Blantyre
const FLAGGED_COORDS = [-13.9626, 33.7741]; // Lilongwe

function dotIcon(color) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:3px solid #ffffff;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

// Real OpenStreetMap view of the two cities involved in the anomaly,
// with a dashed line connecting them — same visual language as the
// mock map it replaces, just backed by an actual map.
function AlertMap({ homeCity, flaggedCity }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

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

    L.polyline([HOME_COORDS, FLAGGED_COORDS], {
      color: "#9aa0ac",
      weight: 3,
      dashArray: "6 8",
    }).addTo(map);

    L.marker(HOME_COORDS, { icon: dotIcon("#000519") }).addTo(map);
    L.marker(FLAGGED_COORDS, { icon: dotIcon("#775a00") }).addTo(map);

    map.fitBounds(L.latLngBounds([HOME_COORDS, FLAGGED_COORDS]), { padding: [36, 36] });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative isolate">
      <div
        ref={containerRef}
        className="switchguard-map w-full h-56 rounded-md overflow-hidden border border-outline-variant"
      />
      <div className="absolute bottom-3 left-3 bg-surface-lowest rounded px-2.5 py-1.5 shadow-soft pointer-events-none">
        <p className="text-[10px] font-semibold text-on-surface-variant">HOME CITY</p>
        <p className="text-xs font-bold text-on-surface">{homeCity}</p>
      </div>
      <div className="absolute top-3 right-3 bg-surface-lowest rounded px-2.5 py-1.5 shadow-soft pointer-events-none">
        <p className="text-[10px] font-semibold text-secondary">FLAGGED LOCATION</p>
        <p className="text-xs font-bold text-on-surface">{flaggedCity}</p>
      </div>
    </div>
  );
}

const historyToneStyles = {
  "Needs Review": "bg-secondary-container/40 text-on-secondary-container",
  Reversed: "bg-tertiary-container/20 text-on-tertiary-container",
  Active: "bg-primary-container/10 text-primary-container",
};

// Small circular risk-score dial. Pure SVG, no chart library needed.
function RiskGauge({ score }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const tone = score >= 80 ? "#ba1a1a" : score >= 50 ? "#775a00" : "#0e996b";

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e7e8e9" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-on-surface">{score}</span>
        <span className="text-[9px] font-semibold text-on-surface-variant uppercase tracking-wide">
          Risk
        </span>
      </div>
    </div>
  );
}

export default function Alerts() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [status, setStatus] = useState("Needs Review");
  const [smsMessage, setSmsMessage] = useState("");
  const smsVisible = status !== "Needs Review";

  const requiredSpeedKmh = Math.round(
    securityAlert.distanceKm / (securityAlert.minutesApart / 60)
  );
  const speedMultiple = Math.round(requiredSpeedKmh / securityAlert.maxRealisticSpeedKmh);

  const handleConfirm = () => {
    setStatus("Confirmed");
    setSmsMessage(
      `Hi ${customer.name.split(" ")[0]}, thanks for confirming the ${currency(
        securityAlert.amount
      )} withdrawal in ${securityAlert.flaggedCity}. No further action needed.`
    );
    addNotification({
      icon: CheckCircle2,
      tone: "success",
      title: "Alert confirmed",
      detail: `You confirmed the ${securityAlert.flaggedCity} withdrawal was you. Case closed.`,
      to: "/alerts",
    });
  };

  const handleFreeze = () => {
    setStatus("Blocked");
    setSmsMessage(
      `Hi ${customer.name.split(" ")[0]}, your card is temporarily frozen after you flagged the ${securityAlert.flaggedCity} withdrawal as not you. Visit Security to unfreeze it.`
    );
    addNotification({
      icon: Lock,
      tone: "error",
      title: "Card frozen",
      detail: `Card frozen after the ${securityAlert.flaggedCity} withdrawal was flagged as not you.`,
      to: "/security",
    });
  };

  const handleReset = () => {
    setStatus("Needs Review");
    setSmsMessage("");
  };

  return (
    <Shell mobileTitle="Alerts" showSearch>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header banner */}
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

        {/* Stat strip — risk score, detection speed, impossible-travel math */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="flex items-center gap-3">
            <RiskGauge score={securityAlert.riskScore} />
            <p className="text-xs text-on-surface-variant leading-snug">
              Flagged as <span className="font-semibold text-on-surface">high risk</span> by the
              switch's fraud model.
            </p>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-on-surface leading-none">
                {securityAlert.detectionMs}ms
              </p>
              <p className="text-xs text-on-surface-variant mt-1 leading-snug">
                Caught at the switch, before funds ever left the account.
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-on-surface leading-none">{speedMultiple}×</p>
              <p className="text-xs text-on-surface-variant mt-1 leading-snug">
                Faster than physically possible between the two cities.
              </p>
            </div>
          </Card>
        </div>

        {/* Transaction anomaly card */}
        <Card padded={false}>
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="font-bold text-on-surface text-sm uppercase tracking-wide">
              Transaction anomaly detected
            </h3>
            {status === "Needs Review" && <Chip status="Needs Review" />}
            {status === "Confirmed" && <Chip status="Active">Confirmed</Chip>}
            {status === "Blocked" && <Chip status="Blocked">Card Frozen</Chip>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 pt-2">
            <AlertMap homeCity={securityAlert.homeCity} flaggedCity={securityAlert.flaggedCity} />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Transaction amount</span>
                <span className="font-bold text-on-surface">{currency(securityAlert.amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Time</span>
                <span className="font-semibold text-on-surface text-sm">{securityAlert.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Location</span>
                <span className="font-semibold text-on-surface text-sm text-right">
                  {securityAlert.atmLocation}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Method</span>
                <span className="font-semibold text-on-surface text-sm">{securityAlert.method}</span>
              </div>
            </div>
          </div>

          <div className="mx-5 mb-5 flex items-start gap-3 bg-secondary-container/20 rounded p-4">
            <History size={16} className="text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-on-surface">Velocity alert</p>
              <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                Withdrawals detected in {securityAlert.homeCity} and {securityAlert.flaggedCity} —{" "}
                {securityAlert.distanceKm}km apart — just {securityAlert.minutesApart} minutes
                apart. That requires traveling at roughly{" "}
                {requiredSpeedKmh.toLocaleString()} km/h, about {speedMultiple}× faster than the
                fastest realistic road speed ({securityAlert.maxRealisticSpeedKmh} km/h).
              </p>
            </div>
          </div>

          {status === "Needs Review" ? (
            <>
              <div className="flex flex-col sm:flex-row gap-3 px-5 pb-5">
                <Button variant="primary" icon={CheckCircle2} className="flex-1" onClick={handleConfirm}>
                  This was me
                </Button>
                <Button variant="secondary" icon={Lock} className="flex-1" onClick={handleFreeze}>
                  Not me — secure account
                </Button>
              </div>
              <p className="text-xs text-on-surface-variant text-center pb-5">
                Choosing "Not me" will temporarily freeze your card.
              </p>
            </>
          ) : (
            <div className="px-5 pb-5 space-y-4">
              <div
                className={`flex items-start gap-3 rounded p-4 ${
                  status === "Confirmed" ? "bg-tertiary-container/15" : "bg-error-container"
                }`}
              >
                {status === "Confirmed" ? (
                  <CheckCircle2 size={18} className="text-on-tertiary-container shrink-0 mt-0.5" />
                ) : (
                  <Lock size={18} className="text-on-error-container shrink-0 mt-0.5" />
                )}
                <p
                  className={`text-sm font-medium ${
                    status === "Confirmed" ? "text-on-tertiary-container" : "text-on-error-container"
                  }`}
                >
                  {status === "Confirmed"
                    ? "Thanks — activity confirmed. We've marked this transaction as recognized."
                    : "Card temporarily frozen while we investigate. Visit Security to unfreeze it once confirmed safe."}
                </p>
              </div>

              <PhoneSmsPreview message={smsMessage} visible={smsVisible} time="now" />

              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <RotateCcw size={13} />
                  Reset demo
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Alert history */}
        <div>
          <h3 className="font-bold text-on-surface text-sm uppercase tracking-wide mb-3">
            Alert history
          </h3>
          <div className="space-y-3">
            {alertHistory.map((a) => (
              <Card key={a.id} className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    historyToneStyles[a.status] || "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  <ShieldAlert size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-on-surface">{a.title}</p>
                    <Chip status={a.status} />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{a.detail}</p>
                  <p className="text-xs text-outline mt-1.5">{a.time}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-on-surface-variant">
          Need help?{" "}
          <button
            onClick={() => navigate("/contact-support")}
            className="font-semibold text-primary hover:underline"
          >
            Contact our 24/7 security team
          </button>
        </p>
      </div>
    </Shell>
  );
}