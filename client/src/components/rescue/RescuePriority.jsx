import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Label from "../ui/Label";
import { vFadeUp } from "../../animations/variants";

const PRIORITIES = [
  {
    level: "Critical",
    code: "critical",
    emoji: "🔴",
    color: T.danger,
    bgLight: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.3)",
    desc: "Life-threatening condition requiring immediate intervention within minutes.",
    criteria: ["Unconscious or unresponsive", "Severe bleeding", "Suspected internal injuries", "Unable to breathe normally"],
    responseTime: "< 5 min",
    dispatchType: "Emergency Vet Team",
  },
  {
    level: "High",
    code: "high",
    emoji: "🟠",
    color: "#F97316",
    bgLight: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.3)",
    desc: "Serious injury or illness requiring urgent care within 30 minutes.",
    criteria: ["Deep wounds or lacerations", "Limb fractures", "Eye trauma", "Moderate dehydration"],
    responseTime: "< 30 min",
    dispatchType: "Field Rescue Team",
  },
  {
    level: "Moderate",
    code: "moderate",
    emoji: "🟡",
    color: "#EAB308",
    bgLight: "rgba(234,179,8,0.08)",
    border: "rgba(234,179,8,0.3)",
    desc: "Animal needs care but is currently stable. Response within 2 hours.",
    criteria: ["Minor injuries", "Mild lethargy", "Stray without injury", "Young/abandoned animal"],
    responseTime: "< 2 hours",
    dispatchType: "Volunteer Responder",
  },
  {
    level: "Stable",
    code: "stable",
    emoji: "🟢",
    color: "#22C55E",
    bgLight: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.3)",
    desc: "Animal is not in immediate danger. Can be scheduled for pickup.",
    criteria: ["No apparent injuries", "Needs shelter/rehoming", "Post-care monitoring", "Routine nutrition support"],
    responseTime: "< 24 hours",
    dispatchType: "NGO Coordinator",
  },
];

export default function RescuePriority() {
  const { T } = useT();
  const vp = useViewport();
  const [active, setActive] = useState("high");

  const selected = PRIORITIES.find((p) => p.code === active);

  return (
    <section style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bgAlt, position: "relative", overflow: "hidden" }}>


      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)", position: "relative", zIndex: 1 }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp} style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>Triage System</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: "0 0 0.75rem" }}>
            Rescue Priority Dashboard
          </h2>
          <p style={{ color: T.textSub, fontSize: "clamp(0.88rem, 2vw, 1rem)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Our AI triage engine automatically classifies rescue urgency. Select a level to understand criteria and response protocols.
          </p>
        </motion.div>

        {/* Priority selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}
        >
          {PRIORITIES.map((p) => (
            <motion.button
              key={p.code}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActive(p.code)}
              style={{
                padding: "0.65rem 1.4rem",
                borderRadius: 30,
                border: `1.5px solid ${active === p.code ? p.color : T.border}`,
                background: active === p.code ? p.bgLight : T.bgCard,
                color: active === p.code ? p.color : T.textSub,
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                boxShadow: "none",
              }}
            >
              {p.emoji} {p.level}
            </motion.button>
          ))}
        </motion.div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.code}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              style={{
                background: T.bgCard,
                borderRadius: 14,
                border: `1px solid ${selected.border}`,
                padding: "clamp(1.5rem, 4vw, 2.5rem)",
                boxShadow: T.shadow,
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "2fr 1fr", gap: "2rem", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "2.2rem" }}>{selected.emoji}</span>
                    <div>
                      <div style={{ fontSize: "1.4rem", fontWeight: 900, color: selected.color, letterSpacing: "-0.03em" }}>
                        {selected.level} Priority
                      </div>
                      <div style={{ fontSize: "0.78rem", color: T.textMuted }}>Triage classification</div>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.92rem", color: T.textSub, lineHeight: 1.75, marginBottom: "1.25rem" }}>{selected.desc}</p>

                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", marginBottom: "0.6rem" }}>QUALIFYING CONDITIONS</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {selected.criteria.map((c, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07 }}
                          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                        >
                          <span style={{ color: selected.color, fontSize: "0.85rem" }}>→</span>
                          <span style={{ fontSize: "0.85rem", color: T.text }}>{c}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats side */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ padding: "1.25rem", borderRadius: 14, background: selected.bgLight, border: `1px solid ${selected.border}`, textAlign: "center" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>TARGET RESPONSE</div>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: selected.color, letterSpacing: "-0.04em" }}>{selected.responseTime}</div>
                  </div>
                  <div style={{ padding: "1.25rem", borderRadius: 14, background: T.bgAlt, border: `1px solid ${T.border}`, textAlign: "center" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>DISPATCH TYPE</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: T.text }}>{selected.dispatchType}</div>
                  </div>

                  {/* Pulse indicator */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.2, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ width: 10, height: 10, borderRadius: "50%", background: selected.color }}
                    />
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: selected.color }}>
                      Protocol Active
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
