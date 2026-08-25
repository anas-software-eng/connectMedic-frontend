import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ROLES } from "../constants/dashboard";

// Pathless layout route: wrap child routes to require a session and, optionally,
// one of `allow`. Renders whatever the matched child route is via <Outlet />.
const RoleRoute = ({ allow }) => {
  const { authUser } = useAuthStore();
  // <Outlet> always replaces the outlet context, so a guard nested inside the
  // dashboard has to forward its parent's context or the page below it loses it.
  const parentContext = useOutletContext();

  if (!authUser) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(authUser.role ?? ROLES.PATIENT))
    return <Navigate to="/dashboard" replace />;

  return <Outlet context={parentContext} />;
};
export default RoleRoute;
