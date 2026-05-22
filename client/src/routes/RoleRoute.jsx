import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccessDenied from "../pages/dashboard/AccessDenied";

export default function RoleRoute({ requiredRole }) {
  const { isAuthenticated, role, isAdmin } = useAuth();

  if (!isAuthenticated) return null; // Parent ProtectedRoute handles redirects

  // Admins bypass role checks
  if (isAdmin) return <Outlet />;

  if (requiredRole && role !== requiredRole) {
    return <AccessDenied scope={requiredRole} />;
  }

  return <Outlet />;
}
