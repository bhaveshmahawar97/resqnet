import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Auth pages should render without Footer overlays
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <div style={{ width: "100%", minHeight: "100svh", overflowX: "hidden", position: "relative" }}>
      <Navbar />
      <div style={{ width: "100%", overflowX: "hidden" }}>
        <Outlet />
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
}
