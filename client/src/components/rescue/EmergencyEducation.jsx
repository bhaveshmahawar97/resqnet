import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT, THEME } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Label from "../ui/Label";
import { vFadeUp } from "../../animations/variants";

const GUIDES = [
  {
    id: "road-accident",
    icon: "🚗",
    title: "Road Accident",
    subtitle: "Hit-and-run injuries in animals",
    color: THEME.light.danger,
    summary: "Road accidents cause severe trauma in animals. Quick assessment and safe immobilization can save a life.",
    steps: [
      "Ensure your own safety first — stay off the road",
      "Do NOT try to move the animal unless it's in immediate traffic danger",
      "Check for visible wounds, breathing, and consciousness",
      "Use a flat board or blanket as a stretcher if transport is needed",
      "Keep the animal warm and as calm as possible",
      "Call ResQNet or a local NGO immediately",
    ],
    warnings: ["Never muzzle an unconscious animal", "Don't give food or water if internal injuries suspected"],
    priority: "CRITICAL",
    priorityColor: "#EF4444",
  },
  {
    id: "dehydration",
    icon: "💧",
    title: "Dehydration",
    subtitle: "Heat stroke & water deprivation",
    color: "#F97316",
    summary: "Animals in India face severe dehydration in summer. Recognition and quick hydration steps are crucial.",
    steps: [
      "Look for dry gums, sunken eyes, lethargy, or skin that stays pinched",
      "Move animal to a shaded, cool area immediately",
      "Offer small amounts of water — do not force feed",
      "Apply cool (not cold) wet cloths to paws and neck",
      "For severe cases, only IV fluids from a vet will suffice",
      "Monitor breathing every few minutes",
    ],
    warnings: ["Don't give cold water — it can cause shock", "Avoid ice packs on skin directly"],
    priority: "HIGH",
    priorityColor: "#F97316",
  },
  {
    id: "injury-handling",
    icon: "🩹",
    title: "Injury Handling",
    subtitle: "Wounds, fractures, and bleeding",
    color: "#EAB308",
    summary: "Handling injured animals safely requires knowledge of restraint, wound management, and transport.",
    steps: [
      "Approach slowly and calmly to avoid startling the animal",
      "Use a muzzle or wrap head in cloth to prevent biting (if conscious)",
      "Apply gentle pressure to bleeding wounds with clean cloth",
      "Do not attempt to set fractures — immobilize with padding only",
      "Transport in a box or crate lined with soft fabric",
      "Keep wound area clean and covered until vet arrival",
    ],
    warnings: ["Never apply tourniquet unless trained", "Avoid antiseptics like Dettol on open wounds"],
    priority: "HIGH",
    priorityColor: "#EAB308",
  },
  {
    id: "wildlife-rescue",
    icon: "🦁",
    title: "Wildlife Rescue",
    subtitle: "Wild animals in urban areas",
    color: "#22C55E",
    summary: "Wild animals in distress require specialized protocols. Improper handling can be dangerous for both human and animal.",
    steps: [
      "Do NOT approach or touch wild animals — call professionals",
      "Create a safe perimeter to keep other people away",
      "Note the exact location, species, and condition observed",
      "Take photos for AI analysis if safely possible",
      "Contact ResQNet Wildlife Division or Forest Department",
      "Keep pets and children at a safe distance",
    ],
    warnings: ["Wild animals may appear tame but can be dangerous", "Zoonotic diseases can transfer — wear gloves if contact is unavoidable"],
    priority: "MODERATE",
    priorityColor: "#22C55E",
  },
];

