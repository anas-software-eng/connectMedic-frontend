import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import { useThemeStore } from "../store/useThemeStore";

// Chrome shared by every route: theme wrapper, navbar, toasts.
const RootLayout = () => {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme}>
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
};
export default RootLayout;
