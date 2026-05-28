import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import RouteGuard from "../components/auth/RouteGuard";
import GuestGuard from "../components/auth/GuestGuard";
import { APP_ROUTES } from "./routesConfig";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {APP_ROUTES.map((route) => {
          // Wrap in GuestGuard
          if (route.guestOnly) {
            return (
              <Route key={route.path} element={<GuestGuard />}>
                <Route {...{ index: route.index, path: route.path, element: route.element }} />
              </Route>
            );
          }

          // Wrap in RouteGuard
          if (route.protected) {
            return (
              <Route key={route.path} element={<RouteGuard allowedRoles={route.allowedRoles} />}>
                <Route {...{ index: route.index, path: route.path, element: route.element }} />
              </Route>
            );
          }

          return (
            <Route key={route.path || "index"} {...{ index: route.index, path: route.path, element: route.element }} />
          );
        })}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
