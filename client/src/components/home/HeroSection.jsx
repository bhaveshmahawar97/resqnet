import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { vFade } from "../../animations/variants";
import Button from "../ui/Button";
import BackgroundOrbs from "../ui/BackgroundOrbs";
import heroIllustration from "../../assets/illustrations/hero-illustration.png";

const TRUST_STATS = [
  ["48,200+", "Animals Rescued"],
  ["312", "NGO Partners"],
  ["94%", "Recovery Rate"],
];

const BADGES = [
  { label: "AI-Powered Diagnostics", dot: true },
  { label: "Live Rescue Network", dot: true },
  { label: "300+ NGOs Nationwide", dot: true },
];

export default function HeroSection() {
  const { T } = useT();
  const vp = useViewport();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : vp.mobile ? 30 : 90]);
  const heroOp = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    <section
      id="mission"
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
      {/* Background photograph */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src={heroIllustration}
          alt=""
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 35%",
            opacity: T.heroImg,
            filter: "grayscale(20%) contrast(1.1)",
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

      {/* Vertical accent line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          left: "clamp(1.5rem, 5vw, 4rem)",
          top: "20%",
          bottom: "20%",
          width: 2,
          background: `linear-gradient(to bottom, transparent, ${T.accent}, transparent)`,
          zIndex: 1,
          transformOrigin: "top",
          display: vp.mobile ? "none" : "block",
        }}
      />

      {/* Main content */}
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
        {/* Feature badges */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={vFade}
          style={{
            display: "flex",
            gap: "0.45rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          {BADGES.map((b, i) => (
            <motion.span
              key={b.label}
              custom={i}
              variants={vFade}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.32rem 0.9rem",
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
              {b.dot && (
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: T.accent,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
              )}
              {b.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Main headline */}
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
          Rescue Smarter.{" "}
          <span
            style={{
              background: `linear-gradient(100deg, ${T.accent} 0%, ${T.accentDim} 55%, ${T.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Heal Faster.
          </span>
          <br style={{ display: vp.mobile ? "none" : "block" }} />
          {" "}Save More Lives.
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
            maxWidth: 620,
            lineHeight: 1.75,
          }}
        >
          Connecting animal rescuers, veterinary clinics, and NGOs through an AI-powered
          platform — faster response, smarter care, nationwide adoption.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link to="/rescue">
            <Button variant="primary" size="lg">
              Report a Rescue
            </Button>
          </Link>
          <Link to="/scanner">
            <Button variant="ghost" size="lg">
              Try AI Scanner
            </Button>
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{
            marginTop: "clamp(2.5rem, 6vh, 4.5rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            flexWrap: "wrap",
          }}
        >
          {TRUST_STATS.map(([v, l], i) => (
            <div key={l} style={{ textAlign: "center" }}>
              {i > 0 && !vp.mobile && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "15%",
                    height: "70%",
                    width: 1,
                    background: T.border,
                  }}
                />
              )}
              <div
                style={{
                  fontSize: "clamp(1.2rem, 3vw, 1.65rem)",
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: "-0.03em",
                }}
              >
                {v}
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  color: T.textMuted,
                  marginTop: 3,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {l}
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
              style={{
                width: 1,
                height: 34,
                background: `linear-gradient(to bottom, ${T.textMuted}, transparent)`,
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
