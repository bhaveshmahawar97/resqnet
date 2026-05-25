import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportRescueSchema } from "../../utils/validators";
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
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportRescueSchema),
    defaultValues: {
      animalType: "",
      breed: "",
      condition: "",
      severity: "",
      address: "",
      city: "",
      state: "",
      latitude: undefined,
      longitude: undefined,
      contactPhone: "",
      notes: "",
    },
  });

  const severity = watch("severity");
  const address = watch("address");
  const city = watch("city");
  const state = watch("state");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image too large. Max 5MB per file.");
      return;
    }
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrorMsg("Unsupported image type.");
      return;
    }
    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleLocationChange = (location) => {
    if (location.address) setValue("address", location.address, { shouldValidate: true });
    if (location.city) setValue("city", location.city);
    if (location.state) setValue("state", location.state);
    if (location.latitude !== undefined) setValue("latitude", location.latitude);
    if (location.longitude !== undefined) setValue("longitude", location.longitude);
  };

  const onSubmit = async (data) => {
    if (!user) {
      setErrorMsg("Please log in to submit a rescue request");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setStep(0);

    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= LOADING_STEPS.length - 1) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 700);

    const description = data.notes?.trim()
      ? `${data.condition.trim()}\n\nAdditional notes: ${data.notes.trim()}`
      : data.condition.trim();

    const formData = new FormData();
    formData.append("animalType", data.animalType.trim());
    formData.append("condition", data.condition.trim());
    formData.append("description", description);
    formData.append("severity", data.severity);
    formData.append("address", data.address.trim());
    if (data.city?.trim()) formData.append("city", data.city.trim());
    if (data.state?.trim()) formData.append("state", data.state.trim());
    formData.append("contactPhone", data.contactPhone.trim());

    if (Number.isFinite(data.latitude) && Number.isFinite(data.longitude)) {
      formData.append("latitude", String(data.latitude));
      formData.append("longitude", String(data.longitude));
    } else {
      try {
        const position = await getCurrentPosition();
        formData.append("latitude", String(position.latitude));
        formData.append("longitude", String(position.longitude));
      } catch {
        // Location optional
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
        reset();
        setImagePreview(null);
        setSelectedFile(null);
        onSuccess?.(result.data);
      }, 1200);
    } else {
      setLoading(false);
      setErrorMsg(result.message || "Failed to submit rescue request");
    }
  };

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
          className="rq-form-card"
          style={{
            maxWidth: 720,
            margin: "0 auto",
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
                color: T.danger,
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

          {/* Form wrapper */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Image upload */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                onClick={() => !loading && fileRef.current?.click()}
                className="rq-upload-zone"
                style={{
                  cursor: loading ? "default" : "pointer",
                  background: imagePreview ? "transparent" : undefined,
                  opacity: loading ? 0.6 : 1,
                }}
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
                      type="button"
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
                        color: T.textOnAccent,
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
                  disabled={loading}
                  {...register("animalType")}
                  className="rq-input"
                  style={{ borderColor: errors.animalType ? "#EF4444" : undefined, opacity: loading ? 0.6 : 1 }}
                >
                  <option value="">Select type…</option>
                  {ANIMAL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.animalType && <div style={{ color: T.danger, fontSize: "0.72rem", marginTop: 4 }}>{errors.animalType.message}</div>}
              </div>

              {/* Breed */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                  BREED (OPTIONAL)
                </label>
                <input
                  {...register("breed")}
                  placeholder="e.g. Labrador, Indie…"
                  disabled={loading}
                  className="rq-input"
                  style={{ opacity: loading ? 0.6 : 1 }}
                />
              </div>
            </div>

            {/* Condition description */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                CONDITION / INJURY *
              </label>
              <textarea
                {...register("condition")}
                placeholder="Describe what you observe — wounds, behavior, posture…"
                rows={3}
                disabled={loading}
                className="rq-textarea"
                style={{ borderColor: errors.condition ? "#EF4444" : undefined, opacity: loading ? 0.6 : 1 }}
              />
              {errors.condition && <div style={{ color: T.danger, fontSize: "0.72rem", marginTop: 4 }}>{errors.condition.message}</div>}
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
                        setValue("severity", value, { shouldValidate: true });
                      }
                    }}
                    style={{
                      padding: "0.75rem",
                      borderRadius: 10,
                      border: `1.5px solid ${severity === value ? T.accent : T.border}`,
                      background: severity === value ? T.accentPale : T.bgCard,
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
              {errors.severity && <div style={{ color: T.danger, fontSize: "0.72rem", marginTop: 4 }}>{errors.severity.message}</div>}
            </div>

            {/* Location + Contact */}
            <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                  LOCATION *
                </label>
                <input
                  {...register("address")}
                  onChange={(e) => {
                    setValue("address", e.target.value, { shouldValidate: true });
                    setValue("latitude", undefined);
                    setValue("longitude", undefined);
                  }}
                  placeholder="Street, landmark, city…"
                  className="rq-input"
                  style={{ borderColor: errors.address ? "#EF4444" : undefined, opacity: loading ? 0.6 : 1 }}
                />
                {errors.address && <div style={{ color: T.danger, fontSize: "0.72rem", marginTop: 4 }}>{errors.address.message}</div>}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                  CONTACT NUMBER *
                </label>
                <input
                  {...register("contactPhone")}
                  placeholder="+91 XXXXX XXXXX"
                  className="rq-input"
                  style={{ borderColor: errors.contactPhone ? "#EF4444" : undefined, opacity: loading ? 0.6 : 1 }}
                />
                {errors.contactPhone && <div style={{ color: T.danger, fontSize: "0.72rem", marginTop: 4 }}>{errors.contactPhone.message}</div>}
              </div>
            </div>
            <RescueLocationPicker
              value={{
                address: address || "",
                city: city || "",
                state: state || "",
                latitude: latitude,
                longitude: longitude,
              }}
              onChange={handleLocationChange}
            />

            {/* Notes */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.textSub, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
                ADDITIONAL NOTES
              </label>
              <textarea
                {...register("notes")}
                placeholder="Any other details that might help the rescue team…"
                rows={2}
                disabled={loading}
                className="rq-textarea"
                style={{ opacity: loading ? 0.6 : 1 }}
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
                  type="submit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(239,68,68,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.95rem",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg, #EF4444, #DC2626)",
                    color: T.textOnAccent,
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
          </form>
        </motion.div>
      </div>
    </section>
  );
}
