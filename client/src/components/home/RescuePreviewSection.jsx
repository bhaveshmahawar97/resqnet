import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import Label from "../ui/Label";
import Button from "../ui/Button";
import { createRescue } from "../../services/rescueService";
import { reverseGeocode } from "../../utils/geo";
import { SEVERITY_COLOR } from "../../constants/ui";

const ANIMAL_TYPES = ["Dog", "Cat", "Bird", "Cow", "Other"];
const SEVERITY_OPTS = ["low", "moderate", "high", "critical"];

const SEVERITY_LABEL = {
  low: "Low — Stable condition",
  moderate: "Moderate — Needs attention",
  high: "High — Urgent care",
  critical: "Critical — Life threatening",
};

export default function RescuePreviewSection() {
  const { T } = useT();

  const [form, setForm] = useState({
    animalType: "",
    severity: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | submitting | done | error
  const [errorMsg, setErrorMsg] = useState("");

  const isValid =
    form.animalType.trim() &&
    form.severity.trim() &&
    form.description.trim() &&
    (form.address.trim() || (form.latitude && form.longitude));

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setForm((f) => ({ ...f, image: file }));
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported in this browser.");
      return;
    }

    setLocationStatus("Fetching current location…");
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const location = await reverseGeocode({ latitude, longitude });
          setForm((f) => ({
            ...f,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            address: location?.displayName ||
              `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`,
          }));
          setLocationStatus("Location detected and filled.");
        } catch (err) {
          setLocationStatus("Could not determine location name.");
          setForm((f) => ({
            ...f,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            address: `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`,
          }));
          setErrorMsg(err.message || "Reverse geocoding failed.");
        }
      },
      (error) => {
        setLocationStatus("Unable to retrieve location.");
        setErrorMsg(error.message || "Location permission denied.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setPhase("submitting");
    setErrorMsg("");

    const rescuePayload = new FormData();
    rescuePayload.append("animalType", form.animalType);
    rescuePayload.append("severity", form.severity);
    rescuePayload.append("description", form.description);
    rescuePayload.append(
      "condition",
      form.description || `${form.severity} severity case`
    );
    if (form.address.trim()) rescuePayload.append("address", form.address.trim());
    if (form.latitude) rescuePayload.append("latitude", form.latitude);
    if (form.longitude) rescuePayload.append("longitude", form.longitude);
    if (form.image) rescuePayload.append("images", form.image);

    const result = await createRescue(rescuePayload);

    if (result.success) {
      setPhase("done");
    } else {
      setErrorMsg(result.message || "Failed to submit. Please try again.");
      setPhase("error");
    }
  };

  const field = (label, key, placeholder, type = "text") => (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.72rem",
          fontWeight: 700,
          color: T.textSub,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "0.4rem",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        style={{
          width: "100%",
          padding: "0.65rem 0.85rem",
          background: T.bgAlt,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          color: T.text,
          fontSize: "0.88rem",
          fontFamily: "inherit",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );

  return (
    <section
      id="rescue"
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 7vw, 5.5rem) 0",
        background: T.bgAlt,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BG accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-5vw",
          top: "20%",
          width: "28vw",
          height: "28vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(2rem, 5vw, 4rem)",
            alignItems: "start",
          }}
        >
          {/* Right: form (visually first on desktop) */}
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={vFadeUp}
            viewport={{ once: true }}
            style={{ order: 1 }}
          >
            <div
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 22,
                overflow: "hidden",
                boxShadow: `0 8px 40px ${T.shadow}`,
              }}
            >
              {/* Card header */}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: `1px solid ${T.border}`,
                  background: "rgba(220,38,38,0.04)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1rem" }}>🚨</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: T.text }}>
                  Quick Rescue Report
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.62rem",
                    color: T.textMuted,
                    background: T.bgAlt,
                    padding: "0.18rem 0.5rem",
                    borderRadius: 8,
                  }}
                >
                  ~60 seconds
                </span>
              </div>

              <div style={{ padding: "1.25rem" }}>
                {phase === "done" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: "center", padding: "1.5rem 0" }}
                  >
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: T.text,
                        marginBottom: "0.5rem",
                      }}
                    >
                      Rescue request submitted!
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: T.textSub,
                        lineHeight: 1.65,
                        marginBottom: "1.25rem",
                      }}
                    >
                      NGOs in your area have been notified. You can track
                      the status from your dashboard.
                    </div>
                    <Link to="/rescue">
                      <Button variant="outline" size="sm">
                        View Full Rescue Page
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                    {/* Animal type */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: T.textSub,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Animal Type
                      </label>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        {ANIMAL_TYPES.map((t) => (
                          <button
                            key={t}
                            onClick={() => setForm((f) => ({ ...f, animalType: t }))}
                            style={{
                              padding: "0.3rem 0.75rem",
                              borderRadius: 20,
                              border: `1px solid ${form.animalType === t ? T.accent : T.border}`,
                              background:
                                form.animalType === t ? T.accentPale : T.bgAlt,
                              color:
                                form.animalType === t ? T.accent : T.textSub,
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              transition: "all 0.15s",
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Severity */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: T.textSub,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Severity
                      </label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        {SEVERITY_OPTS.map((s) => {
                          const clr = SEVERITY_COLOR[s];
                          const selected = form.severity === s;
                          return (
                            <button
                              key={s}
                              onClick={() => setForm((f) => ({ ...f, severity: s }))}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.6rem",
                                padding: "0.55rem 0.75rem",
                                borderRadius: 10,
                                border: `1px solid ${selected ? clr + "55" : T.border}`,
                                background: selected ? clr + "11" : T.bgAlt,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                textAlign: "left",
                                transition: "all 0.15s",
                              }}
                            >
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: clr,
                                  flexShrink: 0,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: "0.78rem",
                                  fontWeight: selected ? 700 : 500,
                                  color: selected ? clr : T.textSub,
                                }}
                              >
                                {SEVERITY_LABEL[s]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: T.textSub,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Location / Address
                      </label>
                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                        <input
                          type="text"
                          value={form.address}
                          placeholder="e.g. Near Sarojini Nagar, Delhi"
                          onChange={(e) =>
                            setForm((f) => ({ ...f, address: e.target.value }))
                          }
                          style={{
                            flex: 1,
                            minWidth: "220px",
                            padding: "0.65rem 0.85rem",
                            background: T.bgAlt,
                            border: `1px solid ${T.border}`,
                            borderRadius: 10,
                            color: T.text,
                            fontSize: "0.88rem",
                            fontFamily: "inherit",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleUseLocation}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Use current location
                        </Button>
                      </div>
                      {locationStatus && (
                        <div
                          style={{
                            marginTop: "0.65rem",
                            fontSize: "0.78rem",
                            color: T.textSub,
                          }}
                        >
                          {locationStatus}
                        </div>
                      )}
                    </div>

                    {/* Image upload */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: T.textSub,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Photo (optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.85rem",
                          background: T.bgAlt,
                          border: `1px solid ${T.border}`,
                          borderRadius: 10,
                          color: T.text,
                          fontSize: "0.88rem",
                          fontFamily: "inherit",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                      {previewImage && (
                        <div
                          style={{
                            marginTop: "0.9rem",
                            borderRadius: 16,
                            overflow: "hidden",
                            background: T.bgCard,
                            border: `1px solid ${T.border}`,
                            maxWidth: 320,
                          }}
                        >
                          <img
                            src={previewImage}
                            alt="Preview"
                            style={{ width: "100%", display: "block" }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: T.textSub,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Brief description
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, description: e.target.value }))
                        }
                        placeholder="Describe the animal's condition…"
                        rows={2}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.85rem",
                          background: T.bgAlt,
                          border: `1px solid ${T.border}`,
                          borderRadius: 10,
                          color: T.text,
                          fontSize: "0.88rem",
                          fontFamily: "inherit",
                          outline: "none",
                          resize: "vertical",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {phase === "error" && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#E53935",
                          padding: "0.5rem 0.75rem",
                          background: "rgba(229,57,53,0.08)",
                          borderRadius: 8,
                          border: "1px solid rgba(229,57,53,0.2)",
                        }}
                      >
                        {errorMsg}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleSubmit}
                        style={{
                          flex: 1,
                          opacity: isValid && phase !== "submitting" ? 1 : 0.5,
                          cursor: isValid && phase !== "submitting" ? "pointer" : "not-allowed",
                        }}
                      >
                        {phase === "submitting" ? "Submitting…" : "Submit Rescue Request"}
                      </Button>
                      <Link to="/rescue">
                        <Button variant="ghost" size="md">
                          Full Form
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Left: info */}
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={vFadeUp}
            viewport={{ once: true }}
            style={{ order: 0 }}
          >
            <Label>Emergency Rescue</Label>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                color: T.text,
                margin: "0.4rem 0 0.75rem",
                lineHeight: 1.15,
              }}
            >
              Report an animal in
              <br />
              <span
                style={{
                  background: `linear-gradient(100deg, #E53935, #EA580C)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                distress. Right now.
              </span>
            </h2>
            <p
              style={{
                fontSize: "clamp(0.82rem, 1.6vw, 0.95rem)",
                color: T.textSub,
                lineHeight: 1.7,
                marginBottom: "1.75rem",
                maxWidth: 400,
              }}
            >
              Our platform instantly routes your report to the nearest
              available NGO and rescue volunteers — reducing response time
              by up to 60%.
            </p>

            {/* Key metrics */}
            {[
              { icon: "⚡", label: "Avg. NGO response", value: "18 min" },
              { icon: "🗺️", label: "Coverage area", value: "Nationwide" },
              { icon: "🤝", label: "Active volunteers", value: "2,400+" },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: "1rem" }}>{m.icon}</span>
                  <span style={{ fontSize: "0.82rem", color: T.textSub }}>{m.label}</span>
                </div>
                <span
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    color: T.text,
                  }}
                >
                  {m.value}
                </span>
              </div>
            ))}

            <div style={{ marginTop: "1.25rem" }}>
              <Link to="/rescue">
                <Button variant="ghost" size="sm">
                  View All Rescue Activity →
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
