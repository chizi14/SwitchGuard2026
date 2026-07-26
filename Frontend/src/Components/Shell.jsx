import { NavLink } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import HelpChatWidget from "./HelpChatWidget";
import { TopBarActions, MobileHeader } from "./TopBar";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/activity", label: "Activity" },
  { to: "/alerts", label: "Alerts" },
  { to: "/security", label: "Security" },
  { to: "/payment-approval", label: "Payments" },
  { to: "/ussd-demo", label: "USSD Demo" },
];

export default function Shell({
  children,
  brand = "SwitchGuard",
  mobileTitle,
  showSearch = false,
  hideChrome = false,
  hideNav = false,
}) {
  if (hideChrome) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="hidden lg:flex items-center justify-between px-8 h-20 bg-surface-lowest border-b border-outline-variant sticky top-0 z-20">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <ShieldCheck size={16} className="text-on-primary" />
            </div>
            <span className="font-bold text-lg text-on-surface">{brand}</span>
          </div>
          {!hideNav && (
            <nav className="flex items-center gap-8">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-sm font-semibold pb-1 border-b-2 transition-colors ${
                      isActive
                        ? "text-on-surface border-primary"
                        : "text-on-surface-variant border-transparent hover:text-on-surface"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
        <TopBarActions showSearch={showSearch} />
      </div>
      <MobileHeader title={mobileTitle} brand={brand} />

      <main className="flex-1 px-5 py-5 lg:px-8 lg:py-8 pb-24 lg:pb-8">
        <div className="max-w-container mx-auto">{children}</div>
      </main>

      <Footer />
      <BottomNav />
      <HelpChatWidget />
    </div>
  );
}