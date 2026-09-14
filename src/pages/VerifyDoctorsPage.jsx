import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  BadgeX,
  Clock,
  ExternalLink,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Trash2,
} from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";
import { formatSpec, formatTime } from "../lib/utils";
import { DAYS } from "../constants";

// "monday 09:00-17:00" chips, ordered by the schema's day enum.
const hoursSummary = (availability) =>
  (availability || [])
    .slice()
    .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))
    .map((s) => `${s.day.slice(0, 3)} ${formatTime(s.startTime)} – ${formatTime(s.endTime)}`);

const ChipRow = ({ icon: Icon, items, empty }) => (
  <div className="flex items-start gap-2 text-xs">
    <Icon className="size-3.5 mt-0.5 text-base-content/65 shrink-0" />
    {items.length ? (
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <span key={item} className="badge badge-ghost">
            {item}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-base-content/65">{empty}</span>
    )}
  </div>
);

const STATUS_TABS = [
  { id: "false", label: "Awaiting review" },
  { id: "true", label: "Verified" },
];

const VerifyDoctorsPage = () => {
  const [tab, setTab] = useState("false");
  const { doctors, isFetching, fetchDoctors, setDoctorVerified, deleteDoctor } = useAdminStore();

  useEffect(() => {
    fetchDoctors(tab);
  }, [tab, fetchDoctors]);

  const handleRemove = (doctor) => {
    if (window.confirm(`Permanently remove ${doctor.userId?.fullName || "this doctor"}'s profile? This cannot be undone.`)) {
      deleteDoctor(doctor._id);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`btn btn-sm ${tab === t.id ? "btn-primary" : "btn-ghost"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isFetching ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-base-100 border border-base-300/70 animate-pulse" />
          ))}
        </div>
      ) : doctors.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-base-100 border border-base-300/70 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={doctor.userId?.profilePic || "/avatar.png"}
                  alt={doctor.userId?.fullName || "Doctor"}
                  className="size-12 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{doctor.userId?.fullName || "Doctor"}</h3>
                  <p className="text-primary text-sm">{formatSpec(doctor.specialization)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(doctor)}
                  aria-label="Remove doctor profile"
                  className="btn btn-ghost btn-sm btn-square text-error"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <p className="mt-3 text-xs text-base-content/72 flex items-center gap-1.5">
                <Mail className="size-3.5" /> {doctor.userId?.email}
              </p>
              <p className="text-xs text-base-content/72 mt-1">
                License: {doctor.licenseNumber} · {doctor.experienceYears} yrs · ${doctor.consultationFee}/visit
              </p>
              {doctor.about && (
                <p className="mt-2 text-sm text-base-content/60 line-clamp-2">{doctor.about}</p>
              )}

              {/* Everything the doctor submitted, so the admin can judge
                  credentials without leaving the review queue. */}
              <div className="mt-3 space-y-1.5">
                <ChipRow icon={GraduationCap} items={doctor.qualifications || []} empty="No qualifications added" />
                <ChipRow icon={Languages} items={doctor.languages || []} empty="No languages added" />
                <ChipRow icon={Clock} items={hoursSummary(doctor.availability)} empty="No working hours set" />
                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="size-3.5 mt-0.5 text-base-content/65 shrink-0" />
                  <span className="text-base-content/60">{doctor.clinicAddress || "No clinic address provided"}</span>
                </div>
              </div>

              <Link
                to={`/dashboard/find-doctors/${doctor._id}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <ExternalLink className="size-3.5" /> View full profile
              </Link>

              <div className="mt-4 flex gap-2">
                {doctor.isVerified ? (
                  <>
                    <span className="badge badge-success gap-1">
                      <BadgeCheck className="size-3.5" /> Verified
                    </span>
                    <button
                      className="btn btn-sm btn-ghost ml-auto"
                      onClick={() => setDoctorVerified(doctor, false)}
                    >
                      <BadgeX className="size-4" />
                      Revoke
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-sm btn-primary w-full gap-1"
                    onClick={() => setDoctorVerified(doctor, true)}
                  >
                    <BadgeCheck className="size-4" />
                    Approve doctor
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm px-6 py-14 text-center text-sm text-base-content/72">
          {tab === "false"
            ? "No doctor registrations waiting for review."
            : "No verified doctors yet."}
        </div>
      )}
    </div>
  );
};

export default VerifyDoctorsPage;
