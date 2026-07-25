import { Link } from "react-router-dom";
import { Search, Bell, Settings } from "lucide-react";
import { customer } from "../Data/mockData";
import { useNotifications } from "../Context/NotificationsContext";

export function TopBarActions({ showSearch = false }) {
  const { unreadCount } = useNotifications();
  return (
    <div className="hidden lg:flex items-center gap-3">
      {showSearch && (
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Quick search transactions"
            className="w-64 h-10 pl-11 pr-4 rounded-full bg-surface-low border border-outline-variant text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      )}
      <Link
        to="/notifications"
        aria-label="Notifications"
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-low transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error" />
        )}
      </Link>
      <Link
        to="/settings"
        aria-label="Settings"
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-low transition-colors"
      >
        <Settings size={18} />
      </Link>
      <Link
        to="/profile"
        aria-label="View profile"
        className="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center text-xs font-bold ml-1 hover:opacity-90 transition-opacity"
      >
        {customer.initials}
      </Link>
    </div>
  );
}

export function MobileHeader({ title, brand = "SwitchGuard" }) {
  const { unreadCount } = useNotifications();
  return (
    <header className="lg:hidden flex items-center justify-between px-5 h-16 bg-surface-lowest border-b border-outline-variant sticky top-0 z-20">
      <div className="flex items-center gap-2.5">
        <span className="font-bold text-base text-on-surface">{title || brand}</span>
      </div>
      <div className="flex items-center gap-1">
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-low transition-colors"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-error" />
          )}
        </Link>
        <Link
          to="/settings"
          aria-label="Settings"
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-low transition-colors"
        >
          <Settings size={17} />
        </Link>
        <Link
          to="/profile"
          aria-label="View profile"
          className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-xs font-bold ml-1"
        >
          {customer.initials}
        </Link>
      </div>
    </header>
  );
}
