import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import RouteGuard from "../components/auth/RouteGuard";
import GuestGuard from "../components/auth/GuestGuard";
import { APP_ROUTES } from "./routesConfig";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {APP_ROUTES.map((route) => {
          let element = route.element;

          // Wrap in GuestGuard
          if (route.guestOnly) {
            element = (
              <Route element={<GuestGuard />}>
                <Route {...{ index: route.index, path: route.path, element: route.element }} />
              </Route>
            );
            return element;
          }

          // Wrap in RouteGuard
          if (route.protected) {
            element = (
              <Route element={<RouteGuard allowedRoles={route.allowedRoles} />}>
                <Route {...{ index: route.index, path: route.path, element: route.element }} />
              </Route>
            );
            return element;
          }

          return (
            <Route key={route.path || "index"} {...{ index: route.index, path: route.path, element: route.element }} />
          );
        })}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
