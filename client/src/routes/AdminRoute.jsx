import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import AccessDenied from "../pages/dashboard/AccessDenied";

export default function AdminRoute() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <AccessDenied scope="admin" />;
  return <AdminDashboard />;
}
