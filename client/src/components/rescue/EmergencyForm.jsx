import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useRescue } from "../../context/RescueContext";
import useViewport from "../../hooks/useViewport";
import Label from "../ui/Label";
import { vFadeUp } from "../../animations/variants";
import { getCurrentPosition } from "../../utils/geo";
import RescueLocationPicker from "../maps/RescueLocationPicker";

const ANIMAL_TYPES = ["Dog", "Cat", "Bird", "Cow", "Horse", "Monkey", "Rabbit", "Snake", "Deer", "Other"];
const EMERGENCY_LEVELS = [
  { value: "critical", label: "🔴 Critical", desc: "Life-threatening, needs immediate help" },
  { value: "high", label: "🟠 High", desc: "Serious injury, urgent care needed" },
  { value: "medium", label: "🟡 Medium", desc: "Injured but stable condition" },
  { value: "low", label: "🟢 Low", desc: "Needs care but not immediate danger" },
];

export default function EmergencyForm({ onSuccess }) {
  const { T } = useT();
  const vp = useViewport();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRescue, loading: rescueLoading, error: rescueError } = useRescue();

  const fileRef = useRef();
  const [form, setForm] = useState({
    animalType: "",
    breed: "",
    condition: "",
    severity: "",
    address: "",
    city: "",
    state: "",
    latitude: null,
    longitude: null,
    contact: "",
    notes: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const LOADING_STEPS = [
    "Validating emergency data…",
    "Connecting to rescue network…",
    "Creating rescue request…",
    "Notifying NGOs & volunteers…",
  ];

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Basic client-side validation
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image too large. Max 5MB per file.");
      return;
    }
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrorMsg("Unsupported image type.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const validate = () => {
    const e = {};
    if (!form.animalType) e.animalType = "Select animal type";
    if (!form.condition.trim()) e.condition = "Describe the condition";
    if (!form.severity) e.severity = "Select severity level";
    if (!form.address.trim()) e.address = "Enter location";
    if (!form.contact.trim()) e.contact = "Enter contact number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLocationChange = (location) => {
    setForm((f) => ({
      ...f,
      address: location.address || f.address,
      city: location.city || f.city,
      state: location.state || f.state,
      latitude: location.latitude ?? f.latitude,
      longitude: location.longitude ?? f.longitude,
    }));
    setErrors((err) => ({ ...err, address: "" }));
  };

  const handleSubmit = async () => {
    if (!user) {
      setErrorMsg("Please log in to submit a rescue request");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (!validate()) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setStep(0);

    // Animate through loading steps
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= LOADING_STEPS.length - 1) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 700);

    const description = form.notes.trim()
      ? `${form.condition.trim()}\n\nAdditional notes: ${form.notes.trim()}`
      : form.condition.trim();

    const formData = new FormData();
    formData.append("animalType", form.animalType.trim());
    formData.append("condition", form.condition.trim());
    formData.append("description", description);
    formData.append("severity", form.severity);
    formData.append("address", form.address.trim());
    if (form.city?.trim()) {
      formData.append("city", form.city.trim());
    }
    if (form.state?.trim()) {
      formData.append("state", form.state.trim());
    }

    if (Number.isFinite(form.latitude) && Number.isFinite(form.longitude)) {
      formData.append("latitude", String(form.latitude));
      formData.append("longitude", String(form.longitude));
    } else {
      try {
        const position = await getCurrentPosition();
        formData.append("latitude", String(position.latitude));
        formData.append("longitude", String(position.longitude));
      } catch {
        // Location optional — address still used for NGO matching
      }
    }

    if (selectedFile) {
      formData.append("images", selectedFile);
    }

    const result = await createRescue(formData);

    clearInterval(interval);

    if (result.success) {
      setSuccessMsg("✅ Rescue request submitted successfully!");
      setTimeout(() => {
        setLoading(false);
        setForm({
          animalType: "",
          breed: "",
          condition: "",
          severity: "",
          address: "",
          contact: "",
          notes: "",
        });
        setImagePreview(null);
        setSelectedFile(null);
        setErrors({});
        onSuccess?.(result.data);
      }, 1200);
    } else {
      setLoading(false);
      setErrorMsg(result.message || "Failed to submit rescue request");
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "0.72rem 1rem",
    borderRadius: 10,
    border: `1px solid ${errors[field] ? "#EF4444" : T.border}`,
    background: T.bgCard,
    color: T.text,
    fontSize: "0.88rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  });

  return (
    <section
      id="emergency-form"
      style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bg, position: "relative" }}
    >
      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={vFadeUp}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          <Label color="#EF4444">Emergency Report</Label>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: T.text,
              margin: "0 0 0.75rem",
            }}
          >
            Report an Animal Emergency
          </h2>
          <p style={{ color: T.textSub, fontSize: "clamp(0.88rem, 2vw, 1rem)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Fill in the details below. Your rescue request is immediately sent to our network of NGOs and volunteers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: T.bgCard,
            borderRadius: 18,
            border: `1px solid ${T.border}`,
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            boxShadow: `0 8px 40px ${T.shadow}`,
          }}
        >
          {/* Error message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 10,
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#DC2626",
                fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              {errorMsg}
            </motion.div>
          )}

          {/* Success message */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 10,
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                color: "#16A34A",
                fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              {successMsg}
            </motion.div>
          )}

          {/* Image upload */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div
              onClick={() => !loading && fileRef.current?.click()}
              style={{
                border: `2px dashed ${T.border}`,
                borderRadius: 12,
                padding: "1.5rem",
                textAlign: "center",
                cursor: loading ? "default" : "pointer",
                transition: "border-color 0.2s, background 0.2s",
                background: imagePreview ? "transparent" : T.bgAlt,
                position: "relative",
                overflow: "hidden",
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.borderColor = T.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImage}
                style={{ display: "none" }}
                disabled={loading}
              />
              {imagePreview ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={imagePreview}
                    alt="Animal preview"
                    style={{ maxHeight: 200, borderRadius: 8, margin: "0 auto", objectFit: "contain" }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setSelectedFile(null);
                    }}
                    disabled={loading}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      cursor: loading ? "default" : "pointer",
                      fontSize: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📷</div>
                  <div style={{ fontSize: "0.88rem", color: T.textSub, fontWeight: 600 }}>
                    Upload Animal Photo
                  </div>
                  <div style={{ fontSize: "0.75rem", color: T.textMuted, marginTop: 4 }}>
                    Click or drag — helps rescuers prepare
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Grid fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            {/* Animal Type */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                ANIMAL TYPE *
              </label>
              <select
                value={form.animalType}
                onChange={(e) => {
                  setForm((f) => ({ ...f, animalType: e.target.value }));
                  setErrors((err) => ({ ...err, animalType: "" }));
                }}
                disabled={loading}
                style={{ ...inputStyle("animalType"), opacity: loading ? 0.6 : 1 }}
              >
                <option value="">Select type…</option>
                {ANIMAL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.animalType && <div style={{ color: "#EF4444", fontSize: "0.72rem", marginTop: 4 }}>{errors.animalType}</div>}
            </div>

            {/* Breed */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                BREED (OPTIONAL)
              </label>
              <input
                value={form.breed}
                onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
                placeholder="e.g. Labrador, Indie…"
                disabled={loading}
                style={{ ...inputStyle("breed"), opacity: loading ? 0.6 : 1 }}
              />
            </div>
          </div>

          {/* Condition description */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
              CONDITION / INJURY *
            </label>
            <textarea
              value={form.condition}
              onChange={(e) => {
                setForm((f) => ({ ...f, condition: e.target.value }));
                setErrors((err) => ({ ...err, condition: "" }));
              }}
              placeholder="Describe what you observe — wounds, behavior, posture…"
              rows={3}
              disabled={loading}
              style={{ ...inputStyle("condition"), resize: "vertical", opacity: loading ? 0.6 : 1 }}
            />
            {errors.condition && <div style={{ color: "#EF4444", fontSize: "0.72rem", marginTop: 4 }}>{errors.condition}</div>}
          </div>

          {/* Severity level */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.6rem", letterSpacing: "0.04em" }}>
              SEVERITY *
            </label>
            <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "0.6rem" }}>
              {EMERGENCY_LEVELS.map(({ value, label, desc }) => (
                <motion.div
                  key={value}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  onClick={() => {
                    if (!loading) {
                      setForm((f) => ({ ...f, severity: value }));
                      setErrors((err) => ({ ...err, severity: "" }));
                    }
                  }}
                  style={{
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: `1.5px solid ${form.severity === value ? T.accent : T.border}`,
                    background: form.severity === value ? T.accentPale : T.bgCard,
                    cursor: loading ? "default" : "pointer",
                    transition: "all 0.2s",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: T.text, marginBottom: 3 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: T.textMuted, lineHeight: 1.4 }}>{desc}</div>
                </motion.div>
              ))}
            </div>
            {errors.severity && <div style={{ color: "#EF4444", fontSize: "0.72rem", marginTop: 4 }}>{errors.severity}</div>}
          </div>

          {/* Location + Contact */}
          <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                LOCATION *
              </label>
              <input
                value={form.address}
                onChange={(e) => {
                  setForm((f) => ({ ...f, address: e.target.value, latitude: null, longitude: null }));
                  setErrors((err) => ({ ...err, address: "" }));
                }}
                placeholder="Street, landmark, city…"
                disabled={loading}
                style={{ ...inputStyle("address"), opacity: loading ? 0.6 : 1 }}
              />
              {errors.address && <div style={{ color: "#EF4444", fontSize: "0.72rem", marginTop: 4 }}>{errors.address}</div>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                CONTACT NUMBER *
              </label>
              <input
                value={form.contact}
                onChange={(e) => {
                  setForm((f) => ({ ...f, contact: e.target.value }));
                  setErrors((err) => ({ ...err, contact: "" }));
                }}
                placeholder="+91 XXXXX XXXXX"
                disabled={loading}
                style={{ ...inputStyle("contact"), opacity: loading ? 0.6 : 1 }}
              />
              {errors.contact && <div style={{ color: "#EF4444", fontSize: "0.72rem", marginTop: 4 }}>{errors.contact}</div>}
            </div>
          </div>
          <RescueLocationPicker
            value={{
              address: form.address,
              city: form.city,
              state: form.state,
              latitude: form.latitude,
              longitude: form.longitude,
            }}
            onChange={handleLocationChange}
          />

          {/* Notes */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
              ADDITIONAL NOTES
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Any other details that might help the rescue team…"
              rows={2}
              disabled={loading}
              style={{ ...inputStyle("notes"), resize: "vertical", opacity: loading ? 0.6 : 1 }}
            />
          </div>

          {/* Submit */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: "1rem",
                  borderRadius: 10,
                  background: T.accentPale,
                  border: `1px solid ${T.accentBorder || T.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: 20,
                    height: 20,
                    border: `2px solid ${T.border}`,
                    borderTop: `2px solid ${T.accent}`,
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text }}>
                    {LOADING_STEPS[step]}
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: T.border, marginTop: 6 }}>
                    <motion.div
                      animate={{
                        width: `${((step + 1) / LOADING_STEPS.length) * 100}%`,
                      }}
                      transition={{ duration: 0.5 }}
                      style={{ height: "100%", borderRadius: 2, background: T.accent }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="submit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(239,68,68,0.35)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.95rem",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #EF4444, #DC2626)",
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: loading ? "default" : "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "-0.01em",
                }}
              >
                🚨 Submit Emergency Rescue Request
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
