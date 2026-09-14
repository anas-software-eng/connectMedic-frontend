import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, MessageSquareText, XCircle } from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";
import StatusBadge from "../components/StatusBadge";
import { formatDate, formatTime } from "../lib/utils";

const TABS = [
  { id: "", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const AdminAppointmentsPage = () => {
  const [status, setStatus] = useState("");
  const { appointments, isFetching, fetchAppointments, forceCancelAppointment } = useAdminStore();

  useEffect(() => {
    fetchAppointments(status);
  }, [status, fetchAppointments]);

  const handleCancel = (appointment) => {
    if (window.confirm(`Force-cancel ${appointment.patientName}'s appointment with ${appointment.doctorName}?`)) {
      forceCancelAppointment(appointment._id);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 font-semibold mr-2">
          <CalendarClock className="size-5 text-primary" /> All appointments
        </span>
        {TABS.map((t) => (
          <button
            key={t.id || "all"}
            onClick={() => setStatus(t.id)}
            className={`btn btn-sm ${status === t.id ? "btn-primary" : "btn-ghost"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isFetching ? (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl animate-pulse h-40" />
      ) : (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm overflow-hidden">
          {appointments.length ? (
            <ul className="divide-y divide-base-300/70">
              {appointments.map((a) => (
                <li key={a._id} className="px-5 py-4 flex flex-wrap items-center gap-3">
                  <img
                    src={a.patientProfilePic || "/avatar.png"}
                    alt={a.patientName}
                    className="size-9 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">
                      {a.patientName} <span className="text-base-content/65">with</span> {a.doctorName}
                    </p>
                    <p className="text-xs text-base-content/72">
                      {formatDate(a.date)} · {formatTime(a.time)} · {a.specialization || "Consultation"}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                  {a.doctorUserId && (
                    <Link
                      to={`/dashboard/admin/messages/${a.patientId}/${a.doctorUserId}`}
                      className="btn btn-ghost btn-sm gap-1.5"
                    >
                      <MessageSquareText className="size-4" />
                      View chat
                    </Link>
                  )}
                  {!["completed", "cancelled"].includes(a.status) && (
                    <button
                      type="button"
                      onClick={() => handleCancel(a)}
                      className="btn btn-ghost btn-sm text-error gap-1.5"
                    >
                      <XCircle className="size-4" />
                      Force cancel
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-14 text-center text-sm text-base-content/72">
              No appointments in this view.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentsPage;
