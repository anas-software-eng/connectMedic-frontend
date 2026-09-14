import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Inbox } from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useAdminStore } from "../../store/useAdminStore";
import StatusBadge from "../../components/StatusBadge";
import { formatDate, formatTime, timeAgo } from "../../lib/utils";

const StatCard = ({ stat, loading }) => {
  const Icon = stat.icon;
  return (
    <div className="group bg-base-100 border border-base-300/70 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-base-content/65">{stat.label}</span>
        <span className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
          {Icon && <Icon className="size-4" />}
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold tabular-nums leading-none">
        {loading ? "…" : stat.value}
      </div>
      {stat.hint && <div className="mt-2 text-xs text-base-content/65">{stat.hint}</div>}
    </div>
  );
};

const Section = ({ section, items }) => {
  const Icon = section.icon;
  return (
    <section className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-base-300/70">
        <h2 className="font-semibold flex items-center gap-2">
          {Icon && <Icon className="size-4 text-primary" />}
          {section.title}
        </h2>
        {section.action && (
          <Link
            to={section.action.to}
            className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            {section.action.label}
            <ArrowUpRight className="size-3" />
          </Link>
        )}
      </header>

      {items.length ? (
        <ul className="divide-y divide-base-300/70">{items}</ul>
      ) : (
        <div className="px-5 py-10 flex flex-col items-center text-center gap-2">
          <span className="p-3 rounded-2xl bg-base-200 text-base-content/65">
            <Inbox className="size-5" />
          </span>
          <p className="text-sm text-base-content/72">{section.empty}</p>
        </div>
      )}
    </section>
  );
};

const DashboardHome = () => {
  const { config, liveValues } = useDashboard();
  const { stats, appointments, signups, loading } = useDashboardStats();
  const { authUser } = useAuthStore();
  const { conversations, setSelectedUser } = useChatStore();
  const { auditLogs, fetchAuditLog } = useAdminStore();
  const navigate = useNavigate();

  const unread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const live = { ...liveValues, unread, ...stats };
  const isDoctor = authUser?.role === "doctor";
  const isAdmin = authUser?.role === "admin";

  useEffect(() => {
    if (isAdmin) fetchAuditLog();
  }, [isAdmin, fetchAuditLog]);

  const openConversation = (c) => {
    setSelectedUser(c);
    navigate("/dashboard/messages");
  };

  const buildItems = (section) => {
    if (section.id === "appointments") {
      return appointments.map((a) => (
        <li key={a._id} className="px-5 py-3 text-sm hover:bg-base-200/50 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <span className="min-w-0">
              <span className="block font-medium truncate">
                {isDoctor ? a.patientName : a.doctorName}
              </span>
              <span className="text-xs text-base-content/72 block">
                {formatDate(a.date)} · {formatTime(a.time)} · {a.specialization || "Consultation"}
              </span>
            </span>
            <StatusBadge status={a.status} />
          </div>
        </li>
      ));
    }
    if (section.id === "signups") {
      return signups.map((u) => (
        <li key={u._id} className="px-5 py-3 text-sm hover:bg-base-200/50 transition-colors">
          <span className="block font-medium truncate">{u.fullName}</span>
          <span className="text-xs text-base-content/72 block truncate">
            {u.email} · <span className="capitalize">{u.role}</span> ·{" "}
            {new Date(u.createdAt).toLocaleDateString()}
          </span>
        </li>
      ));
    }
    if (section.id === "messages") {
      return conversations
        .filter((c) => c.lastMessageAt)
        .slice(0, 5)
        .map((c) => (
          <li key={c._id}>
            <button
              type="button"
              onClick={() => openConversation(c)}
              className="w-full text-left px-5 py-3 text-sm hover:bg-base-200/50 transition-colors flex items-center justify-between gap-3"
            >
              <span className="min-w-0">
                <span className="block font-medium truncate">
                  {c.lastMessageFromMe ? "You: " : ""}
                  {c.fullName}
                </span>
                <span className="text-xs text-base-content/72 block truncate">
                  {c.lastMessage} · {timeAgo(c.lastMessageAt)}
                </span>
              </span>
              {c.unreadCount > 0 && (
                <span className="badge badge-primary shrink-0">{c.unreadCount}</span>
              )}
            </button>
          </li>
        ));
    }
    if (section.id === "audit") {
      return auditLogs.slice(0, 5).map((log) => (
        <li key={log._id} className="px-5 py-3 text-sm hover:bg-base-200/50 transition-colors">
          <span className="block truncate">
            <span className="font-medium">{log.adminName}</span> · {log.action}
          </span>
          <span className="text-xs text-base-content/72 block truncate">
            {log.details || log.targetType} · {timeAgo(log.createdAt)}
          </span>
        </li>
      ));
    }
    if (section.id === "queue") {
      return appointments
        .filter((a) => a.status === "pending")
        .map((a) => (
          <li key={a._id} className="px-5 py-3 text-sm hover:bg-base-200/50 transition-colors">
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0">
                <span className="block font-medium truncate">{a.patientName}</span>
                <span className="text-xs text-base-content/72 block">
                  Requested {formatDate(a.date)} · {formatTime(a.time)}
                </span>
              </span>
              <StatusBadge status={a.status} />
            </div>
          </li>
        ));
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {config.stats.map((stat) => (
          <StatCard
            key={stat.id}
            stat={{ ...stat, value: live[stat.id] ?? stat.value }}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2 items-start">
        {config.sections.map((section) => (
          <Section key={section.id} section={section} items={buildItems(section)} />
        ))}
      </div>
    </div>
  );
};
export default DashboardHome;
