import { useEffect, useState } from "react";
import { CalendarCheck, CheckCircle2, Clock, Loader2, Star, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppointmentStore } from "../store/useAppointmentStore";
import { useReviewStore } from "../store/useReviewStore";
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

// Completion isn't a unilateral doctor action — both sides answer "did this
// visit happen?" and the backend only flips the appointment to completed
// once they agree.
const CompletionPrompt = ({ appointment, role }) => {
  const { confirmDone } = useAppointmentStore();
  const myAnswer = role === "doctor" ? appointment.doctorConfirmedDone : appointment.patientConfirmedDone;
  const theirAnswer = role === "doctor" ? appointment.patientConfirmedDone : appointment.doctorConfirmedDone;
  const theirLabel = role === "doctor" ? "the patient" : "the doctor";

  if (myAnswer === true) {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-sm text-success">
        <CheckCircle2 className="size-4" />
        {theirAnswer === true
          ? "Visit confirmed complete."
          : `You confirmed this visit happened — waiting on ${theirLabel}.`}
      </p>
    );
  }

  if (myAnswer === false) {
    return (
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-base-200 px-3 py-2 text-sm text-base-content/72">
        <span>You said this visit didn&apos;t happen.</span>
        <button
          type="button"
          className="btn btn-xs btn-ghost"
          onClick={() => confirmDone(appointment._id, true)}
        >
          Actually, it did
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-base-200 px-3 py-2.5">
      <span className="text-sm font-medium">Did this visit happen?</span>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-xs btn-success"
          onClick={() => confirmDone(appointment._id, true)}
        >
          Yes
        </button>
        <button
          type="button"
          className="btn btn-xs btn-ghost"
          onClick={() => confirmDone(appointment._id, false)}
        >
          No
        </button>
      </div>
    </div>
  );
};

const ReviewPrompt = ({ appointment }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { submitReview, isSubmitting } = useReviewStore();
  const { fetchMine } = useAppointmentStore();

  if (!appointment.canReview) return null;

  if (!open) {
    return (
      <button type="button" className="btn btn-sm btn-primary mt-3 gap-1.5" onClick={() => setOpen(true)}>
        <Star className="size-4" />
        Leave a review
      </button>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await submitReview({ appointmentId: appointment._id, rating, comment });
    if (ok) {
      setOpen(false);
      fetchMine();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2.5 rounded-lg bg-base-200 p-3">
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-pressed={n <= rating}
            className="p-0.5"
          >
            <Star className={`size-6 ${n <= rating ? "fill-warning text-warning" : "text-base-content/45"}`} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="How was your visit? (optional)"
        className="textarea textarea-bordered textarea-sm w-full"
      />
      <div className="flex gap-2">
        <button type="submit" className="btn btn-sm btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit review"}
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const AppointmentCard = ({ appointment, role }) => {
  const { cancel, updateStatus } = useAppointmentStore();
  const navigate = useNavigate();
  const name = role === "doctor" ? appointment.patientName : appointment.doctorName;
  const subtitle =
    role === "doctor"
      ? `Last visit: ${appointment.date}`
      : appointment.specialization || "Consultation";
  const counterpartId = role === "doctor" ? appointment.patientId : appointment.doctorId?._id || appointment.doctorId;

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
          <p className="text-xs text-base-content/72 truncate">{subtitle}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-base-content/80">
        <span className="flex items-center gap-1.5">
          <CalendarCheck className="size-4 text-primary" /> {formatDate(appointment.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-4 text-primary" /> {formatTime(appointment.time)}
        </span>
      </div>

      {appointment.reason && (
        <p className="mt-3 text-sm text-base-content/78 bg-base-200 rounded-lg px-3 py-2">
          {appointment.reason}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {role === "doctor" && appointment.status === "pending" && (
          <button className="btn btn-sm btn-primary" onClick={() => updateStatus(appointment._id, "confirmed")}>
            Confirm
          </button>
        )}
        {appointment.status === "confirmed" && counterpartId && (
          <button
            type="button"
            className="btn btn-sm btn-outline gap-1.5"
            onClick={() => navigate(`/dashboard/call/${counterpartId}`)}
          >
            <Video className="size-4" />
            Video call
          </button>
        )}
        {isActive(appointment.status) && (
          <button className="btn btn-sm btn-ghost" onClick={() => cancel(appointment._id)}>
            Cancel appointment
          </button>
        )}
      </div>

      {appointment.status === "confirmed" && <CompletionPrompt appointment={appointment} role={role} />}
      {role === "patient" && <ReviewPrompt appointment={appointment} />}
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
            <span className="badge badge-ghost opacity-80">{counts[t.id]}</span>
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
          <Loader2 className="size-6 text-base-content/45" />
          <p className="text-sm text-base-content/72">
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
