import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Megaphone,
  MessageSquare,
  Star,
  XCircle,
} from "lucide-react";
import { useNotificationStore } from "../store/useNotificationStore";
import { timeAgo } from "../lib/utils";

const ICONS = {
  appointment_booked: CalendarCheck,
  appointment_confirmed: CalendarCheck,
  appointment_cancelled: XCircle,
  appointment_completed: CheckCircle2,
  appointment_reminder: Clock,
  new_message: MessageSquare,
  doctor_verified: BadgeCheck,
  review_received: Star,
  announcement: Megaphone,
};

const NotificationBell = () => {
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const handleClick = (notification) => {
    if (!notification.read) markRead(notification._id);
    setOpen(false);
    if (notification.link) navigate(notification.link);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="btn btn-sm btn-ghost btn-square relative"
        onClick={() => setOpen((o) => !o)}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-expanded={open}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-primary text-primary-content text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] max-h-[28rem] overflow-y-auto rounded-2xl bg-base-100 border border-base-300/70 shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-300/70 sticky top-0 bg-base-100">
            <h2 className="font-semibold text-sm">Notifications</h2>
            {unreadCount > 0 && (
              <button type="button" className="text-xs text-primary font-medium" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-base-content/72">
              You&apos;re all caught up.
            </p>
          ) : (
            <ul>
              {notifications.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                return (
                  <li key={n._id}>
                    <button
                      type="button"
                      onClick={() => handleClick(n)}
                      className={`w-full text-left flex gap-3 px-4 py-3 border-b border-base-300/40 last:border-0 hover:bg-base-200 transition-colors ${
                        n.read ? "" : "bg-primary/5"
                      }`}
                    >
                      <span className="shrink-0 mt-0.5 size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium leading-snug">{n.title}</span>
                        {n.body && (
                          <span className="block text-xs text-base-content/72 mt-0.5 leading-snug">
                            {n.body}
                          </span>
                        )}
                        <span className="block text-[11px] text-base-content/60 mt-1">
                          {timeAgo(n.createdAt)}
                        </span>
                      </span>
                      {!n.read && <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" aria-hidden="true" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
