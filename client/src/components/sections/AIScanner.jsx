import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { vFadeUp } from "../../animations/variants";
import Button from "../ui/Button";
import Label from "../ui/Label";
import heroIllustration from "../../assets/illustrations/hero-illustration.png";

export default function AIScanner() {
  const { T } = useT();
  const vp = useViewport();
  const features = [
    {
      title: "Instant Breed Recognition",
      desc: "Identify breed, age estimate, and health indicators from a single photo upload.",
    },
    {
      title: "Injury & Condition Assessment",
      desc: "AI flags visible wounds, malnutrition signs, and suggests field triage priority.",
    },
    {
      title: "Vaccination Record Matching",
      desc: "Cross-reference against national database for existing medical history.",
    },
    {
      title: "Behavior Pattern Analysis",
      desc: "Predict temperament for safer handling and optimal adoption matching.",
    },
  ];
  return (
    <section
      id="ai-health"
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 8vw, 7rem) 0",
        background: T.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle full-width accent stripe */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "3px",
          height: "100%",
          background: `linear-gradient(to bottom, transparent, ${T.accent}, transparent)`,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
          display: "grid",
          gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr" : "1fr 1fr",
          gap: "clamp(2.5rem, 6vw, 6rem)",
          alignItems: "center",
        }}
      >
        {/* Text column */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}>
          <Label>AI Health Scanner</Label>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              margin: "0 0 1rem",
              color: T.text,
            }}
          >
            Clinical-grade assessment.<br />
            In the field. Instantly.
          </h2>
          <p
            style={{
              color: T.textSub,
              lineHeight: 1.78,
              marginBottom: "2rem",
              fontSize: "clamp(0.88rem, 1.8vw, 1rem)",
            }}
          >
            ResQNet's AI scanner gives field rescuers veterinary-level analysis on their phone — no clinic
            required at the scene. Capture, analyze, and prepare care within seconds of arrival.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={vFadeUp}
                style={{ display: "flex", gap: "0.85rem" }}
              >
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent, marginTop: "0.52rem", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.text, marginBottom: "0.18rem" }}>{f.title}</div>
                  <div style={{ fontSize: "0.78rem", color: T.textSub, lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Link to="/scanner" style={{ display: "inline-block", textDecoration: "none" }}>
              <Button variant="primary">Try AI Scanner</Button>
            </Link>
          </div>
        </motion.div>

        {/* Scanner mockup */}
        <motion.div
          initial={{ opacity: 0, x: vp.mobile ? 0 : 40, y: vp.mobile ? 28 : 0 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ background: T.bgScanner, border: `1px solid ${T.border}`, borderRadius: 22, padding: "clamp(1rem, 2.5vw, 1.75rem)", boxShadow: `0 40px 100px ${T.shadowDeep}` }}>
            {/* Browser chrome */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
              {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
                <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
              ))}
              <div style={{ flex: 1, height: 26, borderRadius: 7, background: T.bgCard, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "0.65rem", color: T.textMuted }}>resqnet.ai/scan · Live Session</span>
              </div>
            </div>
            {/* Scan image */}
            <div style={{ borderRadius: 13, overflow: "hidden", position: "relative", marginBottom: "1rem" }}>
              <img src={heroIllustration} alt="AI scan demo" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: "76%", height: "76%", border: `2px solid ${T.accent}`, borderRadius: 8, boxShadow: `0 0 30px ${T.accentGlow}` }} />
                <motion.div animate={{ top: ["14%", "76%", "14%"] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", left: "12%", right: "12%", height: 2, background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)` }} />
              </div>
            </div>
            {/* Result rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { label: "Breed Match", val: "Labrador Retriever", conf: "97%", hi: false },
                { label: "Estimated Age", val: "2–3 years", conf: "91%", hi: false },
                { label: "Health Status", val: "Minor abrasion — left rear", conf: null, hi: true },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 0.9rem", borderRadius: 10, background: r.hi ? T.accentPale : T.bgCard, border: `1px solid ${r.hi ? T.accent + "28" : T.border}` }}>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: T.textMuted, marginBottom: "0.1rem" }}>{r.label}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: r.hi ? T.accent : T.text }}>{r.val}</div>
                  </div>
                  {r.conf && <span style={{ fontSize: "0.74rem", fontWeight: 800, color: T.accent }}>{r.conf}</span>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

