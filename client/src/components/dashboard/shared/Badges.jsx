import { useT } from "../../../context/ThemeContext";
import { SEVERITY_COLOR, STATUS_LABEL } from "../../../constants/ui";

// ─── SEVERITY BADGE ───────────────────────────────────────────────────────────
export function SeverityBadge({ level, size = "sm" }) {
  const { T } = useT();
  const safeLevel = typeof level === "string" ? level : "unknown";
  const colorMap = { critical: "#DC2626", high: "#EA580C", medium: "#D97706", low: "#059669", unknown: T.textMuted };
  const color = colorMap[safeLevel] || SEVERITY_COLOR[safeLevel] || T.accent;
  return (
    <span className={`rq-chip ${size === "sm" ? "rq-chip-sm" : ""}`} style={{
      background: `${color}15`, borderColor: `${color}30`, color
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {safeLevel}
    </span>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const { T } = useT();
  const safeStatus = typeof status === "string" ? status : "";
  const colorMap = {
    pending: "#9333EA", accepted: "#2563EB", in_progress: "#0EA5E9",
    rescued: "#059669", completed: "#10B981", cancelled: "#EF4444",
    dispatched: "#D97706", on_site: T.accent, resolved: "#059669",
    active: "#059669", available: "#059669", busy: "#EA580C", offline: "#6B7280",
    approved: "#059669", rejected: "#EF4444",
  };
  const color = colorMap[safeStatus] || T.textMuted;
  const label = STATUS_LABEL[safeStatus] || safeStatus.replace(/_/g, " ") || "Unknown";
  return (
    <span className="rq-chip" style={{
      background: `${color}15`, borderColor: `${color}30`, color
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {label}
    </span>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
export function SectionLabel({ children, action, onAction }) {
  const { T } = useT();
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: "var(--space-4)"
    }}>
      <h3 style={{
        fontSize: "var(--text-xs)", fontWeight: 700, color: T.textSub,
        letterSpacing: "0.08em", textTransform: "uppercase", margin: 0,
      }}>
        {children}
      </h3>
      {action && (
        <button onClick={onAction} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "var(--text-xs)", color: T.accent, fontWeight: 700,
          fontFamily: "inherit", display: "flex", alignItems: "center", gap: "0.25rem",
        }}>
          {action}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

