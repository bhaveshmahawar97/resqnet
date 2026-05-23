import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, ROLES } from "../../context/AuthContext";

/**
 * GuestGuard
 * Prevents authenticated users from seeing Login/Register pages.
 * Redirects them instantly to their dashboard.
 */
export default function GuestGuard() {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // If they tried to go to login, send them back to where they came from or their dashboard
    const from = location.state?.from?.pathname;
    
    if (from) {
      return <Navigate to={from} replace />;
    }

    const destination = {
      [ROLES.user]: "/dashboard/user",
      [ROLES.ngo]: "/dashboard/ngo",
      [ROLES.volunteer]: "/dashboard/volunteer",
      [ROLES.admin]: "/dashboard/admin",
    }[role] || "/dashboard/user";

    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}
