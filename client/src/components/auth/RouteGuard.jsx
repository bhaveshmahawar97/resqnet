import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccessDenied from "../../pages/dashboard/AccessDenied";

/**
 * RouteGuard
 * Handles authentication checks and role validation.
 * Replaces both ProtectedRoute and RoleRoute/AdminRoute.
 */
export default function RouteGuard({ allowedRoles = [] }) {
  const { isAuthenticated, role, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save attempted location for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admins always bypass role restrictions (unless strictly enforced, but here we allow admins to see everything if needed)
  if (isAdmin) {
    return <Outlet />;
  }

  // Check roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <AccessDenied scope={allowedRoles.join(" or ")} />;
  }

  return <Outlet />;
}
