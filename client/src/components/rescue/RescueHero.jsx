import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Button from "../ui/Button";
import BackgroundOrbs from "../ui/BackgroundOrbs";
import { vFade } from "../../animations/variants";

const URGENCY_STATS = [
  { value: "47", label: "Active Rescues", live: true },
  { value: "8min", label: "Avg Response Time" },
  { value: "312", label: "NGO Partners Online" },
];

export default function RescueHero({ onRequestRescue, onAIScan }) {
  const { T } = useT();
  const vp = useViewport();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : vp.mobile ? 30 : 90]);
  const heroOp = useTransform(scrollY, [0, 420], [1, 0]);

  const badges = ["AI-Powered Dispatch", "24/7 Emergency Response", "300+ NGOs Ready"];

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
      {/* Emergency red overlay tint */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 40%, rgba(220,38,38,0.06) 0%, transparent 70%)`,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* BG image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2000&q=70"
          alt=""
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 40%",
            opacity: T.heroImg,
            filter: "grayscale(10%) contrast(1.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, ${T.bg} 100%)`,
          }}
        />
      </div>

      <BackgroundOrbs />

      <motion.div
        style={{
          y: parallaxY,
          opacity: heroOp,
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          textAlign: "center",
          padding: `clamp(5rem, 12vh, 8rem) clamp(1.25rem, 5vw, 6rem) clamp(3rem, 8vh, 5rem)`,
        }}
      >
        {/* LIVE badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 1rem",
              borderRadius: 30,
              background: "rgba(220,38,38,0.12)",
              border: "1px solid rgba(220,38,38,0.3)",
              backdropFilter: "blur(14px)",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#EF4444",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#EF4444", letterSpacing: "0.12em" }}>
              EMERGENCY SYSTEM LIVE
            </span>
          </div>
        </motion.div>

        {/* Status badges */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={vFade}
          style={{
            display: "flex",
            gap: "0.45rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "1.75rem",
          }}
        >
          {badges.map((b, i) => (
            <motion.span
              key={b}
              custom={i}
              variants={vFade}
              style={{
                padding: "0.3rem 0.85rem",
                borderRadius: 30,
                border: `1px solid ${T.border}`,
                background: T.bgGlass,
                backdropFilter: "blur(14px)",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: T.textSub,
                letterSpacing: "0.04em",
              }}
            >
              {b}
            </motion.span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 55 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(2.6rem, 9vw, 7rem)",
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: "-0.045em",
            margin: "0 0 1.25rem",
            color: T.text,
          }}
        >
          Every Second{" "}
          <span
            style={{
              background: "linear-gradient(100deg, #EF4444 0%, #DC2626 55%, #EF4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Counts.
          </span>
          <br style={{ display: vp.mobile ? "none" : "block" }} />
          AI-Powered{" "}
          <span
            style={{
              background: `linear-gradient(100deg, ${T.accent} 0%, ${T.accentDim} 55%, ${T.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Rescue.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          style={{
            fontSize: "clamp(0.95rem, 2.2vw, 1.2rem)",
            color: T.textSub,
            margin: "0 auto 2.5rem",
            lineHeight: 1.75,
            maxWidth: 640,
          }}
        >
          Report an animal emergency in seconds. Our AI dispatches the nearest NGO,
          analyzes injury severity, and coordinates rescue teams — all in real time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            onClick={onRequestRescue}
            whileHover={{ scale: 1.04, boxShadow: "0 0 32px rgba(239,68,68,0.4)" }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: "0.9rem 2.2rem",
              borderRadius: 10,
              fontFamily: "inherit",
              fontSize: "0.97rem",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              letterSpacing: "-0.01em",
              background: "linear-gradient(135deg, #EF4444, #DC2626)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            🚨 Request Rescue
          </motion.button>
          <Button variant="ghost" size="lg" onClick={onAIScan}>
            🤖 AI Emergency Scan
          </Button>
        </motion.div>

        {/* Live stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            marginTop: "clamp(2.5rem, 6vh, 4.5rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            flexWrap: "wrap",
          }}
        >
          {URGENCY_STATS.map(({ value, label, live }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "clamp(1.2rem, 3vw, 1.65rem)",
                  fontWeight: 800,
                  color: live ? "#EF4444" : T.text,
                  letterSpacing: "-0.03em",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  justifyContent: "center",
                }}
              >
                {live && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", flexShrink: 0 }}
                  />
                )}
                {value}
              </div>
              <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 2, letterSpacing: "0.04em" }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        {!vp.mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
            }}
          >
            <motion.div
              animate={reduce ? {} : { y: [0, 7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: 1, height: 34, background: `linear-gradient(to bottom, ${T.textMuted}, transparent)` }}
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
