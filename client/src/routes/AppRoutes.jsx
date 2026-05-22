import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { APP_ROUTES } from "./routesConfig";

export default function AppRoutes() {
  const publicRoutes = APP_ROUTES.filter((route) => !route.protected);
  const protectedRoutes = APP_ROUTES.filter((route) => route.protected);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {publicRoutes.map((route) => (
          <Route key={route.path || "index"} {...{ index: route.index, path: route.path, element: route.element }} />
        ))}

        {protectedRoutes.length > 0 && (
          <Route element={<ProtectedRoute />}>
            {protectedRoutes.map((route) => {
              if (route.role) {
                return (
                  <Route key={route.path} element={<RoleRoute requiredRole={route.role} />}>
                    <Route {...{ index: route.index, path: route.path, element: route.element }} />
                  </Route>
                );
              }

              return <Route key={route.path} {...{ index: route.index, path: route.path, element: route.element }} />;
            })}
          </Route>
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
