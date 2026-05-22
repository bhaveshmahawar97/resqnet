import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import Orbs from "../ui/BackgroundOrbs";
import Label from "../ui/Label";
import { TESTIMONIALS } from "../../data/ngos";

export default function NGOTestimonials() {
  const { T } = useT();

  return (
    <section style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bgAlt, position: "relative", overflow: "hidden" }}>
      <Orbs />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>Partner Voices</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: 0 }}>
            Trusted by those<br />on the front lines.
          </h2>
        </motion.div>

        <div style={{ display: "flex", gap: "clamp(0.75rem, 2vw, 1.25rem)", flexWrap: "wrap", justifyContent: "center" }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
              style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18,
                padding: "clamp(1.3rem, 2.5vw, 1.8rem)", flex: "1 1 clamp(260px, 28vw, 360px)",
                boxShadow: `0 2px 18px ${T.shadow}`, position: "relative" }}>
              {/* Quote mark */}
              <div style={{ position: "absolute", top: "1rem", right: "1.2rem", fontSize: "3rem", fontWeight: 900, color: T.accentPale, lineHeight: 1 }}>"</div>
              <div style={{ display: "flex", gap: 3, marginBottom: "1rem" }}>
                {[...Array(5)].map((_, k) => <div key={k} style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }} />)}
              </div>
              <p style={{ fontSize: "0.88rem", color: T.textSub, lineHeight: 1.78, margin: "0 0 1.25rem", fontStyle: "italic" }}>"{t.quote}"</p>
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.86rem", fontWeight: 700, color: T.text }}>{t.name}</div>
                  <div style={{ fontSize: "0.72rem", color: T.textMuted }}>{t.role}</div>
                </div>
                <span style={{ fontSize: "0.65rem", color: T.accent, background: T.accentPale, padding: "0.18rem 0.55rem", borderRadius: 20, fontWeight: 600 }}>{t.city}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
