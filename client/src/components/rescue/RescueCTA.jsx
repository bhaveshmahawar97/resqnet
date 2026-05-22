import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Button from "../ui/Button";
import BackgroundOrbs from "../ui/BackgroundOrbs";
import { vFadeUp } from "../../animations/variants";

const CTA_OPTIONS = [
  { id: "network", icon: "🌐", title: "Join Rescue Network", desc: "Get connected with NGOs, receive rescue alerts, and track live cases in your area.", action: "Join Now", color: "#3B82F6" },
  { id: "volunteer", icon: "🧑‍⚕️", title: "Become a Volunteer", desc: "Train with certified rescue specialists and become a certified first-responder in your city.", action: "Apply Today", color: "#22C55E" },
  { id: "ngo", icon: "🏥", title: "Partner as NGO", desc: "List your NGO on ResQNet and receive AI-dispatched cases directly on your team's dashboard.", action: "Partner With Us", color: "#8B5CF6" },
];

export default function RescueCTA() {
  const { T } = useT();
  const vp = useViewport();
  const [activeModal, setActiveModal] = useState(null);
  const [submitted, setSubmitted] = useState({});
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", city: "" });

  const handleSubmit = (id) => {
    setSubmitted((s) => ({ ...s, [id]: true }));
    setTimeout(() => setActiveModal(null), 1500);
  };

  return (
    <section
      style={{
        width: "100%",
        padding: "clamp(4rem, 10vw, 7rem) 0",
        background: T.gradHero,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <BackgroundOrbs />

      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)", position: "relative", zIndex: 1 }}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={vFadeUp}
          style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 6vw, 4rem)" }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🐾</div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.045em",
              color: T.text,
              margin: "0 0 1rem",
              lineHeight: 1.1,
            }}
          >
            Be Part of the{" "}
            <span
              style={{
                background: `linear-gradient(100deg, ${T.accent} 0%, ${T.accentDim} 55%, ${T.accent} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Rescue Revolution.
            </span>
          </h2>
          <p style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.15rem)", color: T.textSub, maxWidth: 560, margin: "0 auto", lineHeight: 1.75 }}>
            Every animal rescue needs a network behind it. Join thousands of volunteers, NGOs, and supporters building India's most advanced animal welfare platform.
          </p>
        </motion.div>

        {/* CTA cards */}
        <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
          {CTA_OPTIONS.map((opt, i) => (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6, boxShadow: `0 20px 60px ${opt.color}22` }}
              style={{
                background: T.bgCard,
                borderRadius: 20,
                border: `1px solid ${T.border}`,
                padding: "2rem",
                textAlign: "center",
                boxShadow: `0 4px 20px ${T.shadow}`,
                transition: "box-shadow 0.3s",
                cursor: "pointer",
              }}
              onClick={() => setActiveModal(opt.id)}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{opt.icon}</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: T.text, marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>{opt.title}</div>
              <p style={{ fontSize: "0.85rem", color: T.textSub, lineHeight: 1.7, marginBottom: "1.25rem" }}>{opt.desc}</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => { e.stopPropagation(); setActiveModal(opt.id); }}
                style={{
                  padding: "0.65rem 1.5rem",
                  borderRadius: 10,
                  border: `1px solid ${opt.color}`,
                  background: `${opt.color}15`,
                  color: opt.color,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  width: "100%",
                }}
              >
                {opt.action}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Emergency hotline strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign: "center",
            padding: "1.5rem",
            borderRadius: 16,
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#EF4444", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>🚨 EMERGENCY HELPLINE</div>
          <div style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 900, color: T.text, letterSpacing: "-0.03em" }}>
            1800-RESQNET
          </div>
          <div style={{ fontSize: "0.82rem", color: T.textMuted, marginTop: "0.3rem" }}>Toll-free • Available 24/7 • AI-assisted dispatch</div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: T.bgCard, borderRadius: 20, border: `1px solid ${T.border}`, padding: "2rem", maxWidth: 420, width: "100%", boxShadow: `0 24px 80px ${T.shadowDeep}` }}
            >
              {submitted[activeModal] ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>✅</div>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem", color: T.text, marginBottom: "0.5rem" }}>Application Submitted!</div>
                  <div style={{ fontSize: "0.85rem", color: T.textSub }}>We'll be in touch within 24 hours.</div>
                </motion.div>
              ) : (
                <>
                  {(() => {
                    const opt = CTA_OPTIONS.find((o) => o.id === activeModal);
                    return (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                          <div>
                            <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>{opt.icon}</span>
                            <span style={{ fontWeight: 800, fontSize: "1rem", color: T.text }}>{opt.title}</span>
                          </div>
                          <button onClick={() => setActiveModal(null)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", color: T.textMuted }}>✕</button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                          {["Full Name", "Email Address", "Phone Number", "City"].map((field) => (
                            <input
                              key={field}
                              placeholder={field}
                              value={formData[field.toLowerCase().split(" ")[0]] || ""}
                              onChange={(e) => setFormData((f) => ({ ...f, [field.toLowerCase().split(" ")[0]]: e.target.value }))}
                              style={{
                                padding: "0.72rem 1rem",
                                borderRadius: 10,
                                border: `1px solid ${T.border}`,
                                background: T.bgAlt,
                                color: T.text,
                                fontSize: "0.88rem",
                                fontFamily: "inherit",
                                outline: "none",
                              }}
                            />
                          ))}
                        </div>
                        <Button variant="primary" onClick={() => handleSubmit(activeModal)} style={{ width: "100%", justifyContent: "center" }}>
                          Submit Application
                        </Button>
                      </>
                    );
                  })()}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
