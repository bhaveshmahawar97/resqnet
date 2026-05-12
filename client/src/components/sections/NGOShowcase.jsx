import { useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import ngos from "../../data/ngos";
import Button from "../ui/Button";
import Label from "../ui/Label";

function NGOCard({ name, city, animals, type, i }) {
  const { T } = useT();
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={vFadeUp}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.bgCardHov : T.bgCard,
        border: `1px solid ${hov ? T.borderHov : T.border}`,
        borderRadius: 16,
        padding: "clamp(1.1rem, 2.5vw, 1.6rem)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov ? `0 20px 55px ${T.shadowHov}` : `0 2px 12px ${T.shadow}`,
        flex: "1 1 clamp(220px, 28vw, 320px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: T.accentPale,
            border: `1px solid ${T.accentGlow}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: T.accent,
            background: T.accentPale,
            padding: "0.2rem 0.55rem",
            borderRadius: 20,
          }}
        >
          {type}
        </span>
      </div>
      <h3 style={{ fontSize: "clamp(0.88rem, 2vw, 1rem)", fontWeight: 700, margin: "0 0 0.28rem", color: T.text }}>{name}</h3>
      <p style={{ fontSize: "0.78rem", color: T.textSub, margin: "0 0 1.1rem" }}>{city}</p>
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: T.text, letterSpacing: "-0.03em" }}>{animals}</div>
          <div style={{ fontSize: "0.68rem", color: T.textMuted }}>In care</div>
        </div>
        <motion.span animate={{ x: hov ? 5 : 0 }} style={{ display: "flex", alignItems: "center", gap: 3, color: T.accent, fontSize: "0.78rem", fontWeight: 600 }}>
          View{" "}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function NGOShowcase() {
  const { T } = useT();
  return (
    <section id="for-ngos" style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bg }}>
      <div style={{ width: "100%", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={vFadeUp}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1.25rem",
            marginBottom: "clamp(2rem, 5vw, 3rem)",
          }}
        >
          <div>
            <Label>NGO Network</Label>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: 0 }}>
              Trusted by organizations<br />
              across the country.
            </h2>
          </div>
          <Button variant="ghost" size="sm">
            View All Partners
          </Button>
        </motion.div>
        <div style={{ display: "flex", gap: "clamp(0.65rem, 1.5vw, 1rem)", flexWrap: "wrap" }}>
          {ngos.map((n, i) => (
            <NGOCard key={n.name} {...n} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

