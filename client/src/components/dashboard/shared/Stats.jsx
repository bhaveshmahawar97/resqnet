import { useT } from "../../../context/ThemeContext";

// ─── STATS ROW ────────────────────────────────────────────────────────────────
export function DashboardStats({ stats = [] }) {
  const { T } = useT();
  const safeStats = Array.isArray(stats) ? stats : [];

  if (safeStats.length === 0) return null;

  return (
    <div className="rq-dashboard-stats-grid">
      {safeStats.map((stat, i) => (
        <div key={i} className="rq-section-card" style={{ padding: "var(--space-5)", marginBottom: 0, position: "relative", border: stat.highlight ? `1px solid ${T.accent}` : undefined }}>
          {stat.highlight && (
            <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: T.accent }} />
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-3)" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {stat.label}
            </div>
            {stat.icon && (
              <div style={{ fontSize: "1.2rem", color: stat.highlight ? T.accent : T.textMuted, opacity: 0.8 }}>
                {stat.icon}
              </div>
            )}
          </div>
          <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: stat.highlight ? T.accent : T.textHeading || T.text, lineHeight: 1 }}>
            {stat.value}
          </div>
          {stat.sub && (
            <div style={{ fontSize: "var(--text-xs)", marginTop: "var(--space-2)", fontWeight: 600, color: stat.trend === "up" ? T.success : stat.trend === "down" ? T.danger : T.textMuted }}>
              {stat.trend === "up" ? "↑ " : stat.trend === "down" ? "↓ " : ""}{stat.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

