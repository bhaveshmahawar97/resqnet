import { motion, useReducedMotion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { usePlatformStats, formatStat } from "../../hooks/usePlatformStats";

export default function RescueHero({ onAIScan }) {
  const { T } = useT();
  const vp = useViewport();
  const reduce = useReducedMotion();
  const { stats } = usePlatformStats();

  const STATS = [
    { value: formatStat(stats.totalRescues), label: "rescues" },
    { value: formatStat(stats.totalNgos), label: "NGOs on standby" },
    { value: `${stats.avgResponseMinutes || 0}m`, label: "avg response" },
    { value: formatStat(stats.recoveryRate, true), label: "recovery rate" },
  ];

  return (
    <section
      style={{
        width: "100%",
        background: T.bgAlt || T.bg,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1120,
          margin: "0 auto",
          padding: vp.mobile ? "0.85rem 1rem" : "0.95rem clamp(1.25rem, 3vw, 2.5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT: live indicator + identity + stats */}
        <div style={{ display: "flex", alignItems: "center", gap: vp.mobile ? "0.75rem" : "1.25rem", flexWrap: "wrap", minWidth: 0 }}>
          {/* Live pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.25rem 0.65rem",
              borderRadius: 9999,
              border: `1px solid ${T.danger}33`,
              background: `${T.danger}10`,
              flexShrink: 0,
            }}
          >
            <motion.span
              animate={reduce ? {} : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: T.danger }}
            />
            <span style={{ fontSize: "0.66rem", fontWeight: 700, color: T.danger, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Live
            </span>
          </div>

          {/* Identity + tagline */}
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <h1 style={{ fontSize: "1rem", fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.015em", lineHeight: 1.2 }}>
              Animal Rescue Intake
            </h1>
            <p style={{ fontSize: "0.74rem", color: T.textMuted, margin: 0, lineHeight: 1.35 }}>
              AI dispatches to the nearest NGO in seconds.
            </p>
          </div>

          {/* Inline stats — desktop only (mobile shows below) */}
          {!vp.mobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "0.75rem", borderLeft: `1px solid ${T.border}` }}>
              {STATS.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>{s.value}</span>
                  <span style={{ fontSize: "0.68rem", color: T.textMuted }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: secondary action */}
        <button
          type="button"
          onClick={onAIScan}
          style={{
            padding: "0.5rem 0.85rem",
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.bgCard,
            color: T.text,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.78rem",
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          AI Health Scan
        </button>

        {/* Mobile stats row */}
        {vp.mobile && (
          <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: "0.75rem", paddingTop: "0.25rem" }}>
            {STATS.map((s) => (
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
