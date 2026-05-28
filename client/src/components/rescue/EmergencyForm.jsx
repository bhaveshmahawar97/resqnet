import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportRescueSchema } from "../../utils/validators";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useRescue } from "../../context/RescueContext";
import useViewport from "../../hooks/useViewport";
import { getCurrentPosition, reverseGeocode } from "../../utils/geo";

const ANIMAL_TYPES = ["Dog", "Cat", "Bird", "Cow", "Horse", "Monkey", "Rabbit", "Snake", "Deer", "Other"];
const SEVERITY_LEVELS = [
  { value: "critical", label: "Critical", getColor: (T) => T.danger },
  { value: "high",     label: "High",     getColor: (T) => T.warning },
  { value: "medium",   label: "Medium",   getColor: (T) => T.info },
  { value: "low",      label: "Low",      getColor: (T) => T.success },
];

const LOADING_STEPS = [
  "Validating emergency data…",
  "Connecting to rescue network…",
  "Creating rescue request…",
  "Notifying NGOs & volunteers…",
];

function FieldLabel({ children, required }) {
  const { T } = useT();
  return (
    <label
      style={{
        display: "block",
        fontSize: "0.7rem",
        fontWeight: 700,
        color: T.textMuted,
        marginBottom: "0.35rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {children}
      {required && <span style={{ color: T.danger, marginLeft: 3 }}>*</span>}
    </label>
  );
}

export default function EmergencyForm({ onSuccess }) {
  const { T } = useT();
  const vp = useViewport();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRescue } = useRescue();

  const fileRef = useRef();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(reportRescueSchema),
    defaultValues: {
      animalType: "", breed: "", condition: "", severity: "",
      address: "", city: "", state: "",
      latitude: undefined, longitude: undefined,
      contactPhone: "", notes: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const severity = watch("severity");

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image too large. Max 5MB.");
      return;
    }
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMsg("Unsupported image type.");
      return;
    }
    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const fetchLocation = async () => {
    if (locLoading || loading) return;
    setLocLoading(true);
    setErrorMsg("");
    try {
      const pos = await getCurrentPosition();
      const place = await reverseGeocode(pos).catch(() => null);
      if (place?.address || place?.displayName) {
        setValue("address", place.address || place.displayName || "", { shouldValidate: true });
        setValue("city", place.city || "");
        setValue("state", place.state || "");
      }
      if (pos?.latitude && pos?.longitude) {
        setValue("latitude", pos.latitude);
        setValue("longitude", pos.longitude);
      }
    } catch {
      setErrorMsg("Unable to fetch location. Allow location access and try again.");
    } finally {
      setLocLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!user) {
      setErrorMsg("Please log in to submit a rescue request.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setStep(0);

    const interval = setInterval(() => {
      setStep((s) => (s >= LOADING_STEPS.length - 1 ? s : s + 1));
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

    if (selectedFile) formData.append("images", selectedFile);

    const result = await createRescue(formData);
    clearInterval(interval);

    if (result.success) {
      setSuccessMsg("Rescue request submitted successfully.");
      setTimeout(() => {
        setLoading(false);
        reset();
        setImagePreview(null);
        setSelectedFile(null);
        onSuccess?.(result.data);
      }, 1000);
    } else {
      setLoading(false);
      setErrorMsg(result.message || "Failed to submit rescue request.");
    }
  };

  const fieldErr = (k) => errors[k]?.message;

  return (
    <section
      id="emergency-form"
      style={{ width: "100%", padding: vp.mobile ? "1.25rem 0 2rem" : "1.75rem 0 2.5rem", background: T.bg }}
    >
      <div style={{ width: "100%", maxWidth: 1120, margin: "0 auto", padding: vp.mobile ? "0 1rem" : "0 clamp(1.25rem, 3vw, 2.5rem)" }}>
        {/* Slim header — single row, no decorative copy */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 8, height: 8, borderRadius: "50%", background: T.danger, flexShrink: 0 }}
            />
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.01em" }}>
              Emergency Intake
            </h2>
            <span style={{ fontSize: "0.72rem", color: T.textMuted, fontWeight: 500 }}>
              · Submits to nearest NGO & volunteer network
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="rq-form-card"
          style={{ padding: vp.mobile ? "1rem" : "1.25rem 1.5rem" }}
        >
          {errorMsg && (
            <div
              role="alert"
              style={{
                padding: "0.55rem 0.85rem",
                borderRadius: 8,
                background: T.dangerPale,
                border: `1px solid ${T.dangerBorder}`,
                color: T.danger,
                fontSize: "0.82rem",
                marginBottom: "0.85rem",
              }}
            >
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div
              role="status"
              style={{
                padding: "0.55rem 0.85rem",
                borderRadius: 8,
                background: T.successPale,
                border: `1px solid ${T.successBorder}`,
                color: T.success,
                fontSize: "0.82rem",
                marginBottom: "0.85rem",
              }}
            >
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: vp.mobile ? "1fr" : "minmax(0, 1.85fr) minmax(220px, 1fr)",
                gap: vp.mobile ? "0.85rem" : "1.25rem",
              }}
            >
              {/* ── LEFT: fields ── */}
              <div style={{ display: "grid", gap: "0.85rem", minWidth: 0 }}>
                {/* Animal Type + Breed */}
                <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr", gap: "0.85rem" }}>
                  <div>
                    <FieldLabel required>Animal Type</FieldLabel>
                    <select
                      {...register("animalType")}
                      disabled={loading}
                      className="rq-input"
                      style={{ borderColor: errors.animalType ? T.danger : undefined }}
                    >
                      <option value="">Select type…</option>
                      {ANIMAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {fieldErr("animalType") && <div className="rq-field-error">{fieldErr("animalType")}</div>}
                  </div>
                  <div>
                    <FieldLabel>Breed</FieldLabel>
                    <input
                      {...register("breed")}
                      placeholder="e.g. Labrador, Indie"
                      disabled={loading}
                      className="rq-input"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <FieldLabel required>Condition / Injury</FieldLabel>
                  <textarea
                    {...register("condition")}
                    placeholder="Wounds, behavior, posture — what you observe"
                    rows={2}
                    disabled={loading}
                    className="rq-textarea"
                    style={{ minHeight: 64, borderColor: errors.condition ? T.danger : undefined }}
                  />
                  {fieldErr("condition") && <div className="rq-field-error">{fieldErr("condition")}</div>}
                </div>

                {/* Severity pills */}
                <div>
                  <FieldLabel required>Severity</FieldLabel>
                  <div
                    role="radiogroup"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "0.4rem",
                    }}
                  >
                    {SEVERITY_LEVELS.map(({ value, label, getColor }) => {
                      const active = severity === value;
                      const color = getColor(T);
                      return (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          disabled={loading}
                          onClick={() => setValue("severity", value, { shouldValidate: true })}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            padding: "0.55rem 0.5rem",
                            borderRadius: 8,
                            border: `1.5px solid ${active ? color : T.border}`,
                            background: active ? `${color}14` : T.bgCard,
                            color: active ? color : T.text,
                            cursor: loading ? "default" : "pointer",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            transition: "all 0.15s ease",
                            fontFamily: "inherit",
                          }}
                        >
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {fieldErr("severity") && <div className="rq-field-error">{fieldErr("severity")}</div>}
                </div>

                {/* Address + GPS button */}
                <div>
                  <FieldLabel required>Location</FieldLabel>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "stretch" }}>
                    <input
                      {...register("address")}
                      onChange={(e) => {
                        setValue("address", e.target.value, { shouldValidate: true });
                        setValue("latitude", undefined);
                        setValue("longitude", undefined);
                      }}
                      placeholder="Street, landmark, city"
                      disabled={loading}
                      className="rq-input"
                      style={{ flex: 1, minWidth: 0, borderColor: errors.address ? T.danger : undefined }}
                    />
                    <button
                      type="button"
                      onClick={fetchLocation}
                      disabled={locLoading || loading}
                      title="Use current location"
                      style={{
                        padding: "0 0.85rem",
                        borderRadius: 8,
                        border: `1px solid ${T.border}`,
                        background: T.bgCard,
                        color: T.text,
                        cursor: locLoading || loading ? "default" : "pointer",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        fontFamily: "inherit",
                        whiteSpace: "nowrap",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s-8-7.58-8-13a8 8 0 0 1 16 0c0 5.42-8 13-8 13z" />
                        <circle cx="12" cy="9" r="3" />
                      </svg>
                      {locLoading ? "Locating…" : "GPS"}
                    </button>
                  </div>
                  {fieldErr("address") && <div className="rq-field-error">{fieldErr("address")}</div>}
                </div>

                {/* City / State / Phone */}
                <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr 1fr" : "1fr 1fr 1.3fr", gap: "0.85rem" }}>
                  <div>
                    <FieldLabel>City</FieldLabel>
                    <input {...register("city")} disabled={loading} className="rq-input" placeholder="City" />
                  </div>
                  <div>
                    <FieldLabel>State</FieldLabel>
                    <input {...register("state")} disabled={loading} className="rq-input" placeholder="State" />
                  </div>
                  <div style={{ gridColumn: vp.mobile ? "span 2" : "auto" }}>
                    <FieldLabel required>Contact Phone</FieldLabel>
                    <input
                      {...register("contactPhone")}
                      disabled={loading}
                      placeholder="+91 XXXXX XXXXX"
                      className="rq-input"
                      style={{ borderColor: errors.contactPhone ? T.danger : undefined }}
                    />
                    {fieldErr("contactPhone") && <div className="rq-field-error">{fieldErr("contactPhone")}</div>}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <FieldLabel>Additional Notes</FieldLabel>
                  <textarea
                    {...register("notes")}
                    placeholder="Anything else the rescue team should know"
                    rows={2}
                    disabled={loading}
                    className="rq-textarea"
                    style={{ minHeight: 56 }}
                  />
                </div>
              </div>

              {/* ── RIGHT: photo upload ── */}
              <div style={{ minWidth: 0 }}>
                <FieldLabel>Photo</FieldLabel>
                <div
                  onClick={() => !loading && fileRef.current?.click()}
                  className="rq-upload-zone"
                  style={{
                    cursor: loading ? "default" : "pointer",
                    padding: imagePreview ? "0.5rem" : "1.25rem 0.75rem",
                    opacity: loading ? 0.6 : 1,
                    minHeight: vp.mobile ? 140 : 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
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
                    <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxHeight: vp.mobile ? 120 : 180, maxWidth: "100%", borderRadius: 6, objectFit: "contain" }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setSelectedFile(null);
                        }}
                        disabled={loading}
                        aria-label="Remove photo"
                        style={{
                          position: "absolute", top: 4, right: 4,
                          background: "rgba(0,0,0,0.65)", color: "#fff",
                          border: "none", borderRadius: "50%",
                          width: 22, height: 22, cursor: "pointer",
                          fontSize: "0.7rem", display: "flex",
                          alignItems: "center", justifyContent: "center",
                        }}
                      >✕</button>
                    </div>
                  ) : (
                    <>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 6 }}>
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                        <circle cx="12" cy="13" r="3.5" />
                      </svg>
                      <div style={{ fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>Upload photo</div>
                      <div style={{ fontSize: "0.7rem", color: T.textMuted, marginTop: 3, textAlign: "center", lineHeight: 1.35 }}>
                        Optional · JPG/PNG · max 5MB
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Submit ── */}
            <div style={{ marginTop: "1rem" }}>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      padding: "0.85rem 1rem",
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
                        width: 18, height: 18,
                        border: `2px solid ${T.border}`,
                        borderTop: `2px solid ${T.accent}`,
                        borderRadius: "50%",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: T.text }}>
                        {LOADING_STEPS[step]}
                      </div>
                      <div style={{ height: 3, borderRadius: 2, background: T.border, marginTop: 5 }}>
                        <motion.div
                          animate={{ width: `${((step + 1) / LOADING_STEPS.length) * 100}%` }}
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
                    whileHover={{ boxShadow: `0 4px 18px ${T.danger}50` }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      width: "100%",
                      padding: "0.85rem",
                      borderRadius: 10,
                      border: "none",
                      background: T.danger,
                      color: "#fff",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      letterSpacing: "-0.005em",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    Submit Rescue Request
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
