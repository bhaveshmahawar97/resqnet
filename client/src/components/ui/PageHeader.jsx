import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";

/**
 * PageHeader — compact toolbar-style page header for operational pages.
 *
 * Design matches RescueHero's single-row pattern:
 *   [Badge] [Title + Subtitle] [Stats] ... [Actions]
 *
 * Props:
 *   title       — page heading (string)
 *   subtitle    — short description (string)
 *   badge       — { label, color } — small pill left of title
 *   stats       — [{ value, label }] — inline stat chips
 *   actions     — React node rendered on the right side
 */
export default function PageHeader({ title, subtitle, badge, stats = [], actions }) {
  const { T } = useT();
  const vp = useViewport();

  const navHeight = vp.mobile ? 56 : 64;

  return (
    <section
      style={{
        width: "100%",
        paddingTop: navHeight,
        background: T.bgAlt || T.bg,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: vp.mobile ? "0.85rem 1rem" : "0.95rem clamp(1.25rem, 3vw, 2.5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT: badge + identity + stats */}
        <div style={{ display: "flex", alignItems: "center", gap: vp.mobile ? "0.75rem" : "1.25rem", flexWrap: "wrap", minWidth: 0 }}>
          {/* Badge pill */}
          {badge && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.25rem 0.65rem",
                borderRadius: 9999,
                border: `1px solid ${badge.color || T.accent}33`,
                background: `${badge.color || T.accent}10`,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: badge.color || T.accent,
                }}
              />
              <span
                style={{
                  fontSize: "0.66rem",
                  fontWeight: 700,
                  color: badge.color || T.accent,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {badge.label}
              </span>
            </div>
          )}

          {/* Title + subtitle */}
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <h1
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: T.text,
                margin: 0,
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontSize: "0.74rem",
                  color: T.textMuted,
                  margin: 0,
                  lineHeight: 1.35,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Inline stats — desktop only */}
          {!vp.mobile && stats.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                paddingLeft: "0.75rem",
                borderLeft: `1px solid ${T.border}`,
              }}
            >
              {stats.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>{s.value}</span>
                  <span style={{ fontSize: "0.68rem", color: T.textMuted }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: actions */}
        {actions && <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>{actions}</div>}

        {/* Mobile stats row */}
        {vp.mobile && stats.length > 0 && (
          <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: "0.75rem", paddingTop: "0.25rem" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>{s.value}</span>
                <span style={{ fontSize: "0.65rem", color: T.textMuted }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
