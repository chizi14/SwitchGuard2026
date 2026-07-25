import { createContext, useContext, useState } from "react";
import { RotateCcw, ShieldAlert, MessageSquare, Lock } from "lucide-react";

const NotificationsContext = createContext(null);

const initialNotifications = [
  {
    id: "n1",
    icon: RotateCcw,
    tone: "success",
    title: "Funds reversed",
    detail: "MWK 50,000.00 was returned to your account after a failed ATM withdrawal.",
    time: "2 hours ago",
    read: false,
    to: "/activity",
  },
  {
    id: "n2",
    icon: ShieldAlert,
    tone: "warning",
    title: "Suspicious activity flagged",
    detail: "A withdrawal in Lilongwe was flagged — two withdrawals in different cities minutes apart.",
    time: "3 hours ago",
    read: false,
    to: "/security/alert",
  },
  {
    id: "n3",
    icon: MessageSquare,
    tone: "primary",
    title: "SMS confirmation sent",
    detail: "A confirmation text was sent to your number ending in *2018.",
    time: "3 hours ago",
    read: true,
    to: "/activity",
  },
  {
    id: "n4",
    icon: Lock,
    tone: "error",
    title: "Card blocked",
    detail: "Your NBM Visa Debit card was blocked at your request.",
    time: "Yesterday",
    read: true,
    to: "/security",
  },
];

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, markAllRead, markRead, unreadCount }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationsProvider");
  return ctx;
}
