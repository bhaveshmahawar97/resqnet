import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Adoption from "../pages/Adoption";
import Rescue from "../pages/Rescue";
import NGOs from "../pages/NGOs";
import Scanner from "../pages/Scanner";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import UserDashboard from "../pages/dashboard/UserDashboard";
import NGODashboard from "../pages/dashboard/NGODashboard";
import VolunteerDashboard from "../pages/dashboard/VolunteerDashboard";
import AdminRoute from "./AdminRoute";

function DashboardRedirect() {
  const { role } = useAuth();
  const destination = {
    user: "/dashboard/user",
    ngo: "/dashboard/ngo",
    volunteer: "/dashboard/volunteer",
    admin: "/dashboard/admin",
  }[role] || "/dashboard/user";

  return <Navigate to={destination} replace />;
}

export const ROUTE_LINKS = [
  { label: "Home", to: "/" },
  { label: "NGOs", to: "/ngos" },
  { label: "Adopt", to: "/adoption" },
  { label: "AI Health", to: "/ai-health" },
  { label: "Emergency", to: "/rescue" },
];

export const APP_ROUTES = [
  { index: true, element: <Home /> },
  { path: "scanner", element: <Scanner />, protected: true },
  { path: "ai-health", element: <Scanner /> },
  { path: "adoption", element: <Adoption /> },
  { path: "adopt", element: <Navigate to="/adoption" replace /> },
  { path: "rescue", element: <Rescue /> },
  { path: "ngos", element: <NGOs /> },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "signup", element: <Navigate to="/register" replace /> },
  { path: "dashboard", element: <DashboardRedirect />, protected: true },
  { path: "dashboard/user", element: <UserDashboard />, protected: true, role: "user" },
  { path: "dashboard/ngo", element: <NGODashboard />, protected: true, role: "ngo" },
  { path: "dashboard/volunteer", element: <VolunteerDashboard />, protected: true, role: "volunteer" },
  { path: "dashboard/admin", element: <AdminRoute />, protected: true, role: "admin" },
  { path: "admin", element: <Navigate to="/dashboard/admin" replace /> },
];
