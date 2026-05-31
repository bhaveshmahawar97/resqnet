/* eslint-disable react-refresh/only-export-components */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Adoption from "../pages/Adoption";
import Rescue from "../pages/Rescue";
import NGOs from "../pages/NGOs";
import NGORegister from "../pages/NGORegister";
import Scanner from "../pages/Scanner";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import GoogleCallback from "../pages/auth/GoogleCallback";
import UserDashboard from "../pages/dashboard/UserDashboard";
import NGODashboard from "../pages/dashboard/NGODashboard";
import VolunteerDashboard from "../pages/dashboard/VolunteerDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import Profile from "../pages/Profile";

function DashboardRedirect() {
  const { role } = useAuth();
  
  if (!role) return null; // Let loading state or guard handle it
  
  const destination = {
    user: "/dashboard/user",
    ngo: "/dashboard/ngo",
    volunteer: "/dashboard/volunteer",
    admin: "/dashboard/admin",
  }[role] || "/dashboard/user";

  return <Navigate to={destination} replace />;
}

export const ROUTE_LINKS = [
  { label: "Emergency Rescue", to: "/rescue"    },
  { label: "Rescue Partners",  to: "/ngos"      },
  { label: "Adoption",         to: "/adoption"  },
  { label: "AI Scanner",       to: "/ai-health" },
];

export const APP_ROUTES = [
  { index: true, element: <Home /> },
  { path: "ai-health", element: <Scanner /> },
  { path: "adoption", element: <Adoption /> },
  { path: "adopt", element: <Navigate to="/adoption" replace /> },
  { path: "rescue", element: <Rescue /> },
  { path: "ngos", element: <NGOs /> },
  { path: "ngo-register", element: <NGORegister /> },
  { path: "login", element: <Login />, guestOnly: true },
  { path: "register", element: <Register />, guestOnly: true },
  { path: "signup", element: <Navigate to="/register" replace /> },
  { path: "auth/callback", element: <GoogleCallback /> },
  
  // Protected Routes
  { path: "scanner", element: <Scanner />, protected: true },
  { path: "dashboard", element: <DashboardRedirect />, protected: true },
  { path: "dashboard/user", element: <UserDashboard />, protected: true, allowedRoles: ["user"] },
  { path: "dashboard/ngo", element: <NGODashboard />, protected: true, allowedRoles: ["ngo"] },
  { path: "dashboard/volunteer", element: <VolunteerDashboard />, protected: true, allowedRoles: ["volunteer"] },
  { path: "dashboard/admin", element: <AdminDashboard />, protected: true, allowedRoles: ["admin"] },
  { path: "admin", element: <Navigate to="/dashboard/admin" replace /> },
  { path: "profile", element: <Profile />, protected: true },
];
