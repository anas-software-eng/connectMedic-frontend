import { useEffect, useState } from "react";
import { ShieldBan, ShieldCheck, Users } from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";
import { useAuthStore } from "../store/useAuthStore";

const ROLE_TABS = [
  { id: "", label: "All" },
  { id: "patient", label: "Patients" },
  { id: "doctor", label: "Doctors" },
  { id: "admin", label: "Admins" },
];

const AdminUsersPage = () => {
  const [role, setRole] = useState("");
  const { users, isFetching, fetchUsers, updateUserRole, setUserBanned } = useAdminStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    fetchUsers(role);
  }, [role, fetchUsers]);

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

      {isFetching ? (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl animate-pulse h-40" />
      ) : (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm overflow-hidden">
          {users.length ? (
            <ul className="divide-y divide-base-300/70">
              {users.map((user) => {
                const isSelf = user._id === authUser?._id;
                return (
                  <li key={user._id} className="px-5 py-4 flex flex-wrap items-center gap-3">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="size-10 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate flex items-center gap-2">
                        {user.fullName}
                        {isSelf && <span className="badge badge-ghost badge-xs">You</span>}
                        {user.isBanned && <span className="badge badge-error badge-xs">Banned</span>}
                      </p>
                      <p className="text-xs text-base-content/72 truncate">{user.email}</p>
                    </div>

                    <select
                      value={user.role}
                      disabled={isSelf}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      className="select select-bordered select-sm capitalize"
                    >
                      {["patient", "doctor", "admin"].map((r) => (
                        <option key={r} value={r} className="capitalize">
                          {r}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      disabled={isSelf}
                      onClick={() => setUserBanned(user._id, !user.isBanned)}
                      className={`btn btn-sm gap-1.5 ${user.isBanned ? "btn-success" : "btn-ghost text-error"}`}
                    >
                      {user.isBanned ? <ShieldCheck className="size-4" /> : <ShieldBan className="size-4" />}
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>

                    <span className="text-xs text-base-content/65 hidden sm:block w-full sm:w-auto">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-6 py-14 text-center text-sm text-base-content/72">
              No users found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
