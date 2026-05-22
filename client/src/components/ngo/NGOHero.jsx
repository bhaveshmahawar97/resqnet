import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { vFade } from "../../animations/variants";
import Btn from "../ui/Button";
import Orbs from "../ui/BackgroundOrbs";

export default function NGOHero() {
  const { T } = useT();
  const vp = useViewport();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : vp.mobile ? 30 : 90]);
  const heroOp = useTransform(scrollY, [0, 420], [1, 0]);
  const badges = ["312 Active NGOs", "18 States", "Verified Partners"];

  return (
    <section style={{ position: "relative", width: "100%", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", background: T.gradHero }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=2000&q=75"
          alt=""
          aria-hidden
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", opacity: T.heroImg, filter: "grayscale(20%) contrast(1.1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, ${T.bg} 100%)` }} />
      </div>

      <Orbs />

      <motion.div style={{ y: parallaxY, opacity: heroOp, position: "relative", zIndex: 1, width: "100%", maxWidth: "1240px", margin: "0 auto", textAlign: "center", padding: `clamp(5rem, 12vh, 8rem) clamp(1.25rem, 5vw, 6rem) clamp(3rem, 8vh, 5rem)` }}>
        <motion.div initial="hidden" animate="show" variants={vFade} style={{ display: "flex", gap: "0.45rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          {badges.map((b, i) => (
            <motion.span key={b} custom={i} variants={vFade}
              style={{ padding: "0.3rem 0.85rem", borderRadius: 30, border: `1px solid ${T.border}`, background: T.bgGlass, backdropFilter: "blur(14px)", fontSize: "0.7rem", fontWeight: 600, color: T.textSub, letterSpacing: "0.04em" }}>
              {b}
            </motion.span>
          ))}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: "clamp(2.6rem, 9vw, 7rem)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.045em", margin: "0 0 1.25rem", color: T.text }}>
          The Network Behind{" "}
          <br />
          <span style={{ background: `linear-gradient(100deg, ${T.accent} 0%, ${T.accentDim} 55%, ${T.accent} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Every Rescue.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.2rem)", color: T.textSub, margin: "0 auto 2.5rem", lineHeight: 1.75 }}>
          Discover, connect with, and support the NGOs that form the backbone of animal rescue across India — all verified, all on ResQNet.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}
          style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Btn variant="primary" size="lg">Register Your NGO</Btn>
          <Btn variant="ghost" size="lg">Browse All Partners</Btn>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ marginTop: "clamp(2.5rem, 6vh, 4.5rem)", display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(1.5rem, 4vw, 3rem)", flexWrap: "wrap" }}>
          {[["312", "Verified NGOs"], ["18", "States Covered"], ["94%", "Response Rate"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(1.2rem, 3vw, 1.65rem)", fontWeight: 800, color: T.text, letterSpacing: "-0.03em" }}>{v}</div>
              <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 2, letterSpacing: "0.04em" }}>{l}</div>
            </div>
          ))}
        </motion.div>

        {!vp.mobile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <motion.div animate={reduce ? {} : { y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: 1, height: 34, background: `linear-gradient(to bottom, ${T.textMuted}, transparent)` }} />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
