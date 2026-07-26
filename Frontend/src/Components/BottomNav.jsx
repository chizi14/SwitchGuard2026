import { NavLink } from "react-router-dom";
import { LayoutGrid, Activity, ShieldAlert, ShieldCheck, CreditCard, Phone } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Home", icon: LayoutGrid },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/alerts", label: "Alerts", icon: ShieldAlert },
  { to: "/security", label: "Security", icon: ShieldCheck },
  { to: "/payment-approval", label: "Payments", icon: CreditCard },
  { to: "/ussd-demo", label: "USSD", icon: Phone },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-surface-lowest border-t border-outline-variant flex items-stretch z-30 pb-[env(safe-area-inset-bottom)]">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] text-xs font-medium transition-colors ${
              isActive ? "text-primary" : "text-on-surface-variant"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}