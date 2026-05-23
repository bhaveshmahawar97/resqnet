import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import AuthLoaderGate from "./components/auth/AuthLoaderGate";
import GlobalErrorBoundary from "./components/system/GlobalErrorBoundary";
import { ToastProvider } from "./context/ToastContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = decodeURIComponent(location.hash.slice(1));
    const el = document.getElementById(id);
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorBoundary>
        <ToastProvider>
          <div
            style={{
              width: "100%",
              minHeight: "100vh",
              overflowX: "hidden",
              boxSizing: "border-box",
            }}
          >
            <ScrollToHash />
            <AuthLoaderGate>
              <AppRoutes />
            </AuthLoaderGate>
          </div>
        </ToastProvider>
      </GlobalErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
