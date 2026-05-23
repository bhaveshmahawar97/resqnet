import { useT } from "../../../context/ThemeContext";

// ─── QUICK ACTIONS ────────────────────────────────────────────────────────────
export function DashboardQuickActions({ actions = [] }) {
  const { T } = useT();
  const safeActions = Array.isArray(actions) ? actions : [];
  return (
    <div className="rq-quick-action-grid">
      {safeActions.map((action, i) => (
        <button
          key={i}
          onClick={action.onClick}
          className="rq-section-card"
          style={{
            padding: "var(--space-4)", marginBottom: 0,
            border: action.danger ? `1px solid ${T.dangerBorder || "rgba(220,38,38,0.2)"}` : `1px solid ${T.border}`,
            background: action.primary ? T.accent : action.danger ? (T.dangerPale || "rgba(220,38,38,0.07)") : T.bgCard,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8,
            textAlign: "left",
            boxShadow: action.primary ? `0 2px 8px ${T.accentGlow || "rgba(0,0,0,0.2)"}` : "var(--shadow-sm)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
        >
          <span style={{ fontSize: "1.15rem", color: action.primary ? "#fff" : action.danger ? T.danger : T.accent }}>{action.icon}</span>
          <div>
            <div style={{
              fontSize: "var(--text-sm)", fontWeight: 700,
              color: action.primary ? "#fff" : action.danger ? (T.danger || "#DC2626") : T.textHeading || T.text,
              letterSpacing: "-0.01em", lineHeight: 1.25,
            }}>
              {action.label}
            </div>
            {action.sub && (
              <div style={{ fontSize: "var(--text-xs)", color: action.primary ? "rgba(255,255,255,0.65)" : T.textMuted, marginTop: 2, lineHeight: 1.3 }}>
                {action.sub}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

