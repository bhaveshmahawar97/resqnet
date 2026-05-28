import { useT } from "../../../context/ThemeContext";
import { STATUS_LABEL } from "../../../constants/ui";

// ─── SEVERITY BADGE ───────────────────────────────────────────────────────────
export function SeverityBadge({ level, size = "sm" }) {
  const { T } = useT();
  const safeLevel = typeof level === "string" ? level.toLowerCase() : "unknown";

  // All colors from T.* — no hardcoded hex
  const colorMap = {
    critical: { color: T.danger,   bg: T.dangerPale,   border: T.dangerBorder },
    high:     { color: T.warning,  bg: T.warningPale,  border: T.warningBorder },
    medium:   { color: T.info,     bg: T.infoPale,     border: T.infoBorder },
    moderate: { color: T.info,     bg: T.infoPale,     border: T.infoBorder },
    low:      { color: T.success,  bg: T.successPale,  border: T.successBorder },
    unknown:  { color: T.textMuted, bg: T.bgAlt,       border: T.border },
  };

  const c = colorMap[safeLevel] || colorMap.unknown;

  return (
    <span
      className={`rq-chip ${size === "sm" ? "rq-chip-sm" : ""}`}
      style={{ background: c.bg, borderColor: c.border, color: c.color }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
      {safeLevel}
    </span>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const { T } = useT();
  const safeStatus = typeof status === "string" ? status : "";

  // All colors from T.* — no hardcoded hex
  // "pending" maps to info (no purple in design system)
  const colorMap = {
    pending:     { color: T.info,     bg: T.infoPale,    border: T.infoBorder },
    accepted:    { color: T.accent,   bg: T.accentPale,  border: `${T.accent}33` },
    in_progress: { color: T.info,     bg: T.infoPale,    border: T.infoBorder },
    dispatched:  { color: T.warning,  bg: T.warningPale, border: T.warningBorder },
    on_site:     { color: T.accent,   bg: T.accentPale,  border: `${T.accent}33` },
    rescued:     { color: T.success,  bg: T.successPale, border: T.successBorder },
    resolved:    { color: T.success,  bg: T.successPale, border: T.successBorder },
    completed:   { color: T.success,  bg: T.successPale, border: T.successBorder },
    active:      { color: T.success,  bg: T.successPale, border: T.successBorder },
    available:   { color: T.success,  bg: T.successPale, border: T.successBorder },
    approved:    { color: T.success,  bg: T.successPale, border: T.successBorder },
    cancelled:   { color: T.danger,   bg: T.dangerPale,  border: T.dangerBorder },
    rejected:    { color: T.danger,   bg: T.dangerPale,  border: T.dangerBorder },
    busy:        { color: T.warning,  bg: T.warningPale, border: T.warningBorder },
    offline:     { color: T.textMuted, bg: T.bgAlt,      border: T.border },
  };

  const c = colorMap[safeStatus] || { color: T.textMuted, bg: T.bgAlt, border: T.border };
  const label = STATUS_LABEL[safeStatus] || safeStatus.replace(/_/g, " ") || "Unknown";

  return (
    <span className="rq-chip" style={{ background: c.bg, borderColor: c.border, color: c.color }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
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
