import { motion } from "framer-motion";
import { timeAgo } from "../../utils/dateUtils";
import { useT } from "../../context/ThemeContext";

const priorityConfig = {
  critical: { color: "#EF4444", icon: "🚨" },
  high: { color: "#F97316", icon: "⚠️" },
  medium: { color: "#3B82F6", icon: "ℹ️" },
  low: { color: "#6B7280", icon: "🔔" },
};

const typeIcons = {
  rescue_created: "🚑",
  rescue_assigned: "📋",
  rescue_accepted: "✅",
  rescue_rejected: "❌",
  rescue_completed: "🎉",
  rescue_status: "🔄",
  ngo_assignment_received: "🏢",
  volunteer_assigned: "🙋",
  adoption_submitted: "🐾",
  adoption_approved: "🏡",
  ai_scan_completed: "🤖",
};

export default function NotificationCard({ notification, onRead }) {
  const { T } = useT();
  const { type, title, message, priority, read, createdAt } = notification;

  const config = priorityConfig[priority] || priorityConfig.medium;
  const icon = typeIcons[type] || config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        background: read ? T.bgCard : T.bgAlt,
        borderLeft: `3px solid ${read ? "transparent" : config.color}`,
        borderBottom: `1px solid ${T.border}`,
        cursor: read ? "default" : "pointer",
        transition: "background 0.2s ease",
      }}
      onClick={() => {
        if (!read && onRead) onRead(notification._id);
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: read ? T.bgAlt : `${config.color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
            marginBottom: 2,
          }}
        >
          <div
            style={{
              fontSize: "0.82rem",
              fontWeight: read ? 600 : 700,
              color: T.text,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "0.68rem",
              color: T.textMuted,
              whiteSpace: "nowrap",
            }}
          >
            {timeAgo(createdAt)}
          </div>
        </div>
        <div
          style={{
            fontSize: "0.78rem",
            color: read ? T.textSub : T.text,
            lineHeight: 1.4,
          }}
        >
          {message}
        </div>
      </div>
      {!read && (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: config.color,
            marginTop: 4,
            flexShrink: 0,
          }}
        />
      )}
    </motion.div>
  );
}
