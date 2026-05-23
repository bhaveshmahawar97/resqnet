import { motion } from "framer-motion";
import { useT } from "../../../context/ThemeContext";

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export function DashboardNotifications({ items = [], onClose, onMarkAll }) {
  const { T } = useT();
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.16 }}
      style={{
        position: "absolute", top: "calc(100% + 8px)", right: 0,
        width: "min(360px, calc(100vw - 24px))",
        background: T.bgCard, border: `1px solid ${T.border}`,
        borderRadius: 14, boxShadow: T.shadowLg, zIndex: 200, overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 16px 12px", borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.textHeading || T.text, letterSpacing: "-0.02em" }}>
          Notifications
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={onMarkAll} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.72rem", color: T.accent, fontFamily: "inherit", fontWeight: 600,
          }}>
            Mark all read
          </button>
          <button onClick={onClose} style={{
            width: 26, height: 26, borderRadius: 7,
            border: `1px solid ${T.border}`, background: T.bgAlt,
            cursor: "pointer", color: T.textMuted, fontSize: "0.9rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            ✕
          </button>
        </div>
      </div>

      {/* Items */}
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {safeItems.length === 0 && (
          <div style={{ padding: "2rem 1rem", textAlign: "center", color: T.textMuted, fontSize: "0.84rem" }}>
            No notifications yet
          </div>
        )}
        {safeItems.map((n) => (
          <div key={n.id} style={{
            display: "flex", gap: 10, padding: "12px 16px",
            borderBottom: `1px solid ${T.border}`,
            background: n.read ? "transparent" : T.accentSurface || T.accentPale,
            alignItems: "flex-start",
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", marginTop: 6,
              background: n.read ? T.border : T.accent, flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: T.text, lineHeight: 1.35 }}>{n.title}</div>
              <div style={{ fontSize: "0.73rem", color: T.textSub, marginTop: 2, lineHeight: 1.45 }}>{n.body}</div>
              <div style={{ fontSize: "0.66rem", color: T.textMuted, marginTop: 3 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

