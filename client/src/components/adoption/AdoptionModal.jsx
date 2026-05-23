import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useAdoption } from "../../context/AdoptionContext";
import Button from "../ui/Button";

const STEPS = [
  { step: 1, title: "Express Interest",       desc: "Submit a quick interest form — takes 2 minutes. No fees, ever."              },
  { step: 2, title: "NGO Review",             desc: "The rescue NGO reviews your profile and reaches out within 24–48 hours."     },
  { step: 3, title: "Meet & Greet",           desc: "Schedule a home visit or shelter visit to meet your potential companion."    },
  { step: 4, title: "Adoption Approved",      desc: "Sign the adoption agreement and complete any required vet checks."           },
  { step: 5, title: "Welcome Home!",          desc: "Your animal comes home. Post-adoption support is available for 6 months."   },
];

export default function AdoptionModal({ animal, onClose }) {
  const { T } = useT();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitApplication } = useAdoption();
  const [formData, setFormData] = useState({
    message: "",
    experience: "",
    livingEnvironment: "",
    contactInfo: user?.phone || "",
    address: user?.location || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSubmitting(true);
    setFeedback("");
    const result = await submitApplication(animal.id, formData);
    setSubmitting(false);
    if (result.success) {
      setFeedback("Application submitted! The NGO will review your request.");
    } else {
      setFeedback(result.message || "Could not submit application.");
    }
  };

  if (!animal) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="rq-modal-overlay"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.25rem",
        }}
      >
        <motion.div
          key="modal-panel"
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="rq-modal"
          style={{
            maxWidth: 520,
            width: "100%",
          }}
        >
          {/* Header */}
          <div className="rq-modal-header" style={{ alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <img
                src={animal.img}
                alt={animal.name}
                style={{ width: 68, height: 68, borderRadius: 14, objectFit: "cover", border: `2px solid ${T.accentGlow}`, flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: T.text }}>{animal.name}</div>
                <div style={{ fontSize: "0.76rem", color: T.textSub }}>{animal.breed} · {animal.age} · {animal.city}</div>
                <div
                  style={{
                    marginTop: "0.35rem",
                    display: "inline-block",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "#fff",
                    background: animal.status === "Available" ? "#16A056" : animal.status === "In Foster" ? "#F59E0B" : "#3B82F6",
                    padding: "0.15rem 0.6rem",
                    borderRadius: 20,
                  }}
                >
                  {animal.status}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: T.bgAlt,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: T.textSub,
                fontSize: "1.1rem",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          <div className="rq-modal-body">

          {/* Mission tag */}
          <div
            style={{
              background: T.accentPale,
              border: `1px solid ${T.accentGlow}`,
              borderRadius: 10,
              padding: "0.65rem 0.9rem",
              marginBottom: "1.5rem",
              fontSize: "0.76rem",
              color: T.accent,
              fontWeight: 600,
            }}
          >
            🐾 Adopting from <strong>{animal.ngo}</strong> — verified ResQNet partner
          </div>

          {/* Process steps */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Adoption Journey
            </div>
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                style={{
                  display: "flex",
                  gap: "0.85rem",
                  alignItems: "flex-start",
                  marginBottom: i < STEPS.length - 1 ? "0.85rem" : 0,
                }}
              >
                {/* Step line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: T.accentPale,
                      border: `1.5px solid ${T.accent}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.65rem",
                      fontWeight: 900,
                      color: T.accent,
                    }}
                  >
                    {s.step}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 1.5, flex: 1, minHeight: 18, background: T.accentGlow, marginTop: 3 }} />
                  )}
                </div>
                <div style={{ paddingTop: 3 }}>
                  <div style={{ fontSize: "0.84rem", fontWeight: 700, color: T.text }}>{s.title}</div>
                  <div style={{ fontSize: "0.72rem", color: T.textSub, lineHeight: 1.65, marginTop: 2 }}>{s.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.85rem", marginBottom: "1rem" }}>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell the NGO why you want to adopt…"
              rows={2}
              className="rq-textarea"
            />
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Your experience with animals (e.g., have you owned pets before?)"
              rows={2}
              className="rq-textarea"
            />
            <input
              type="text"
              name="livingEnvironment"
              value={formData.livingEnvironment}
              onChange={handleChange}
              placeholder="Living Environment (e.g., Apartment, House with yard)"
              className="rq-input"
            />
            <div style={{ display: "flex", gap: "0.85rem" }}>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="Phone Number"
                className="rq-input"
                style={{ flex: 1 }}
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="City, State / Address"
                className="rq-input"
                style={{ flex: 1 }}
              />
            </div>
          </div>
          {feedback && <p style={{ fontSize: "0.85rem", color: T.accent, marginBottom: "0.75rem" }}>{feedback}</p>}

          </div>

          <div className="rq-modal-footer" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.85rem" }}>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <Button variant="primary" size="lg" style={{ flex: 1 }} onClick={handleApply} disabled={submitting}>
                {submitting ? "Submitting…" : `Apply to adopt ${animal.name}`}
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
            <p style={{ fontSize: "0.65rem", color: T.textMuted, textAlign: "center", lineHeight: 1.6 }}>
              No fees for adopters · All adoptions facilitated by verified NGOs · Post-adoption support included
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
