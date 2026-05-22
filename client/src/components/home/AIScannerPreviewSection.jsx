import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import Label from "../ui/Label";
import Button from "../ui/Button";
import { uploadToCloudinary, scanAnimal } from "../../services/aiService";
import { SEVERITY_COLOR } from "../../constants/ui";

const STEPS = [
  { icon: "📷", label: "Upload photo", desc: "Any angle, any lighting" },
  { icon: "🔬", label: "AI analysis", desc: "Multi-model assessment" },
  { icon: "📋", label: "Get report", desc: "Severity + care plan" },
];

export default function AIScannerPreviewSection() {
  const { T } = useT();
  const fileRef = useRef(null);

  const [phase, setPhase] = useState("idle"); // idle | uploading | scanning | done | error
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
    setPhase("uploading");
    setResult(null);
    setErrorMsg("");

    try {
      const imageUrl = await uploadToCloudinary(file);
      setPhase("scanning");
      const scanResult = await scanAnimal(imageUrl, file.name);
      setResult(scanResult);
      setPhase("done");
    } catch (err) {
      setErrorMsg(err?.message || "Scan failed. Please try again.");
      setPhase("error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleReset = () => {
    setPhase("idle");
    setPreview(null);
    setResult(null);
    setErrorMsg("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const severityColor = result?.severity
    ? SEVERITY_COLOR[result.severity] || SEVERITY_COLOR.info
    : T.accent;

  return (
    <section
      id="ai-scanner"
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 7vw, 5.5rem) 0",
        background: T.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BG accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-8vw",
          bottom: "5%",
          width: "32vw",
          height: "32vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${T.accentPale} 0%, transparent 70%)`,
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
            alignItems: "center",
          }}
        >
          {/* Left: info */}
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={vFadeUp}
            viewport={{ once: true }}
          >
            <Label>AI Health Scanner</Label>
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
              Instant triage with
              <br />
              <span
                style={{
                  background: `linear-gradient(100deg, ${T.accent}, ${T.accentDim})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI diagnostics.
              </span>
            </h2>
            <p
              style={{
                fontSize: "clamp(0.82rem, 1.6vw, 0.95rem)",
                color: T.textSub,
                lineHeight: 1.7,
                marginBottom: "1.75rem",
                maxWidth: 420,
              }}
            >
              Upload a photo of an injured or ill animal. Our AI assesses
              condition severity, priority level, and generates a care
              recommendation — in seconds.
            </p>

            {/* How it works */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.label}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={vFadeUp}
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: T.accentPale,
                      border: `1px solid ${T.accentGlow}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: T.text }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: "0.73rem", color: T.textSub }}>
                      {s.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: "1.75rem" }}>
              <Link to="/scanner">
                <Button variant="primary" size="md">
                  Open Full Scanner →
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: inline scanner widget */}
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={vFadeUp}
            viewport={{ once: true }}
            custom={1}
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
              {/* Widget header */}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: T.accent,
                      animation: phase === "scanning" ? "pulse 1.2s infinite" : "none",
                    }}
                  />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: T.text }}>
                    ResQNet AI Scanner
                  </span>
                </div>
                {phase !== "idle" && (
                  <button
                    onClick={handleReset}
                    style={{
                      fontSize: "0.72rem",
                      color: T.textMuted,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.2rem 0.5rem",
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Drop zone / result area */}
              <div style={{ padding: "1.25rem" }}>
                {phase === "idle" && (
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    style={{
                      border: `2px dashed ${T.accentGlow}`,
                      borderRadius: 14,
                      padding: "2.5rem 1.5rem",
                      textAlign: "center",
                      cursor: "pointer",
                      background: T.accentPale,
                      transition: "border-color 0.2s",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>🐾</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: T.text }}>
                      Drop a photo or click to upload
                    </div>
                    <div style={{ fontSize: "0.72rem", color: T.textSub, marginTop: "0.3rem" }}>
                      JPG, PNG, WebP — max 8MB
                    </div>
                  </div>
                )}

                {(phase === "uploading" || phase === "scanning") && (
                  <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    {preview && (
                      <img
                        src={preview}
                        alt="preview"
                        style={{
                          width: "100%",
                          maxHeight: 160,
                          objectFit: "cover",
                          borderRadius: 10,
                          marginBottom: "1rem",
                          opacity: 0.7,
                        }}
                      />
                    )}
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: T.text }}>
                      {phase === "uploading" ? "Uploading image…" : "Analysing with AI…"}
                    </div>
                    <div
                      style={{
                        marginTop: "0.75rem",
                        height: 4,
                        background: T.bgAlt,
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                          width: "50%",
                          height: "100%",
                          background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {phase === "done" && result && (
                  <div>
                    {preview && (
                      <img
                        src={preview}
                        alt="scanned"
                        style={{
                          width: "100%",
                          maxHeight: 140,
                          objectFit: "cover",
                          borderRadius: 10,
                          marginBottom: "0.9rem",
                        }}
                      />
                    )}
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                      <span
                        style={{
                          padding: "0.22rem 0.7rem",
                          borderRadius: 20,
                          background: severityColor + "22",
                          border: `1px solid ${severityColor}44`,
                          color: severityColor,
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {result.severity || "unknown"} severity
                      </span>
                      {result.animal && (
                        <span
                          style={{
                            padding: "0.22rem 0.7rem",
                            borderRadius: 20,
                            background: T.bgAlt,
                            border: `1px solid ${T.border}`,
                            color: T.textSub,
                            fontSize: "0.68rem",
                            fontWeight: 600,
                          }}
                        >
                          {result.animal}
                        </span>
                      )}
                      {result.confidence > 0 && (
                        <span
                          style={{
                            padding: "0.22rem 0.7rem",
                            borderRadius: 20,
                            background: T.bgAlt,
                            border: `1px solid ${T.border}`,
                            color: T.textSub,
                            fontSize: "0.68rem",
                            fontWeight: 600,
                          }}
                        >
                          {result.confidence}% confidence
                        </span>
                      )}
                    </div>
                    {result.condition && (
                      <div style={{ fontSize: "0.82rem", color: T.text, fontWeight: 600, marginBottom: "0.3rem" }}>
                        {result.condition}
                      </div>
                    )}
                    {result.recommendation && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: T.textSub,
                          lineHeight: 1.65,
                          borderLeft: `2px solid ${T.accentGlow}`,
                          paddingLeft: "0.6rem",
                        }}
                      >
                        {result.recommendation}
                      </div>
                    )}
                    <div style={{ marginTop: "0.9rem" }}>
                      <Link to="/scanner">
                        <Button variant="outline" size="sm" style={{ width: "100%" }}>
                          Full Report →
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {phase === "error" && (
                  <div
                    style={{
                      padding: "1.5rem",
                      textAlign: "center",
                      color: "#E53935",
                      fontSize: "0.82rem",
                      lineHeight: 1.6,
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⚠️</div>
                    {errorMsg || "Something went wrong. Please try again."}
                    <div style={{ marginTop: "0.75rem" }}>
                      <Button variant="ghost" size="sm" onClick={handleReset}>
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </section>
  );
}
