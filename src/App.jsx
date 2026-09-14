import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Loader } from "lucide-react";

import RootLayout from "./components/RootLayout";
import RoleRoute from "./components/RoleRoute";

// Lazy-loaded so the first paint doesn't pay for the whole app (cards, chat,
// chakra-based profile form, admin views) up front.
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Message = lazy(() => import("./pages/Message"));
const DashBoard = lazy(() => import("./pages/DashBoard"));
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const CareTeamPage = lazy(() => import("./pages/dashboard/CareTeamPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const FindDoctorsPage = lazy(() => import("./pages/FindDoctorsPage"));
const DoctorDetailPage = lazy(() => import("./pages/DoctorDetailPage"));
const AppointmentsPage = lazy(() => import("./pages/AppointmentsPage"));
const PatientsPage = lazy(() => import("./pages/PatientsPage"));
const VerifyDoctorsPage = lazy(() => import("./pages/VerifyDoctorsPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const AdminAppointmentsPage = lazy(() => import("./pages/AdminAppointmentsPage"));
const AdminConversationPage = lazy(() => import("./pages/AdminConversationPage"));
const AdminAnnouncementPage = lazy(() => import("./pages/AdminAnnouncementPage"));
const AuditLogPage = lazy(() => import("./pages/AuditLogPage"));
const AiAssistantPage = lazy(() => import("./pages/AiAssistantPage"));
const VideoCallPage = lazy(() => import("./pages/VideoCallPage"));

import { useAuthStore } from "./store/useAuthStore";
import { ROLES } from "./constants/dashboard";

const PageLoader = (
  <div className="flex items-center justify-center h-screen">
    <Loader className="size-10 animate-spin" />
  </div>
);

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return PageLoader;

  return (
    <Suspense fallback={PageLoader}>
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
            <Route path="find-doctors" element={<FindDoctorsPage />} />
            <Route path="find-doctors/:id" element={<DoctorDetailPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="care-team" element={<CareTeamPage />} />
            <Route path="messages" element={<Message />} />
            <Route path="call/:userId" element={<VideoCallPage />} />

            <Route element={<RoleRoute allow={[ROLES.PATIENT]} />}>
              <Route path="assistant" element={<AiAssistantPage />} />
            </Route>

            <Route element={<RoleRoute allow={[ROLES.DOCTOR]} />}>
              <Route path="patients" element={<PatientsPage />} />
            </Route>

            <Route element={<RoleRoute allow={[ROLES.ADMIN]} />}>
              <Route path="verify-doctors" element={<VerifyDoctorsPage />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/appointments" element={<AdminAppointmentsPage />} />
              <Route path="admin/messages/:userAId/:userBId" element={<AdminConversationPage />} />
              <Route path="admin/announce" element={<AdminAnnouncementPage />} />
              <Route path="admin/audit" element={<AuditLogPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Chat used to live at the top level; keep old links working. */}
        <Route path="messages" element={<Navigate to="/dashboard/messages" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      </Routes>
    </Suspense>
  );
};
export default App;
