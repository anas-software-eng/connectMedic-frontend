import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  CalendarCheck,
  Clock,
  Loader2,
  MapPin,
  Medal,
  Stethoscope,
} from "lucide-react";
import { useDoctorStore } from "../store/useDoctorStore";
import { useAppointmentStore } from "../store/useAppointmentStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatSpec, formatTime } from "../lib/utils";
import { DAYS } from "../constants";

const todayStr = () => {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const availabilitySummary = (availability) =>
  DAYS.filter((day) => availability?.some((s) => s.day === day));

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctor, slots, fetchDoctor, fetchSlots, isFetchingDoctor } = useDoctorStore();
  const { book, isSubmitting } = useAppointmentStore();
  const { authUser } = useAuthStore();

  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchDoctor(id);
  }, [id, fetchDoctor]);

  useEffect(() => {
    if (doctor?._id && doctor.isVerified && doctor.isAvailable) {
      fetchSlots(doctor._id, date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, doctor?._id]);

  const openDays = useMemo(() => availabilitySummary(doctor?.availability), [doctor]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!time) return toast.error("Pick a time slot first");
    try {
      await book({ doctorId: doctor._id, date, time, reason });
      navigate("/dashboard/appointments");
    } catch {
      // toast already shown by the store
    }
  };

  if (isFetchingDoctor) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm px-6 py-16 text-center text-sm text-base-content/55">
        Doctor not found.
      </div>
    );
  }

  const isPatient = authUser?.role === "patient";
  const canBook = isPatient && doctor.isVerified && doctor.isAvailable;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] items-start">
      {/* Profile */}
      <section className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              src={doctor.profilePic || "/avatar.png"}
              alt={doctor.fullName}
              className="size-24 rounded-2xl object-cover ring-2 ring-primary/20"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{doctor.fullName}</h1>
                {doctor.isVerified ? (
                  <span className="badge badge-primary gap-1">
                    <BadgeCheck className="size-3.5" /> Verified
                  </span>
                ) : (
                  <span className="badge badge-warning">Awaiting verification</span>
                )}
              </div>
              <p className="text-primary font-medium flex items-center gap-1.5 mt-1">
                <Stethoscope className="size-4" /> {formatSpec(doctor.specialization)}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-base-content/70 mt-2">
                <span className="flex items-center gap-1.5">
                  <Medal className="size-4" /> {doctor.experienceYears} yrs experience
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" /> {doctor.clinicAddress || "Location on request"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" /> ${doctor.consultationFee} / visit
                </span>
              </div>
            </div>
          </div>

          {doctor.about && (
            <p className="mt-5 text-sm text-base-content/75 leading-relaxed">{doctor.about}</p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-2">Qualifications</h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                {doctor.qualifications?.length ? (
                  doctor.qualifications.map((q) => <li key={q}>• {q}</li>)
                ) : (
                  <li className="text-base-content/40">Not provided</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Languages</h3>
              <div className="flex flex-wrap gap-1.5">
                {doctor.languages?.length ? (
                  doctor.languages.map((l) => (
                    <span key={l} className="badge badge-ghost badge-sm capitalize">
                      {l}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-base-content/40">Not provided</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <CalendarCheck className="size-4 text-primary" /> Weekly availability
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {openDays.length ? (
                openDays.map((day) => {
                  const slot = doctor.availability.find((s) => s.day === day);
                  return (
                    <span key={day} className="badge badge-outline badge-sm capitalize">
                      {day} · {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
                    </span>
                  );
                })
              ) : (
                <span className="text-sm text-base-content/40">
                  No working hours published yet.
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking panel */}
      <aside className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <CalendarCheck className="size-5 text-primary" /> Book a visit
        </h2>

        {!canBook ? (
          <div className="text-sm text-base-content/60 space-y-2">
            <p>
              {!doctor.isVerified
                ? "This doctor's profile is still awaiting verification, so bookings are paused."
                : !doctor.isAvailable
                  ? "This doctor is currently not accepting new patients."
                  : "Bookings are available for patient accounts only."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleBook} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Date</span>
              </label>
              <input
                type="date"
                required
                min={todayStr()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime("");
                }}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Available time slots</span>
              </label>
              {slots.length ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`btn btn-sm ${time === slot ? "btn-primary" : "btn-outline"}`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-base-content/50 bg-base-200 rounded-lg px-4 py-3">
                  No free time slots on this date. Pick another day.
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Reason <span className="text-base-content/40">(optional)</span>
                </span>
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe your visit"
                className="textarea textarea-bordered w-full"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Confirm booking"}
            </button>

            <p className="text-xs text-base-content/45 text-center">
              The doctor will confirm your visit. You can cancel any time.
            </p>
          </form>
        )}
      </aside>
    </div>
  );
};

export default DoctorDetailPage;