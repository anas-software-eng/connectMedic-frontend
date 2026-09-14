import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import IncomingCallBanner from "./IncomingCallBanner";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCallStore } from "../store/useCallStore";

// Chrome shared by every route: theme wrapper, navbar, toasts, and the
// incoming-call listener (so a call can be answered from any page).
const RootLayout = () => {
  const { theme } = useThemeStore();
  const socket = useAuthStore((state) => state.socket);
  const { attachSignaling, detachSignaling } = useCallStore();

  useEffect(() => {
    if (!socket) return;
    attachSignaling();
    return () => detachSignaling();
  }, [socket, attachSignaling, detachSignaling]);

  return (
    <div data-theme={theme}>
      <a href="#main-content" className="skip-link btn btn-primary btn-sm">
        Skip to main content
      </a>
      <Navbar />
      <IncomingCallBanner />
      <main id="main-content">
        <Outlet />
      </main>
      <Toaster
        toastOptions={{
          duration: 4500,
          style: { fontSize: "0.95rem" },
        }}
      />
    </div>
  );
};
export default RootLayout;
