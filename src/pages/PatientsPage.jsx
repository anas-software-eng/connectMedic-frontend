import { useEffect } from "react";
import { Users } from "lucide-react";
import { useAppointmentStore } from "../store/useAppointmentStore";
import { formatDate } from "../lib/utils";

const PatientsPage = () => {
  const { patients, fetchPatients, isFetching } = useAppointmentStore();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return (
    <div className="space-y-5">
      <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-5 flex items-center gap-2">
        <Users className="size-5 text-primary" />
        <span className="font-semibold">My patients</span>
        <span className="text-sm text-base-content/50">({patients.length})</span>
      </div>

      {isFetching ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-base-100 border border-base-300/70 animate-pulse" />
          ))}
        </div>
      ) : patients.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="bg-base-100 border border-base-300/70 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={patient.profilePic || "/avatar.png"}
                  alt={patient.fullName}
                  className="size-12 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{patient.fullName}</h3>
                  <p className="text-xs text-base-content/55">
                    {patient.total} visit{patient.total !== 1 ? "s" : ""} · last {formatDate(patient.lastDate)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm px-6 py-14 text-center text-sm text-base-content/55">
          You don&apos;t have any patients yet. They&apos;ll show up here once you confirm a booking.
        </div>
      )}
    </div>
  );
};

export default PatientsPage;