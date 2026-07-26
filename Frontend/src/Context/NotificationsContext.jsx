import { createContext, useContext, useEffect, useState } from "react";
import { getNotifications, markAllNotificationsRead, markNotificationRead, subscribeToNotifications } from "../api";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Fetch notifications from API on mount
  useEffect(() => {
    let cancelled = false;
    getNotifications()
      .then((data) => {
        if (!cancelled) {
          setNotifications(data.map((n) => ({ ...n, read: n.read })));
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true); // fail silently, show empty
      });
    return () => { cancelled = true; };
  }, []);

  // SSE subscription for real-time notifications
  useEffect(() => {
    const close = subscribeToNotifications("customer", (newNotif) => {
      setNotifications((prev) => [{ ...newNotif, read: false, time: "Just now" }, ...prev]);
    });
    return close;
  }, []);

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try { await markAllNotificationsRead(); } catch { /* silent */ }
  };

  const markRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try { await markNotificationRead(id); } catch { /* silent */ }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (notification) => {
    setNotifications((prev) => [
      { id: `n${Date.now()}`, read: false, time: "Just now", ...notification },
      ...prev,
    ]);
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, markAllRead, markRead, unreadCount, addNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationsProvider");
  return ctx;
}
