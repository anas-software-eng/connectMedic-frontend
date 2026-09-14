import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";
import { timeAgo } from "../lib/utils";

// Human-readable label for a machine action code like "user.role_change".
const ACTION_LABEL = {
  "user.role_change": "changed a role",
  "user.ban": "banned a user",
  "user.unban": "unbanned a user",
  "doctor.verify": "verified a doctor",
  "doctor.unverify": "revoked a doctor's verification",
  "doctor.update": "edited a doctor profile",
  "doctor.delete_profile": "removed a doctor profile",
  "appointment.force_cancel": "force-cancelled an appointment",
  "review.delete": "removed a review",
  "broadcast.send": "sent an announcement",
};

const AuditLogPage = () => {
  const { auditLogs, isFetching, fetchAuditLog } = useAdminStore();

  useEffect(() => {
    fetchAuditLog();
  }, [fetchAuditLog]);

  return (
    <div className="space-y-5">
      <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-4 flex items-center gap-2 font-semibold">
        <ShieldCheck className="size-5 text-primary" /> Audit log
      </div>

      {isFetching ? (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl animate-pulse h-40" />
      ) : (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm overflow-hidden">
          {auditLogs.length ? (
            <ul className="divide-y divide-base-300/70">
              {auditLogs.map((log) => (
                <li key={log._id} className="px-5 py-4">
                  <p className="text-sm">
                    <span className="font-medium">{log.adminName}</span>{" "}
                    {ACTION_LABEL[log.action] || log.action}
                    {log.targetType && (
                      <span className="text-base-content/65"> · {log.targetType}</span>
                    )}
                  </p>
                  {log.details && (
                    <p className="text-xs text-base-content/72 mt-1">{log.details}</p>
                  )}
                  <p className="text-[11px] text-base-content/60 mt-1">{timeAgo(log.createdAt)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-14 text-center text-sm text-base-content/72">
              Nothing logged yet. Admin actions (bans, verifications, role changes, force-cancellations) will show up here.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogPage;
