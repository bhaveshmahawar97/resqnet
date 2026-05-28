/* eslint-disable react-refresh/only-export-components -- ToastContext intentionally exports hook + provider from same file */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { TOAST_EVENT } from "../utils/toastEvent";

const ToastContext = createContext(null);

export const useToast = () => {
  return useContext(ToastContext);
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  useEffect(() => {
    const handleToastEvent = (e) => {
      addToast(e.detail.message, e.detail.type);
    };

    window.addEventListener(TOAST_EVENT, handleToastEvent);
    return () => window.removeEventListener(TOAST_EVENT, handleToastEvent);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "8px",
              backgroundColor: toast.type === "error" ? "#DC2626" : toast.type === "success" ? "#16A056" : toast.type === "warning" ? "#F59E0B" : "#374151",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 600,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              pointerEvents: "auto",
              minWidth: "250px",
              maxWidth: "400px",
              animation: "rqFadeInUp 0.3s ease-out forwards",
            }}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                padding: "0",
                fontSize: "1.2rem",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes rqFadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
