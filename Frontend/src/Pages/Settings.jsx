import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Bell, Globe, MessageSquare, ShieldCheck, LogOut } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import { useTheme } from "../Context/ThemeContext";
import { getStoredCustomer, updatePreferences, logout } from "../api";

function ToggleRow({ icon: Icon, title, detail, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
          <Icon size={18} className="text-on-surface-variant" />
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface">{title}</p>
          {detail && <p className="text-xs text-on-surface-variant mt-0.5">{detail}</p>}
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full shrink-0 transition-colors ${
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

export default function Settings() {
  const cust = getStoredCustomer() || {};
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <Shell mobileTitle="Settings">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-on-surface mb-1">Settings</h1>
        <p className="text-sm text-on-surface-variant mb-6">
          Signed in as {cust.name || "User"} · {cust.accountNumber || "**** **** ****"}
        </p>

        <Card padded={false} className="mb-5">
          <div className="p-5 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Appearance</h2>
          </div>
          <div className="px-5 pb-2 divide-y divide-outline-variant">
            <ToggleRow
              icon={theme === "dark" ? Moon : Sun}
              title="Dark mode"
              detail={theme === "dark" ? "Currently on — easier on the eyes at night" : "Currently off"}
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
          </div>
        </Card>

        <Card padded={false} className="mb-5">
          <div className="p-5 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Language</h2>
          </div>
          <div className="px-5 pb-4">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                <Globe size={18} className="text-on-surface-variant" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">App language</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Choose your preferred language</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setLanguage("en")}
                className={`flex-1 h-12 rounded font-semibold text-sm transition-colors ${
                  language === "en"
                    ? "bg-primary text-on-primary"
                    : "border border-outline-variant text-on-surface bg-surface-lowest hover:bg-surface-container"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("ch")}
                className={`flex-1 h-12 rounded font-semibold text-sm transition-colors ${
                  language === "ch"
                    ? "bg-primary text-on-primary"
                    : "border border-outline-variant text-on-surface bg-surface-lowest hover:bg-surface-container"
                }`}
              >
                Chichewa
              </button>
            </div>
          </div>
        </Card>

        <Card padded={false} className="mb-5">
          <div className="p-5 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Notifications</h2>
          </div>
          <div className="px-5 pb-2 divide-y divide-outline-variant">
            <ToggleRow
              icon={MessageSquare}
              title="SMS alerts"
              detail="Get an SMS for reversals, blocks, and approvals"
              checked={smsAlerts}
              onChange={setSmsAlerts}
            />
            <ToggleRow
              icon={Bell}
              title="Push notifications"
              detail="Get alerts inside the app"
              checked={pushAlerts}
              onChange={setPushAlerts}
            />
          </div>
        </Card>

        <Card padded={false} className="mb-5">
          <div className="p-5 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Security</h2>
          </div>
          <div className="px-5 pb-2 divide-y divide-outline-variant">
            <ToggleRow
              icon={ShieldCheck}
              title="Two-factor authentication"
              detail="Extra verification step when logging in"
              checked={twoFactor}
              onChange={setTwoFactor}
            />
          </div>
        </Card>

        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded font-semibold text-sm text-error hover:bg-error-container/30 transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </Shell>
  );
}
