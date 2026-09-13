import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, MapPin, Search, Star, Stethoscope } from "lucide-react";
import { useDoctorStore } from "../store/useDoctorStore";
import { formatSpec } from "../lib/utils";
import { SPECIALIZATIONS } from "../constants/specializations";

const STAR = Star;

const FindDoctorsPage = () => {
  const { doctors, fetchDoctors, isFetching } = useDoctorStore();
  const [query, setQuery] = useState("");
  const [specialization, setSpecialization] = useState("");

  useEffect(() => {
    fetchDoctors({});
  }, [fetchDoctors]);

  // Debounce search so we don't hammer the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors({ query, specialization });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, specialization, fetchDoctors]);

  return (
    <div className="space-y-5">
      <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="input input-bordered flex items-center gap-2 flex-1 rounded-xl">
            <Search className="size-4 text-base-content/40" />
            <input
              type="text"
              className="grow"
              placeholder="Search by symptom, disease, specialization or clinic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <select
            className="select select-bordered rounded-xl sm:w-64"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">All specializations</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isFetching ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-base-100 border border-base-300/70 animate-pulse"
            />
          ))}
        </div>
      ) : doctors.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <Link
              key={doctor._id}
              to={`/dashboard/find-doctors/${doctor._id}`}
              className="group bg-base-100 border border-base-300/70 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <img
                  src={doctor.profilePic || "/avatar.png"}
                  alt={doctor.fullName}
                  className="size-14 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold truncate">{doctor.fullName}</h3>
                    {doctor.isVerified && (
                      <BadgeCheck className="size-4 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-primary font-medium">
                    {formatSpec(doctor.specialization)}
                  </p>
                  <p className="text-xs text-base-content/50 flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3" /> {doctor.clinicAddress || "Location on profile"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 font-medium">
                  <STAR className="size-4 text-warning" />
                  {doctor.rating ? doctor.rating.toFixed(1) : "New"}
                </span>
                <span className="font-semibold">
                  ${doctor.consultationFee} <span className="text-xs text-base-content/50 font-normal">/ visit</span>
                </span>
              </div>

              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                <Stethoscope className="size-3.5" />
                View profile & book a visit
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm px-6 py-14 text-center text-sm text-base-content/55">
          No doctors match your search. Try a symptom like &quot;skin&quot; or &quot;chest pain&quot;.
        </div>
      )}
    </div>
  );
};

export default FindDoctorsPage;