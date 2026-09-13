import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  BadgeX,
  Clock,
  ExternalLink,
  GraduationCap,
  Languages,
  Loader2,
  Mail,
  MapPin,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";
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
    <Icon className="size-3.5 mt-0.5 text-base-content/40 shrink-0" />
    {items.length ? (
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <span key={item} className="badge badge-sm badge-ghost">
            {item}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-base-content/40">{empty}</span>
    )}
  </div>
);

const STATUS_TABS = [
  { id: "false", label: "Awaiting review" },
  { id: "true", label: "Verified" },
];

const VerifyDoctorsPage = () => {
  const [tab, setTab] = useState("false");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async (verified) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/doctors", {
        params: { verified },
      });
      setDoctors(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(tab);
  }, [tab]);

  const setVerified = async (doctor, isVerified) => {
    setUpdatingId(doctor._id);
    try {
      await axiosInstance.put(`/admin/doctors/${doctor._id}/verify`, { isVerified });
      toast.success(isVerified ? "Doctor approved" : "Verification revoked");
      load(tab);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
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

      {loading ? (
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
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{doctor.userId?.fullName || "Doctor"}</h3>
                  <p className="text-primary text-sm">{formatSpec(doctor.specialization)}</p>
                </div>
              </div>

              <p className="mt-3 text-xs text-base-content/55 flex items-center gap-1.5">
                <Mail className="size-3.5" /> {doctor.userId?.email}
              </p>
              <p className="text-xs text-base-content/55 mt-1">
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
                  <MapPin className="size-3.5 mt-0.5 text-base-content/40 shrink-0" />
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
                      disabled={updatingId === doctor._id}
                      onClick={() => setVerified(doctor, false)}
                    >
                      {updatingId === doctor._id ? <Loader2 className="size-4 animate-spin" /> : <BadgeX className="size-4" />}
                      Revoke
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-sm btn-primary w-full gap-1"
                    disabled={updatingId === doctor._id}
                    onClick={() => setVerified(doctor, true)}
                  >
                    {updatingId === doctor._id ? <Loader2 className="size-4 animate-spin" /> : <BadgeCheck className="size-4" />}
                    Approve doctor
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm px-6 py-14 text-center text-sm text-base-content/55">
          {tab === "false"
            ? "No doctor registrations waiting for review."
            : "No verified doctors yet."}
        </div>
      )}
    </div>
  );
};

export default VerifyDoctorsPage;