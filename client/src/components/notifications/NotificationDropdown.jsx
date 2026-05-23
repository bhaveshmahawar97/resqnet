import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { useNotification } from "../../context/NotificationContext";
import NotificationCard from "./NotificationCard";

export default function NotificationDropdown({ isOpen, onClose }) {
  const { T } = useT();
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotification();
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "clamp(300px, 90vw, 360px)",
            maxHeight: "80vh",
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            boxShadow: `0 10px 30px ${T.shadow}`,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: T.bgAlt,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 700, color: T.text }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: T.accent,
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 10,
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "0.72rem",
                  color: T.accent,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              maxHeight: "calc(80vh - 60px)",
            }}
          >
            {loading && notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: T.textMuted, fontSize: "0.82rem" }}>
                Loading updates...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: T.textMuted }}>
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>📭</div>
                <div style={{ fontSize: "0.85rem" }}>You're all caught up!</div>
                <div style={{ fontSize: "0.75rem", marginTop: 4, opacity: 0.7 }}>
                  No new operational alerts.
                </div>
              </div>
            ) : (
              <div>
                {notifications.map((notif) => (
                  <NotificationCard
                    key={notif._id}
                    notification={notif}
                    onRead={markAsRead}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
