import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { vFadeUp } from "../../animations/variants";
import Label from "../ui/Label";

export default function NGOOnboarding() {
  const { T } = useT();
  const vp = useViewport();
  const steps = [
    { n: "01", title: "Submit your NGO", desc: "Fill in your organization's details, operational area, specialization, and current capacity. Takes under 10 minutes." },
    { n: "02", title: "Verification Review", desc: "Our team verifies your registration documents, rescue history, and references within 48 hours." },
    { n: "03", title: "Join the Network", desc: "Get your dashboard, connect with nearby NGOs and clinics, and start receiving automated rescue alerts in your zone." },
    { n: "04", title: "Grow Together", desc: "Access AI tools, adoption listings, donor connections, and community funding rounds exclusive to ResQNet partners." },
  ];

  return (
    <section style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "3px", height: "100%", background: `linear-gradient(to bottom, transparent, ${T.accent}, transparent)` }} />

      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>NGO Onboarding</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: 0 }}>
            Join the network in<br />four simple steps.
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr 1fr" : "repeat(4, 1fr)", gap: "clamp(0.75rem, 2vw, 1.25rem)" }}>
          {steps.map((s, i) => (
            <motion.div key={s.n} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
              style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: "clamp(1.2rem, 2.5vw, 1.75rem)", position: "relative", overflow: "hidden", boxShadow: `0 2px 14px ${T.shadow}` }}>
              {/* Number watermark */}
              <div style={{ position: "absolute", top: "-0.5rem", right: "0.75rem", fontSize: "3.5rem", fontWeight: 900, color: T.accentPale, letterSpacing: "-0.06em", lineHeight: 1, userSelect: "none" }}>{s.n}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.accentPale, border: `1px solid ${T.accentGlow}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 900, color: T.accent }}>{s.n}</span>
              </div>
              <h3 style={{ fontSize: "clamp(0.9rem, 1.8vw, 1rem)", fontWeight: 700, color: T.text, margin: "0 0 0.5rem" }}>{s.title}</h3>
              <p style={{ fontSize: "0.78rem", color: T.textSub, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
