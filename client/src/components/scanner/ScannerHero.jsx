import { motion, useReducedMotion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Label from "../ui/Label";
import Button from "../ui/Button";
import BackgroundOrbs from "../ui/BackgroundOrbs";
import { vFadeUp, vFade } from "../../animations/variants";

const SYSTEM_BADGES = [ { icon: "🧬", label: "Computer Vision v4" }, { icon: "📡", label: "Live NGO Network" }, { icon: "⚡", label: "Sub-5s Analysis" } ];

export default function ScannerHero({ onStartScan }) {
  const { T } = useT();
  const vp = useViewport();
  const reduce = useReducedMotion();

  return (
    <section style={{ position: "relative", width: "100%", minHeight: vp.mobile ? "80svh" : "92svh", display: "flex", alignItems: "center", overflow: "hidden", background: T.gradHero, paddingTop: vp.mobile ? 58 : 68 }}>
      <BackgroundOrbs />
      {!reduce && (<motion.div animate={{ top: ["0%","100%","0%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 0%, ${T.accent}55 30%, ${T.accent}88 50%, ${T.accent}55 70%, transparent 100%)`, pointerEvents: "none", zIndex: 1 }} />)}
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1240, margin: "0 auto", padding: `clamp(3rem,10vh,6rem) clamp(1.25rem,5vw,6rem)` }}>
        <motion.div initial="hidden" animate="show" variants={vFade}><Label>AI Diagnostic Intelligence Terminal</Label></motion.div>
        <motion.h1 initial="hidden" animate="show" variants={vFadeUp} custom={1} style={{ fontSize: "clamp(2.4rem, 5vw, 5rem)", fontWeight: 900, letterSpacing: "-0.04em", color: T.text, margin: "0 0 1.25rem", lineHeight: 1.04, maxWidth: 740 }}>See What the Animal <span style={{ background: `linear-gradient(100deg, ${T.accent} 0%, ${T.accentDim} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Can't Tell You</span></motion.h1>
        <motion.p initial="hidden" animate="show" variants={vFadeUp} custom={2} style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: T.textSub, maxWidth: 520, lineHeight: 1.75, marginBottom: "2rem" }}>Upload a photo. Our neural vision model detects species, breed, injuries, and urgency — then coordinates the nearest rescue team automatically.</motion.p>

        <motion.div initial="hidden" animate="show" variants={vFade} custom={3} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>{SYSTEM_BADGES.map((b) => (<span key={b.label} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.3rem 0.8rem", borderRadius: 30, border: `1px solid ${T.border}`, background: T.bgGlass, backdropFilter: "blur(14px)", fontSize: "0.72rem", fontWeight: 600, color: T.textSub, letterSpacing: "0.03em" }}><span>{b.icon}</span>{b.label}</span>))}</motion.div>

        <motion.div initial="hidden" animate="show" variants={vFadeUp} custom={4} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Button variant="primary" size="lg" onClick={onStartScan}>🔬 Start AI Scan</Button>
        </motion.div>
      </div>
    </section>
  );
}
