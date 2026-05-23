import { motion, useReducedMotion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Button from "../ui/Button";

const STEPS = [
  { n: "01", title: "Express interest", desc: "Submit a quick form — takes 2 minutes. No fees, ever." },
  { n: "02", title: "NGO review", desc: "The rescue NGO reviews your profile within 24–48 hours." },
  { n: "03", title: "Meet & greet", desc: "Schedule a visit to meet your potential companion." },
  { n: "04", title: "Welcome home", desc: "Sign the agreement. Post-adoption support for 6 months." },
];

export default function AdoptionCTA() {
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
        width: "100%",
        padding: "clamp(4rem, 10vw, 7rem) 0",
        background: T.bgAlt,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle accent glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 40% at 50% 80%, ${T.accentPale} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 5vw, 3.5rem)",
        }}
      >
        {/* Header */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.25rem 0.75rem",
              borderRadius: 9999,
              border: `1px solid ${T.border}`,
              background: T.bgCard,
              marginBottom: "1.25rem",
              fontSize: "0.65rem",
              fontWeight: 600,
              color: T.textSub,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            How It Works
          </div>

          <h2
            style={{
              fontSize: "clamp(1.6rem, 4.5vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: T.textHeading,
              margin: "0 0 0.75rem",
              lineHeight: 1.12,
            }}
          >
            Give a rescued animal{" "}
            <span style={{ color: T.accent }}>their second chance.</span>
          </h2>

          <p
            style={{
              fontSize: "clamp(0.88rem, 2vw, 1rem)",
              color: T.textSub,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            The adoption journey is simple, free, and fully supported — from first interest to a happy forever home.
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          style={{
            display: "grid",
            gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: "clamp(0.75rem, 2vw, 1rem)",
            marginBottom: "clamp(2.5rem, 5vw, 3.5rem)",
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: "clamp(1rem, 2.5vw, 1.5rem)",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: T.accentPale,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.75rem",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: T.accent,
                }}
              >
                {s.n}
              </div>
              <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: T.text, margin: "0 0 0.35rem" }}>{s.title}</h3>
              <p style={{ fontSize: "0.76rem", color: T.textSub, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="primary" size="lg">Browse All Animals</Button>
          <Button variant="ghost" size="lg">Partner as an NGO</Button>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.68rem", color: T.textMuted }}>
          No fees for adopters · 0 NGO partners · AI-matched for your lifestyle
        </div>
      </div>
    </section>
  );
}
