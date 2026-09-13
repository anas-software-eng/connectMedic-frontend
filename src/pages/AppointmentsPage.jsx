import { useEffect, useState } from "react";
import { CalendarCheck, Clock, Loader2 } from "lucide-react";
import { useAppointmentStore } from "../store/useAppointmentStore";
import { useAuthStore } from "../store/useAuthStore";
import StatusBadge from "../components/StatusBadge";
import { formatDate, formatTime } from "../lib/utils";

const TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const isActive = (status) => ["pending", "confirmed"].includes(status);

const AppointmentCard = ({ appointment, role }) => {
  const { cancel, updateStatus } = useAppointmentStore();
  const name = role === "doctor" ? appointment.patientName : appointment.doctorName;
  const subtitle =
    role === "doctor"
      ? `Last visit: ${appointment.date}`
      : appointment.specialization || "Consultation";

  return (
    <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-3">
        <img
          src={
            (role === "doctor"
              ? appointment.patientProfilePic
              : appointment.doctorProfilePic) || "/avatar.png"
          }
          alt={name}
          className="size-12 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate">{name}</h3>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="text-xs text-base-content/55 truncate">{subtitle}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-base-content/70">
        <span className="flex items-center gap-1.5">
          <CalendarCheck className="size-4 text-primary" /> {formatDate(appointment.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-4 text-primary" /> {formatTime(appointment.time)}
        </span>
      </div>

      {appointment.reason && (
        <p className="mt-3 text-sm text-base-content/60 bg-base-200 rounded-lg px-3 py-2">
          {appointment.reason}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {role === "doctor" && appointment.status === "pending" && (
          <button className="btn btn-sm btn-primary" onClick={() => updateStatus(appointment._id, "confirmed")}>
            Confirm
          </button>
        )}
        {role === "doctor" && appointment.status === "confirmed" && (
          <button className="btn btn-sm btn-primary" onClick={() => updateStatus(appointment._id, "completed")}>
            Mark completed
          </button>
        )}
        {isActive(appointment.status) && (
          <button className="btn btn-sm btn-ghost" onClick={() => cancel(appointment._id)}>
            Cancel appointment
          </button>
        )}
      </div>
    </div>
  );
};

const AppointmentsPage = () => {
  const { appointments, fetchMine, isFetching } = useAppointmentStore();
  const { authUser } = useAuthStore();
  const [tab, setTab] = useState("all");
  const role = authUser?.role;

  useEffect(() => {
    fetchMine();
  }, [fetchMine]);

  const visible = appointments.filter((a) => {
    if (tab === "all") return true;
    if (tab === "active") return isActive(a.status);
    return a.status === tab;
  });

  const counts = {
    all: appointments.length,
    active: appointments.filter((a) => isActive(a.status)).length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <div className="space-y-5">
      <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`btn btn-sm ${tab === t.id ? "btn-primary" : "btn-ghost"}`}
          >
            {t.label}
            <span className="badge badge-ghost badge-sm opacity-70">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      {isFetching ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-base-100 border border-base-300/70 animate-pulse" />
          ))}
        </div>
      ) : visible.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((a) => (
            <AppointmentCard key={a._id} appointment={a} role={role} />
          ))}
        </div>
      ) : (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm px-6 py-14 flex flex-col items-center text-center gap-3">
          <Loader2 className="size-6 text-base-content/30" />
          <p className="text-sm text-base-content/55">
            {role === "doctor"
              ? "No appointments in this view yet. New patient bookings will appear here."
              : "No appointments in this view yet. Find a doctor to book your first visit."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;