export default function EmergencyEducation() {
  const { T } = useT();
  const vp = useViewport();
  const [expanded, setExpanded] = useState(null);
  const [modalGuide, setModalGuide] = useState(null);

  return (
    <section style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bgAlt, position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`, backgroundSize: "80px 80px", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)", position: "relative", zIndex: 1 }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp} style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>Emergency Protocols</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: "0 0 0.75rem" }}>
            Emergency Care Guidance
          </h2>
          <p style={{ color: T.textSub, fontSize: "clamp(0.88rem, 2vw, 1rem)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Life-saving protocols for common animal emergencies. Click to expand or read the full guide.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "repeat(2, 1fr)", gap: "1.25rem" }}>
          {GUIDES.map((guide, i) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: T.bgCard,
                borderRadius: 16,
                border: `1px solid ${expanded === guide.id ? guide.color + "60" : T.border}`,
                overflow: "hidden",
                boxShadow: `0 2px 12px ${T.shadow}`,
                transition: "border-color 0.3s",
              }}
            >
              {/* Header */}
              <motion.div
                whileHover={{ background: T.bgCardHov }}
                onClick={() => setExpanded(expanded === guide.id ? null : guide.id)}
                style={{
                  padding: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  transition: "background 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ fontSize: "1.6rem", width: 44, height: 44, borderRadius: 10, background: `${guide.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {guide.icon}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: "0.92rem", color: T.text }}>{guide.title}</span>
                      <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: `${guide.priorityColor}15`, color: guide.priorityColor }}>
                        {guide.priority}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: T.textMuted }}>{guide.subtitle}</div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expanded === guide.id ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: T.textMuted, flexShrink: 0 }}
                >
                  ▾
                </motion.div>
              </motion.div>

              {/* Expandable content */}
              <AnimatePresence initial={false}>
                {expanded === guide.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ padding: "0 1.25rem 1.25rem" }}>
                      <p style={{ fontSize: "0.85rem", color: T.textSub, lineHeight: 1.7, marginBottom: "1rem" }}>{guide.summary}</p>

                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>IMMEDIATE STEPS</div>
                        {guide.steps.map((step, si) => (
                          <motion.div
                            key={si}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: si * 0.05 }}
                            style={{ display: "flex", gap: "0.5rem", padding: "0.25rem 0" }}
                          >
                            <span style={{ color: guide.color, fontWeight: 700, fontSize: "0.82rem", flexShrink: 0 }}>{si + 1}.</span>
                            <span style={{ fontSize: "0.82rem", color: T.text, lineHeight: 1.5 }}>{step}</span>
                          </motion.div>
                        ))}
                      </div>

                      <div style={{ padding: "0.75rem", borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: "1rem" }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.danger, letterSpacing: "0.1em", marginBottom: "0.4rem" }}>⚠ WARNINGS</div>
                        {guide.warnings.map((w, wi) => (
                          <div key={wi} style={{ fontSize: "0.78rem", color: T.text, padding: "0.2rem 0" }}>• {w}</div>
                        ))}
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); setModalGuide(guide); }}
                        style={{ fontSize: "0.8rem", fontWeight: 600, color: guide.color, background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
                      >
                        Read full protocol →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full guide modal */}
      <AnimatePresence>
        {modalGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalGuide(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", overflowY: "auto" }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: T.bgCard, borderRadius: 20, border: `1px solid ${T.border}`, padding: "2rem", maxWidth: 540, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: `0 24px 80px ${T.shadowDeep}` }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "2rem" }}>{modalGuide.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.1rem", color: T.text }}>{modalGuide.title}</div>
                    <div style={{ fontSize: "0.78rem", color: T.textMuted }}>{modalGuide.subtitle}</div>
                  </div>
                </div>
                <button onClick={() => setModalGuide(null)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", color: T.textMuted }}>✕</button>
              </div>
              <p style={{ fontSize: "0.88rem", color: T.textSub, lineHeight: 1.75, marginBottom: "1.25rem" }}>{modalGuide.summary}</p>
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", marginBottom: "0.6rem" }}>STEP-BY-STEP PROTOCOL</div>
                {modalGuide.steps.map((step, si) => (
                  <div key={si} style={{ display: "flex", gap: "0.75rem", padding: "0.5rem 0", borderBottom: si < modalGuide.steps.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <span style={{ color: modalGuide.color, fontWeight: 800, flexShrink: 0, minWidth: 20 }}>{si + 1}</span>
                    <span style={{ fontSize: "0.85rem", color: T.text, lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: "1rem", borderRadius: 10, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.danger, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>⚠ CRITICAL WARNINGS</div>
                {modalGuide.warnings.map((w, wi) => (
                  <div key={wi} style={{ fontSize: "0.82rem", color: T.text, padding: "0.2rem 0" }}>• {w}</div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
