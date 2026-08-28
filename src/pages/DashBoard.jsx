import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useAuthStore } from "../store/useAuthStore";
import { getDashboardConfig } from "../constants/dashboard";

const today = () =>
  new Date().toLocaleDateString( {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const DashBoard = () => {
  const { authUser, onlineUsers } = useAuthStore();
  const config = getDashboardConfig(authUser?.role);
  const { pathname } = useLocation();

  // The overview is the dashboard root, so there is nowhere to go back to.
  const isOverview = pathname.replace(/\/$/, "") === "/dashboard";

  // Live values the client already knows about; everything else stays at its
  // configured default until a real endpoint backs it.
  const liveValues = { online: Math.max(onlineUsers.length - 1, 0) };

  const firstName = authUser?.fullName?.split(" ")[0] ?? "there";
  const Cta = config.cta?.icon;

  return (
    <div className="min-h-screen bg-base-200/60">
      {/* Soft wash behind the header so the page has depth without a hard band. */}
      <div className="bg-gradient-to-b from-primary/[0.07] to-transparent pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
       
            <BackButton to="/dashboard" label="Back to overview" className="mb-3 -ml-3" />
     

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 cm-stagger">
            <div className="avatar">
              <div className="size-14 rounded-2xl ring-2 ring-primary/20 ring-offset-2 ring-offset-base-200 cm-pulse">
                <img
                  src={authUser?.profilePic || "/avatar.png"}
                  alt={authUser?.fullName ?? "Your avatar"}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-primary  p-3 font-bold">{config.label}</span>
                <span className="text-xs text-base-content/50">{today()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                Welcome back, {firstName}
              </h1>
              <p className="text-base-content/60 mt-1 text-sm sm:text-base">{config.subtitle}</p>
            </div>

            {config.cta && (
              <Link to={config.cta.to} className="btn btn-primary gap-2 shadow-sm">
                {Cta && <Cta className="size-4" />}
                {config.cta.label}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 max-height--custom">
        <div className="flex flex-col lg:flex-row gap-6">
          <nav className="lg:w-60 shrink-0 bg-base-100 border border-base-300/70 rounded-2xl shadow-sm w-full gap-1 p-2 flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
            <div className="lg:sticky lg:top-9 ">
              <ul className="menu ">
                {config.nav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id} className="shrink-0 mb-4">
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `rounded-xl font-medium whitespace-nowrap ${
                            isActive ? "bg-primary text-primary-content" : ""
                          }`
                        }
                      >
                        {Icon && <Icon className="size-4" />}
                        {item.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <main className="flex-1 min-w-0">
            <Outlet context={{ config, authUser, liveValues }} />
          </main>
        </div>
      </div>
    </div>
  );
};
export default DashBoard;
