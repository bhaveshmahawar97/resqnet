import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Button from "../ui/Button";
import { usePlatformStats, formatStat } from "../../hooks/usePlatformStats";

export default function RescueHero({ onRequestRescue, onAIScan }) {
  const { T } = useT();
  const vp = useViewport();
  const reduce = useReducedMotion();
  const { stats } = usePlatformStats();

  const TRUST_STATS = [
    { value: formatStat(stats.totalRescues), label: "Animals Rescued" },
    { value: formatStat(stats.totalNgos), label: "Partner NGOs" },
    { value: formatStat(stats.recoveryRate, true), label: "Recovery Rate" },
  ];

  const fadeUp = {
    initial: reduce ? {} : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: T.gradHero,
      }}
    >
      {/* Subtle radial accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 50% at 50% 38%, rgba(220,38,38,0.04) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: `clamp(6rem, 16vh, 10rem) clamp(1.25rem, 5vw, 5rem) clamp(4rem, 10vh, 6rem)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Eyebrow badge */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.3rem 0.85rem",
            borderRadius: 9999,
            border: "1px solid rgba(220,38,38,0.25)",
            background: "rgba(220,38,38,0.06)",
            marginBottom: "1.75rem",
          }}
        >
          <motion.span
            animate={reduce ? {} : { opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#EF4444", flexShrink: 0,
            }}
          />
          <span style={{
            fontSize: "0.6875rem", fontWeight: 600, color: T.danger,
            letterSpacing: "0.04em",
          }}>
            Emergency System Live
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(2.2rem, 7vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
            color: T.textHeading,
            margin: "0 0 1.25rem",
            maxWidth: "16ch",
          }}
        >
          Every Second{" "}
          <span style={{ color: T.danger }}>Counts.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            color: T.textSub,
            margin: "0 auto 2.5rem",
            maxWidth: 520,
            lineHeight: 1.7,
            fontWeight: 400,
          }}
        >
          Report an animal emergency in seconds. Our AI analyzes injury severity, dispatches the nearest NGO, and coordinates rescue teams in real time.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            display: "flex",
            gap: "0.65rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "clamp(3rem, 7vh, 5rem)",
          }}
        >
          <Button variant="primary" size="lg" onClick={onRequestRescue}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Report a Rescue
          </Button>
          <Button variant="ghost" size="lg" onClick={onAIScan}>
            AI Emergency Scan
          </Button>
        </motion.div>

        {/* Trust stats */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: vp.mobile ? "1.25rem" : "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {TRUST_STATS.map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              {i > 0 && !vp.mobile && (
                <div style={{ width: 1, height: 28, background: T.border, opacity: 0.7 }} />
              )}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                    fontWeight: 800,
                    color: s.accent ? "#EF4444" : T.textHeading,
                    letterSpacing: "-0.035em",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: T.textMuted,
                    marginTop: "0.3rem",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
