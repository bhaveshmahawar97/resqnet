/* eslint-disable react-refresh/only-export-components -- NotificationContext intentionally exports both provider and hook */
/* eslint-disable react-hooks/set-state-in-effect -- context polling pattern */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import useSocket from "../hooks/useSocket";
import { useToast } from "./ToastContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const toast = useToast();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user || !localStorage.getItem("token")) return;
    try {
      const [notifsRes, unreadRes] = await Promise.all([
        api.get("/notifications?limit=20"),
        api.get("/notifications/unread-count"),
      ]);

      if (notifsRes.data?.success) {
        setNotifications(notifsRes.data.data.items || []);
      }
      if (unreadRes.data?.success) {
        setUnreadCount(unreadRes.data.count || 0);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Failed to fetch notifications:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch initial notifications when user logs in
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }
    fetchNotifications();
  }, [user, fetchNotifications]);

  // Real-time socket updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Show toast alert
      toast.show(notif.message, notif.priority === "critical" ? "error" : "info");
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket, isConnected, toast]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
