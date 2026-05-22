import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Wait until auth state is restored before deciding whether to redirect.
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "grid",
          placeItems: "center",
          background: "transparent",
          color: "inherit",
        }}
      >
        <span>Loading your session…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
