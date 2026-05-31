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
  { value: "critical", label: "Critical", desc: "Life-threatening", getColor: (T) => T.danger },
  { value: "high",     label: "High",     desc: "Urgent care needed", getColor: (T) => T.warning },
  { value: "medium",   label: "Medium",   desc: "Stable but injured", getColor: (T) => T.info },
  { value: "low",      label: "Low",      desc: "Observation needed", getColor: (T) => T.success },
];

const LOADING_STEPS = [
  "Validating emergency data…",
  "Connecting to rescue network…",
  "Creating rescue request…",
  "Notifying NGOs & volunteers…",
];

function FieldLabel({ children, required, optional }) {
  const { T } = useT();
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        fontSize: "0.7rem",
        fontWeight: 700,
        color: T.textMuted,
        marginBottom: "0.4rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      <span>{children}</span>
      {required && <span style={{ color: T.danger, fontSize: "0.8rem" }}>*</span>}
      {optional && <span style={{ color: T.textMuted, fontSize: "0.65rem", fontWeight: 500, textTransform: "none", letterSpacing: "0" }}>(Optional)</span>}
    </label>
  );
}

function SectionDivider({ label, icon, T }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.85rem 0 0.65rem",
      borderBottom: `1px solid ${T.borderLight}`,
      marginBottom: "0.85rem",
    }}>
      {icon}
      <span style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        color: T.textSub,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}>
        {label}
      </span>
    </div>
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

   
  const severity = watch("severity");

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [aiScanning, setAiScanning] = useState(false);
  const [step, setStep] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const scanImageWithAI = async (file) => {
    if (!user) return;

    setAiScanning(true);
    setErrorMsg("");
    setScanResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/ai/scan", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI scan failed");
      }

      setScanResult(data.data);

      // Auto-fill form fields
      if (data.data?.animal) {
        const animalType = ANIMAL_TYPES.find(
          (t) => t.toLowerCase() === data.data.animal.toLowerCase()
        ) || "Other";
        setValue("animalType", animalType, { shouldValidate: true });
      }

      if (data.data?.severity) {
        setValue("severity", data.data.severity, { shouldValidate: true });
      }

      if (data.data?.condition) {
        setValue("condition", data.data.condition, { shouldValidate: true });
      }

      if (data.data?.recommendation) {
        const currentNotes = watch("notes") || "";
        const aiNote = `AI Analysis: ${data.data.recommendation}`;
        setValue("notes", currentNotes ? `${currentNotes}\n\n${aiNote}` : aiNote);
      }

      // Auto-fetch location after successful scan
      fetchLocation();

    } catch (err) {
      console.error("AI scan error:", err);
      setErrorMsg(err.message || "Failed to analyze image. Please fill the form manually.");
    } finally {
      setAiScanning(false);
    }
  };

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

    // Trigger AI scan automatically
    scanImageWithAI(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (loading || aiScanning) return;

    const file = e.dataTransfer.files?.[0];
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

    // Trigger AI scan automatically
    scanImageWithAI(file);
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
        setScanResult(null);
        onSuccess?.(result.data);
      }, 1000);
    } else {
      setLoading(false);
      setErrorMsg(result.message || "Failed to submit rescue request.");
    }
  };

  const fieldErr = (k) => errors[k]?.message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: T.shadowCard,
        overflow: "hidden",
      }}
    >
      <div style={{
        padding: vp.mobile ? "1.25rem 1rem" : "1.5rem 1.75rem",
      }}>
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
                  <FieldLabel required>Severity Level</FieldLabel>
                  <div
                    role="radiogroup"
                    style={{
                      display: "grid",
                      gridTemplateColumns: vp.mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                      gap: "0.5rem",
                    }}
                  >
                    {SEVERITY_LEVELS.map(({ value, label, desc, getColor }) => {
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
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                            padding: "0.65rem 0.5rem",
                            borderRadius: "var(--radius-md)",
                            border: `2px solid ${active ? color : T.border}`,
                            background: active ? `${color}12` : T.bgCard,
                            cursor: loading ? "default" : "pointer",
                            transition: "all 0.18s ease",
                            fontFamily: "inherit",
                            position: "relative",
                            overflow: "hidden",
                          }}
                          onMouseEnter={(e) => {
                            if (!loading && !active) {
                              e.currentTarget.style.borderColor = `${color}60`;
                              e.currentTarget.style.background = `${color}08`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!loading && !active) {
                              e.currentTarget.style.borderColor = T.border;
                              e.currentTarget.style.background = T.bgCard;
                            }
                          }}
                        >
                          <div style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: color,
                            boxShadow: active ? `0 0 0 3px ${color}28` : "none",
                            transition: "box-shadow 0.18s ease",
                          }} />
                          <span style={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: active ? color : T.text,
                            transition: "color 0.18s ease",
                          }}>
                            {label}
                          </span>
                          <span style={{
                            fontSize: "0.62rem",
                            color: active ? color : T.textMuted,
                            textAlign: "center",
                            lineHeight: 1.3,
                            transition: "color 0.18s ease",
                          }}>
                            {desc}
                          </span>
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
                <FieldLabel optional>Evidence Photo</FieldLabel>
                <div
                  onClick={() => !loading && !aiScanning && fileRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  style={{
                    cursor: loading || aiScanning ? "default" : "pointer",
                    padding: imagePreview ? "0.5rem" : "1.25rem 0.75rem",
                    opacity: loading || aiScanning ? 0.6 : 1,
                    minHeight: vp.mobile ? 140 : 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    borderRadius: "var(--radius-md)",
                    border: `2px dashed ${dragActive ? T.accent : imagePreview ? T.border : T.borderLight}`,
                    background: dragActive ? T.accentPale : imagePreview ? T.bgCard : T.bgAlt,
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    style={{ display: "none" }}
                    disabled={loading || aiScanning}
                  />
                  {imagePreview ? (
                    <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxHeight: vp.mobile ? 120 : 180, maxWidth: "100%", borderRadius: 6, objectFit: "contain" }}
                      />
                      {!aiScanning && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setSelectedFile(null);
                            setScanResult(null);
                          }}
                          disabled={loading}
                          aria-label="Remove photo"
                          style={{
                            position: "absolute", top: 4, right: 4,
                            background: "rgba(0,0,0,0.7)", color: "#fff",
                            border: "none", borderRadius: "50%",
                            width: 24, height: 24, cursor: "pointer",
                            fontSize: "0.75rem", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            transition: "background 0.15s ease",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.85)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.7)"}
                        >✕</button>
                      )}
                    </div>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={dragActive ? T.accent : T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8, transition: "stroke 0.2s ease" }}>
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                        <circle cx="12" cy="13" r="3.5" />
                      </svg>
                      <div style={{ fontSize: "0.82rem", color: dragActive ? T.accent : T.text, fontWeight: 600, transition: "color 0.2s ease" }}>
                        {dragActive ? "Drop photo here" : "Click or drag photo"}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: T.textMuted, marginTop: 4, textAlign: "center", lineHeight: 1.4 }}>
                        JPG, PNG, WebP · Max 5MB
                      </div>
                    </>
                  )}
                </div>

                {/* AI Scanning Status */}
                {aiScanning && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.65rem 0.85rem",
                      borderRadius: 8,
                      background: T.accentPale,
                      border: `1px solid ${T.accentBorder || T.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: 14, height: 14,
                        border: `2px solid ${T.border}`,
                        borderTop: `2px solid ${T.accent}`,
                        borderRadius: "50%",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: T.text }}>
                        AI analyzing animal…
                      </div>
                      <div style={{ fontSize: "0.68rem", color: T.textMuted, marginTop: 2 }}>
                        Auto-filling form & fetching location
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* AI Scan Success */}
                {scanResult && !aiScanning && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.65rem 0.85rem",
                      borderRadius: 8,
                      background: T.successPale,
                      border: `1px solid ${T.successBorder}`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.65rem",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M9 12l2 2 4-4"/>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: T.success }}>
                        AI scan complete
                      </div>
                      <div style={{ fontSize: "0.68rem", color: T.textSub, marginTop: 2 }}>
                        Form auto-filled · Confidence: {scanResult.confidence}%
                      </div>
                    </div>
                  </motion.div>
                )}
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
                    Dispatch Rescue Request
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </form>
      </div>
    </motion.div>
  );
}
