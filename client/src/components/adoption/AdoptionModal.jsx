import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adoptionApplicationSchema } from "../../utils/validators";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useAdoption } from "../../context/AdoptionContext";
import Button from "../ui/Button";

const STEPS = [
  { step: 1, title: "Application Review",     desc: "The rescue NGO reviews your profile and reaches out within 24–48 hours." },
  { step: 2, title: "Background & Reference", desc: "A brief check to ensure a safe and loving environment for the animal." },
  { step: 3, title: "Meet & Match",           desc: "Schedule a visit to meet your companion and finalize the adoption!" }
];

export default function AdoptionModal({ animal, onClose }) {
  const { T } = useT();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitApplication } = useAdoption();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adoptionApplicationSchema),
    defaultValues: {
      message: "",
      experience: "",
      livingEnvironment: "",
      contactInfo: user?.phone || "",
      address: user?.location || "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSubmitting(true);
    setFeedback("");
    const result = await submitApplication(animal.id, data);
    setSubmitting(false);
    if (result.success) {
      setSuccess(true);
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
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div className="rq-modal-header" style={{ alignItems: "flex-start", flexShrink: 0 }}>
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
                    color: T.textOnAccent,
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

          <div className="rq-modal-body" style={{ overflowY: "auto", flex: 1, paddingBottom: 10 }}>

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

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: "1.5rem", textAlign: "center", background: "rgba(34, 197, 94, 0.1)", borderRadius: 12, border: "1px solid rgba(34, 197, 94, 0.3)" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</div>
              <div style={{ color: "#16A34A", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                Application Submitted!
              </div>
              <div style={{ color: T.textSub, fontSize: "0.85rem", lineHeight: 1.5 }}>
                {feedback}
              </div>
            </motion.div>
          ) : (
            <form id="adoption-form" onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.85rem", marginBottom: "1rem" }}>
                <div>
                  <textarea
                    {...register("message")}
                    placeholder="Tell the NGO why you want to adopt…"
                    rows={2}
                    className="rq-textarea"
                    style={{ borderColor: errors.message ? "#EF4444" : undefined }}
                    disabled={submitting}
                  />
                  {errors.message && <div style={{ color: T.danger, fontSize: "0.72rem", marginTop: 4 }}>{errors.message.message}</div>}
                </div>

                <div>
                  <textarea
                    {...register("experience")}
                    placeholder="Your experience with animals (e.g., have you owned pets before?)"
                    rows={2}
                    className="rq-textarea"
                    style={{ borderColor: errors.experience ? "#EF4444" : undefined }}
                    disabled={submitting}
                  />
                  {errors.experience && <div style={{ color: T.danger, fontSize: "0.72rem", marginTop: 4 }}>{errors.experience.message}</div>}
                </div>

                <div>
                  <input
                    type="text"
                    {...register("livingEnvironment")}
                    placeholder="Living Environment (e.g., Apartment, House with yard)"
                    className="rq-input"
                    style={{ borderColor: errors.livingEnvironment ? "#EF4444" : undefined }}
                    disabled={submitting}
                  />
                  {errors.livingEnvironment && <div style={{ color: T.danger, fontSize: "0.72rem", marginTop: 4 }}>{errors.livingEnvironment.message}</div>}
                </div>

                <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 calc(50% - 0.425rem)" }}>
                    <input
                      type="text"
                      {...register("contactInfo")}
                      placeholder="Phone Number"
                      className="rq-input"
                      style={{ borderColor: errors.contactInfo ? "#EF4444" : undefined }}
                      disabled={submitting}
                    />
                    {errors.contactInfo && <div style={{ color: T.danger, fontSize: "0.72rem", marginTop: 4 }}>{errors.contactInfo.message}</div>}
                  </div>
                  <div style={{ flex: "1 1 calc(50% - 0.425rem)" }}>
                    <input
                      type="text"
                      {...register("address")}
                      placeholder="City, State / Address"
                      className="rq-input"
                      style={{ borderColor: errors.address ? "#EF4444" : undefined }}
                      disabled={submitting}
                    />
                    {errors.address && <div style={{ color: T.danger, fontSize: "0.72rem", marginTop: 4 }}>{errors.address.message}</div>}
                  </div>
                </div>
              </div>

              {!success && feedback && (
                <p style={{ fontSize: "0.85rem", color: T.danger, marginBottom: "0.75rem", padding: "0.5rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: 6 }}>
                  {feedback}
                </p>
              )}
            </form>
          )}

          </div>

          <div className="rq-modal-footer" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.85rem", flexShrink: 0, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {!success && (
                <Button variant="primary" size="lg" style={{ flex: 1 }} type="submit" form="adoption-form" disabled={submitting}>
                  {submitting ? "Submitting…" : `Apply to adopt ${animal.name}`}
                </Button>
              )}
              <Button variant="ghost" onClick={onClose} style={success ? { flex: 1 } : {}}>
                {success ? "Close" : "Cancel"}
              </Button>
            </div>
            {!success && (
              <p style={{ fontSize: "0.65rem", color: T.textMuted, textAlign: "center", lineHeight: 1.6 }}>
                No fees for adopters · All adoptions facilitated by verified NGOs · Post-adoption support included
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
