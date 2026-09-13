import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const ROLE_TABS = [
  { id: "", label: "All" },
  { id: "patient", label: "Patients" },
  { id: "doctor", label: "Doctors" },
  { id: "admin", label: "Admins" },
];

const ROLE_BADGE = {
  patient: "badge-info",
  doctor: "badge-primary",
  admin: "badge-warning",
};

const AdminUsersPage = () => {
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/admin/users", { params: { role } })
      .then((res) => setUsers(res.data))
      .catch((error) => toast.error(error.response?.data?.message || "Failed to load users"))
      .finally(() => setLoading(false));
  }, [role]);

  return (
    <div className="space-y-5">
      <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 font-semibold mr-2">
          <Users className="size-5 text-primary" /> Users
        </span>
        {ROLE_TABS.map((t) => (
          <button
            key={t.id || "all"}
            onClick={() => setRole(t.id)}
            className={`btn btn-sm ${role === t.id ? "btn-primary" : "btn-ghost"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl animate-pulse h-40" />
      ) : (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm overflow-hidden">
          {users.length ? (
            <ul className="divide-y divide-base-300/70">
              {users.map((user) => (
                <li key={user._id} className="px-5 py-4 flex items-center gap-3">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{user.fullName}</p>
                    <p className="text-xs text-base-content/55 truncate">{user.email}</p>
                  </div>
                  <span className={`badge badge-sm ${ROLE_BADGE[user.role] || "badge-ghost"} capitalize`}>
                    {user.role}
                  </span>
                  <span className="text-xs text-base-content/40 hidden sm:block">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-14 text-center text-sm text-base-content/55">
              No users found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;