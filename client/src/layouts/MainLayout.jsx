import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { useT } from "../context/ThemeContext";

export default function MainLayout() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const { T } = useT();

  // Auth pages should render without Footer overlays
  const isAuthPage = pathname === "/login" || pathname === "/register";
  // Dashboard pages get their own padding handling
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100svh",
        overflowX: "hidden",
        position: "relative",
        background: T.bg,
        color: T.text,
      }}
    >
      <Navbar />
      <div
        style={{
          width: "100%",
          overflowX: "hidden",
          paddingTop: isDashboard ? 0 : undefined,
        }}
      >
        <Outlet />
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
}
