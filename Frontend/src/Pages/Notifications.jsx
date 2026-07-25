import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import { useNotifications } from "../Context/NotificationsContext";

const toneStyles = {
  success: "bg-tertiary-container/20 text-on-tertiary-container",
  warning: "bg-secondary-container/40 text-on-secondary-container",
  primary: "bg-primary-container/10 text-primary-container",
  error: "bg-error-container text-on-error-container",
};

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAllRead, markRead, unreadCount } = useNotifications();

  const handleClick = (n) => {
    markRead(n.id);
    navigate(n.to);
  };

  return (
    <Shell mobileTitle="Notifications">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Notifications</h1>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <CheckCircle2 size={15} />
              Mark all read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left transition-shadow ${n.read ? "opacity-70" : ""}`}
              >
                <Card className={`flex items-start gap-3.5 hover:shadow-soft-hover ${!n.read ? "border-l-4 border-primary" : ""}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${toneStyles[n.tone]}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-on-surface">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-on-surface-variant mt-0.5 leading-relaxed">{n.detail}</p>
                    <p className="text-xs text-outline mt-1.5">{n.time}</p>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
