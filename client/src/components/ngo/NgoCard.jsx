import { useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import Btn from "../ui/Button";

const TYPE_COLORS = {
  Rescue: { bg: "rgba(234, 88, 12, 0.15)", text: "#EA580C" },
  Shelter: { bg: "rgba(37, 99, 235, 0.15)", text: "#2563EB" },
  Medical: { bg: "rgba(22, 163, 74, 0.15)", text: "#16A34A" },
  Wildlife: { bg: "rgba(217, 119, 6, 0.15)", text: "#D97706" },
  Adoption: { bg: "rgba(147, 51, 234, 0.15)", text: "#9333EA" },
  Sanctuary: { bg: "rgba(13, 148, 136, 0.15)", text: "#0D9488" },
};

export default function NgoCard({ ngo, i }) {
  const { T } = useT();
  const [hov, setHov] = useState(false);
  const type = (ngo.specialties || ["Partner"])[0];
  const focus = (ngo.specialties || []).slice(0, 3).join(", ") || "Rescue support";
  const tc = TYPE_COLORS[type] || TYPE_COLORS.Rescue;

  // Ensure organizationName/name are supported
  const name = ngo.organizationName || ngo.name || "Unknown NGO";
  const city = ngo.city || ngo.location || "India";

  return (
    <motion.div
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={vFadeUp}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.bgCardHov : T.bgCard,
        border: `1px solid ${hov ? T.borderHov : T.border}`,
        borderRadius: 14,
        padding: "clamp(1.1rem, 2.5vw, 1.6rem)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? T.shadowHov : T.shadow,
        flex: "1 1 clamp(280px, 30vw, 380px)",
        display: "flex", flexDirection: "column", gap: "1rem",
      }}>

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: T.accentPale, border: `1px solid ${T.accentGlow}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: "clamp(0.86rem, 1.8vw, 0.98rem)", fontWeight: 700, margin: 0, color: T.text, lineHeight: 1.3 }}>{name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: "0.18rem" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span style={{ fontSize: "0.72rem", color: T.textSub }}>{city}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
          <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: tc.text, background: tc.bg, padding: "0.18rem 0.55rem", borderRadius: 20 }}>{type}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: ngo.verified ? T.accent : "#F59E0B" }} />
            <span style={{ fontSize: "0.65rem", color: ngo.verified ? T.accent : "#D97706", fontWeight: 600 }}>{ngo.verified ? "Verified" : "Unverified"}</span>
          </div>
        </div>
      </div>

      {/* Focus tag */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {focus && (
          <span style={{ fontSize: "0.66rem", color: T.textSub, background: T.bgAlt, border: `1px solid ${T.border}`, padding: "0.18rem 0.6rem", borderRadius: 20 }}>{focus}</span>
        )}
        {(ngo.distance || ngo.responseTime) && (
          <span style={{ fontSize: "0.66rem", color: T.textSub, background: T.bgAlt, border: `1px solid ${T.border}`, padding: "0.18rem 0.6rem", borderRadius: 20 }}>
            {ngo.distance ? `${ngo.distance} away` : ngo.responseTime}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", borderTop: `1px solid ${T.border}`, paddingTop: "0.9rem" }}>
        {[
          { val: ngo.responseTime || "~20 min", sub: "Response" },
          { val: ngo.missionsCompleted?.toLocaleString?.() ?? 0, sub: "Missions" },
          { val: `${ngo.rating ?? 4.8}★`, sub: "Rating" },
        ].map(({ val, sub }) => (
          <div key={sub} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "clamp(1rem, 2.2vw, 1.2rem)", fontWeight: 800, color: T.text, letterSpacing: "-0.03em" }}>{val}</div>
            <div style={{ fontSize: "0.62rem", color: T.textMuted, marginTop: 1 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", marginTop: "auto" }}>
        <Btn variant="primary" size="sm" style={{ flex: 1 }}>Contact NGO</Btn>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
