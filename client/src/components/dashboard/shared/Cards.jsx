import { motion } from "framer-motion";
import { useT } from "../../../context/ThemeContext";
import { getRescueImageUrl } from "../../../utils/imageUrl";

import { SeverityBadge, StatusBadge } from "./Badges";

// ─── CARD ─────────────────────────────────────────────────────────────────────
export function Card({ children, style: s = {}, hover = true, onClick }) {
  return (
    <motion.div
      whileHover={hover && !onClick ? {} : hover && onClick ? { y: -2 } : {}}
      onClick={onClick}
      className={`rq-card ${onClick ? "rq-card-interactive" : ""}`}
      style={{
        ...s,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── RESCUE CASE ROW ──────────────────────────────────────────────────────────
export function RescueCaseRow({ rescue, onView, onAssign, showAssign = false }) {
  const { T } = useT();
  const thumb = getRescueImageUrl(rescue);
  return (
    <div className="rq-rescue-row" onClick={onView} style={{ cursor: "pointer" }}>
      {/* Thumbnail */}
      {thumb ? (
        <img src={thumb} alt="rescue" className="rq-rescue-row-thumb" />
      ) : (
        <div className="rq-rescue-row-thumb" style={{
          background: T.bgAlt, border: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      )}

      {/* Info */}
      <div className="rq-rescue-row-content">
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: T.textMuted, fontFamily: "monospace" }}>
            #{rescue.id || rescue._id?.slice(-6)}
          </span>
          <SeverityBadge level={rescue.severity} />
        </div>
        <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: T.text, letterSpacing: "-0.015em", lineHeight: 1.25 }}>
          {rescue.animal || rescue.animalType || "Animal rescue"}
        </div>
        <div style={{ fontSize: "var(--text-xs)", color: T.textMuted, marginTop: 2, display: "flex", alignItems: "center", gap: 3 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {rescue.location || rescue.address || "Location not set"}
        </div>
      </div>

      {/* Status */}
      <div style={{ flexShrink: 0 }}>
        <StatusBadge status={rescue.status} />
      </div>

      {/* AI Score */}
      {rescue.aiScore != null && (
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "var(--text-xs)", color: T.textMuted, marginBottom: 2 }}>AI Score</div>
          <div style={{
            fontSize: "var(--text-sm)", fontWeight: 800, letterSpacing: "-0.03em",
            color: rescue.aiScore >= 70 ? (T.danger || "#DC2626")
                 : rescue.aiScore >= 40 ? (T.warning || "#D97706")
                 : (T.success || "#059669"),
          }}>
            {rescue.aiScore}
          </div>
        </div>
      )}

      {/* Assign button */}
      {showAssign && (
        <button
          onClick={(e) => { e.stopPropagation(); onAssign?.(rescue); }}
          style={{
            padding: "5px 12px", borderRadius: "var(--radius-sm)",
            background: T.accent, border: "none", color: "#fff",
            fontSize: "var(--text-xs)", fontWeight: 700,
            cursor: "pointer", flexShrink: 0,
          }}
        >
          Assign
        </button>
      )}
    </div>
  );
}

