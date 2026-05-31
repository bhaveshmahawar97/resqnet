import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";

const CATEGORY_ICONS = {
  care: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  ngo: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  transport: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  monitor: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  emergency: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
  ),
};

function getIcon(text) {
  const lower = text.toLowerCase();
  if (lower.includes("emergency") || lower.includes("immediate") || lower.includes("urgent")) return "emergency";
  if (lower.includes("ngo") || lower.includes("rescue") || lower.includes("contact")) return "ngo";
  if (lower.includes("transport") || lower.includes("move") || lower.includes("clinic")) return "transport";
  if (lower.includes("monitor") || lower.includes("watch") || lower.includes("observe")) return "monitor";
  return "care";
}

function getIconColor(category, T) {
  switch (category) {
    case "emergency": return T.danger;
    case "ngo": return T.accent;
    case "transport": return T.info;
    case "monitor": return T.warning;
    default: return T.success;
  }
}

export default function ScannerRecommendations({ result }) {
  const { T } = useT();

  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: T.bgCard,
          border: `2px dashed ${T.borderLight}`,
          borderRadius: "var(--radius-lg)",
          padding: "2rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{
          width: 48,
          height: 48,
          borderRadius: "var(--radius-md)",
          background: T.bgAlt,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: T.textMuted,
          margin: "0 auto 0.75rem",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <div style={{ fontSize: "0.85rem", color: T.textMuted, lineHeight: 1.6 }}>
          Recommendations will appear after analysis
        </div>
      </motion.div>
    );
  }

  const items = Array.isArray(result.recommendations) ? result.recommendations
    : result.recommendation ? [result.recommendation]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: T.shadowSm,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.85rem 1.25rem",
        borderBottom: `1px solid ${T.border}`,
        background: T.bgAlt,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <span style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          Recommended Actions
        </span>
      </div>

      {/* Recommendations List */}
      {items.length > 0 ? (
        <div style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item, i) => {
            const cat = getIcon(item);
            const iconColor = getIconColor(cat, T);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: T.bgAlt,
                  border: `1px solid ${T.borderLight}`,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.bgCard;
                  e.currentTarget.style.borderColor = `${iconColor}30`;
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.bgAlt;
                  e.currentTarget.style.borderColor = T.borderLight;
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-sm)",
                  background: `${iconColor}12`,
                  border: `1px solid ${iconColor}30`,
                  color: iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {CATEGORY_ICONS[cat]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: "0.85rem",
                    color: T.text,
                    lineHeight: 1.65,
                    fontWeight: 500,
                    display: "block",
                  }}>
                    {item}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div style={{
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: T.textMuted,
          fontSize: "0.82rem",
        }}>
          No specific recommendations available for this assessment.
        </div>
      )}

      {/* Action CTAs */}
      <div style={{
        padding: "1rem 1.25rem",
        borderTop: `1px solid ${T.border}`,
        background: T.bgAlt,
        display: "flex",
        flexDirection: "column",
        gap: "0.65rem",
      }}>
        <Link
          to="/rescue"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            border: `1px solid ${T.danger}30`,
            background: `${T.danger}08`,
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${T.danger}12`;
            e.currentTarget.style.borderColor = T.danger;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${T.danger}08`;
            e.currentTarget.style.borderColor = `${T.danger}30`;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.danger} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: T.danger }}>
              Report Emergency Rescue
            </span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.danger} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </Link>

        <Link
          to="/ngos"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.65rem 1rem",
            borderRadius: "var(--radius-md)",
            border: `1px solid ${T.borderLight}`,
            background: "transparent",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = T.bgCard;
            e.currentTarget.style.borderColor = T.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = T.borderLight;
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: T.textSub }}>
              Find Nearby Rescue Partners
            </span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
