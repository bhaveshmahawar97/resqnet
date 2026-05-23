import { motion, useReducedMotion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Button from "../ui/Button";

const TRUST_STATS = [
  { value: "CV v4", label: "Vision Model" },
  { value: "<5s", label: "Analysis Time" },
  { value: "0", label: "NGOs Linked" },
  { value: "94%", label: "Accuracy" },
];

export default function ScannerHero({ onStartScan }) {
  const { T } = useT();
  const vp = useViewport();
  const reduce = useReducedMotion();

  const fadeUp = {
    initial: reduce ? {} : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
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
          background: `radial-gradient(ellipse 70% 50% at 50% 38%, ${T.accentPale} 0%, transparent 65%)`,
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
          padding: `clamp(4rem, 10vh, 6rem) clamp(1.25rem, 5vw, 5rem) clamp(3rem, 6vh, 4rem)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
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
            border: `1px solid ${T.border}`,
            background: T.bgCard,
            marginBottom: "1.25rem",
            boxShadow: T.shadowSm,
          }}
        >
          <span
            style={{
              width: 5, height: 5, borderRadius: "50%",
              background: T.success || "#059669", flexShrink: 0,
            }}
          />
          <span style={{
            fontSize: "0.6875rem", fontWeight: 600, color: T.textSub,
            letterSpacing: "0.04em",
          }}>
            AI Diagnostic Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            color: T.textHeading,
            margin: "0 0 1rem",
            maxWidth: 640,
          }}
        >
          See What the Animal{" "}
          <span style={{ color: T.accent }}>Can't Tell You.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
            color: T.textSub,
            margin: "0 0 2rem",
            maxWidth: 520,
            lineHeight: 1.7,
            fontWeight: 400,
          }}
        >
          Upload a photo. Our neural vision model detects species, breed, injuries, and urgency — then coordinates the nearest rescue team.
        </motion.p>

        {/* CTA + stats row */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button variant="primary" size="lg" onClick={onStartScan}>Start AI Scan</Button>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {TRUST_STATS.map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {i > 0 && (
                  <div style={{ width: 1, height: 20, background: T.border, opacity: 0.5 }} />
                )}
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, color: T.textHeading, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.58rem", color: T.textMuted, marginTop: 2, fontWeight: 500, letterSpacing: "0.03em", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
