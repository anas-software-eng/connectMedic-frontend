import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";

import RootLayout from "./components/RootLayout";
import RoleRoute from "./components/RoleRoute";

import LandingPage from "./pages/LandingPage";
import Message from "./pages/Message";
import DashBoard from "./pages/DashBoard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import PlaceholderPage from "./pages/dashboard/PlaceholderPage";
import CareTeamPage from "./pages/dashboard/CareTeamPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuthStore } from "./store/useAuthStore";
import { ROLES } from "./constants/dashboard";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <Routes>
      {/* Layout route: navbar + theme + toasts wrap every page via <Outlet />. */}
      <Route element={<RootLayout />}>
        <Route index element={authUser ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="signup" element={!authUser ? <SignUpPage /> : <Navigate to="/dashboard" />} />
        <Route path="login" element={!authUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Pathless guard: everything nested here requires a session. */}
        <Route element={<RoleRoute />}>
          <Route path="profile" element={<ProfilePage />} />

          {/* Shared dashboard shell; nested routes fill its <Outlet />. */}
          <Route path="dashboard" element={<DashBoard />}>
            <Route index element={<DashboardHome />} />
            <Route path="care-team" element={<CareTeamPage />} />
            <Route path="messages" element={<Message />} />
            <Route path="records" element={<PlaceholderPage title="Records" />} />

            <Route element={<RoleRoute allow={[ROLES.DOCTOR, ROLES.ADMIN]} />}>
              <Route path="patients" element={<PlaceholderPage title="Patients" />} />
              <Route path="schedule" element={<PlaceholderPage title="Schedule" />} />
            </Route>

            <Route element={<RoleRoute allow={[ROLES.ADMIN]} />}>
              <Route path="admin/users" element={<PlaceholderPage title="Users" />} />
              <Route path="admin/audit" element={<PlaceholderPage title="Audit log" />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Chat used to live at the top level; keep old links working. */}
        <Route path="messages" element={<Navigate to="/dashboard/messages" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
export default App;
