import { useT } from "../../../context/ThemeContext";

// ─── STATS ROW ────────────────────────────────────────────────────────────────
export function DashboardStats({ stats = [] }) {
  const { T } = useT();
  const safeStats = Array.isArray(stats) ? stats : [];

  if (safeStats.length === 0) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "0.875rem",
      }}
    >
      {safeStats.map((stat, i) => {
        const trendUp = stat.trend === "up";
        const trendDown = stat.trend === "down";
        const trendColor = trendUp ? T.success : trendDown ? T.danger : T.textMuted;
        const trendBg = trendUp ? T.successPale : trendDown ? T.dangerPale : "transparent";

        return (
          <div
            key={i}
            style={{
              position: "relative",
              padding: "1.1rem 1.25rem 1.1rem 1.5rem",
              background: T.bgCard,
              border: `1px solid ${stat.highlight ? T.accentGlow : T.border}`,
              borderRadius: 14,
              boxShadow: T.shadowCard,
              overflow: "hidden",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = T.shadowMd;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = T.shadowCard;
            }}
          >
            {/* Colored left border accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: 4,
                borderRadius: "14px 0 0 14px",
                background: stat.highlight
                  ? T.gradAccent
                  : `linear-gradient(180deg, ${T.border} 0%, ${T.borderLight} 100%)`,
              }}
            />

            {/* Top row: label + icon */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.55rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: T.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {stat.label}
              </span>
              {stat.icon && (
                <span
                  style={{
                    fontSize: "1rem",
                    color: stat.highlight ? T.accent : T.textMuted,
                    opacity: 0.75,
                    lineHeight: 1,
                  }}
                >
                  {stat.icon}
                </span>
              )}
            </div>

            {/* Large value */}
            <div
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
                fontWeight: 800,
                color: stat.highlight ? T.accent : T.textHeading,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                marginBottom: stat.sub ? "0.55rem" : 0,
              }}
            >
              {stat.value}
            </div>

            {/* Trend badge + sub label */}
            {stat.sub && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.15rem 0.45rem",
                  borderRadius: 999,
                  background: trendBg,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: trendColor,
                }}
              >
                {trendUp && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                )}
                {trendDown && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
                {stat.sub}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
