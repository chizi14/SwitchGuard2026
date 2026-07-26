import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, CreditCard, Settings as SettingsIcon, ChevronRight } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import { getStoredCustomer, getCards } from "../api";

export default function Profile() {
  const [cards, setCards] = useState([]);
  const cust = getStoredCustomer() || {};

  useEffect(() => { getCards().then(setCards).catch(() => {}); }, []);
  const navigate = useNavigate();

  return (
    <Shell mobileTitle="Profile">
      <div className="max-w-xl mx-auto">
        <Card className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center text-xl font-bold shrink-0">
            {cust.initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface">{cust.name}</h1>
            <p className="text-sm text-on-surface-variant">{cust.accountNumber}</p>
          </div>
        </Card>

        <Card padded={false} className="mb-5">
          <div className="p-5 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">
              Account details
            </h2>
          </div>
          <div className="divide-y divide-outline-variant">
            <div className="flex items-center gap-3.5 px-5 py-4">
              <User size={18} className="text-on-surface-variant shrink-0" />
              <div>
                <p className="text-xs text-on-surface-variant">Full name</p>
                <p className="text-sm font-semibold text-on-surface">{cust.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 px-5 py-4">
              <Phone size={18} className="text-on-surface-variant shrink-0" />
              <div>
                <p className="text-xs text-on-surface-variant">Phone number</p>
                <p className="text-sm font-semibold text-on-surface">{cust.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 px-5 py-4">
              <MapPin size={18} className="text-on-surface-variant shrink-0" />
              <div>
                <p className="text-xs text-on-surface-variant">Home city</p>
                <p className="text-sm font-semibold text-on-surface">{cust.homeCity}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card padded={false} className="mb-5">
          <div className="p-5 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">
              Linked cards
            </h2>
          </div>
          <div className="divide-y divide-outline-variant">
            {(cards.length ? cards : []).map((c) => (
              <div key={c.id} className="flex items-center gap-3.5 px-5 py-4">
                <CreditCard size={18} className="text-on-surface-variant shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-on-surface">{c.label}</p>
                  <p className="text-xs text-on-surface-variant">•••• {c.last4} · Exp {c.exp}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.status === "Active" ? "bg-tertiary-container/20 text-on-tertiary-container" : "bg-error-container text-on-error-container"}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center justify-between gap-3 bg-surface-lowest rounded-md shadow-soft px-5 py-4 hover:shadow-soft-hover transition-shadow"
        >
          <div className="flex items-center gap-3.5">
            <SettingsIcon size={18} className="text-on-surface-variant" />
            <span className="text-sm font-semibold text-on-surface">Go to settings</span>
          </div>
          <ChevronRight size={18} className="text-on-surface-variant" />
        </button>
      </div>
    </Shell>
  );
}
