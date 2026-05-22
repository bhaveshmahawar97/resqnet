import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Label from "../ui/Label";
import Button from "../ui/Button";
import { vFadeUp } from "../../animations/variants";
import { validateImageFile } from "../scanner/scannerUtils";

const SCAN_STEPS = [
  { label: "Initializing vision model…", duration: 600 },
  { label: "Detecting species…", duration: 900 },
  { label: "Estimating breed…", duration: 700 },
  { label: "Scanning for injuries…", duration: 1100 },
  { label: "Calculating urgency score…", duration: 800 },
  { label: "Generating rescue plan…", duration: 600 },
];

const MOCK_RESULTS = [
  {
    species: "Canis lupus familiaris",
    commonName: "Dog",
    breed: "Indian Pariah (Indie) — 87% confidence",
    injuries: ["Laceration on left forelimb", "Signs of dehydration", "Possible rib bruising"],
    urgency: 82,
    urgencyLabel: "HIGH",
    urgencyColor: "#F97316",
    priority: "Immediate veterinary care required",
    actions: ["Apply pressure to wound", "Do not move unnecessarily", "Keep animal calm", "Dispatch vet team ASAP"],
  },
  {
    species: "Felis catus",
    commonName: "Cat",
    breed: "Domestic Shorthair — 92% confidence",
    injuries: ["Respiratory distress", "Appears malnourished"],
    urgency: 65,
    urgencyLabel: "MODERATE",
    urgencyColor: "#EAB308",
    priority: "Care needed within 2 hours",
    actions: ["Keep in warm place", "Offer small amounts of water", "Avoid loud noises", "Transport to shelter"],
  },
  {
    species: "Bos taurus",
    commonName: "Cow",
    breed: "Haryana breed — 78% confidence",
    injuries: ["Road accident trauma", "Fracture suspected — right rear leg"],
    urgency: 94,
    urgencyLabel: "CRITICAL",
    urgencyColor: "#EF4444",
    priority: "Life-threatening — dispatch immediately",
    actions: ["Block traffic around animal", "Do NOT attempt to move", "Call large-animal vet", "NGO dispatch in progress"],
  },
];

export default function AIScanner({ id }) {
  const { T } = useT();
  const vp = useViewport();
  const fileRef = useRef();
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(-1);
  const [result, setResult] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      // show friendly error and abort
      setResult(null);
      setImage(null);
      alert(validation.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => { setImage(ev.target.result); setResult(null); };
    reader.readAsDataURL(file);
  };

  const handleScan = () => {
    if (!image) return;
    setScanning(true);
    setScanStep(0);
    setResult(null);
    let i = 0;
    const runStep = () => {
      if (i >= SCAN_STEPS.length) {
        setScanning(false);
        setScanStep(-1);
        setResult(MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)]);
        return;
      }
      setScanStep(i);
      setTimeout(() => { i++; runStep(); }, SCAN_STEPS[i]?.duration ?? 700);
    };
    runStep();
  };

  return (
    <section
      id={id}
      style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bgAlt, position: "relative", overflow: "hidden" }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`,
          backgroundSize: "80px 80px", pointerEvents: "none",
        }}
      />
      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)", position: "relative", zIndex: 1 }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp} style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>AI Emergency Scanner</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: "0 0 0.75rem" }}>
            Upload. Scan.{" "}
            <span style={{ background: `linear-gradient(100deg, ${T.accent} 0%, ${T.accentDim} 60%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Know Instantly.
            </span>
          </h2>
          <p style={{ color: T.textSub, fontSize: "clamp(0.88rem, 2vw, 1rem)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Our computer vision model analyzes animal photos to detect species, estimate breed, identify injuries, and calculate rescue urgency in seconds.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr", gap: "2rem", alignItems: "start" }}>
          {/* Upload panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ background: T.bgCard, borderRadius: 18, border: `1px solid ${T.border}`, padding: "1.75rem", boxShadow: `0 4px 24px ${T.shadow}` }}
          >
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${T.border}`,
                borderRadius: 12,
                padding: "1.5rem",
                textAlign: "center",
                cursor: "pointer",
                marginBottom: "1.25rem",
                transition: "border-color 0.2s",
                background: image ? "transparent" : T.bgAlt,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
            >
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImage} style={{ display: "none" }} />
              {image ? (
                <div style={{ position: "relative" }}>
                  <img src={image} alt="Upload" style={{ maxHeight: 220, borderRadius: 10, margin: "0 auto", objectFit: "contain" }} />
                  {scanning && (
                    <motion.div
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        position: "absolute", inset: 0, borderRadius: 10,
                        background: `linear-gradient(135deg, rgba(46,210,130,0.15) 0%, rgba(46,210,130,0.05) 100%)`,
                        border: `2px solid ${T.accent}`,
                      }}
                    />
                  )}
                  {/* Scanning lines */}
                  {scanning && (
                    <motion.div
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{
                        position: "absolute", left: 0, right: 0, height: 2,
                        background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
                        boxShadow: `0 0 8px ${T.accent}`,
                      }}
                    />
                  )}
                </div>
              ) : (
                <>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔬</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: T.text }}>Upload Animal Photo</div>
                  <div style={{ fontSize: "0.75rem", color: T.textMuted, marginTop: 4 }}>JPG, PNG — clear photo works best</div>
                </>
              )}
            </div>

            {/* Scan progress */}
            <AnimatePresence>
              {scanning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginBottom: "1rem", overflow: "hidden" }}
                >
                  {SCAN_STEPS.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0" }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, background: i < scanStep ? T.accent : i === scanStep ? "transparent" : T.border, border: i === scanStep ? `2px solid ${T.accent}` : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {i === scanStep && (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 8, height: 8, borderRadius: "50%", border: `1.5px solid ${T.accent}`, borderTop: "1.5px solid transparent" }} />
                        )}
                        {i < scanStep && <span style={{ fontSize: "0.6rem", color: "#fff" }}>✓</span>}
                      </div>
                      <span style={{ fontSize: "0.78rem", color: i <= scanStep ? T.text : T.textMuted, fontWeight: i === scanStep ? 600 : 400, transition: "color 0.3s" }}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: "flex", gap: "0.6rem" }}>
              <Button
                variant="primary"
                onClick={handleScan}
                style={{ flex: 1, opacity: !image || scanning ? 0.5 : 1, pointerEvents: !image || scanning ? "none" : "auto" }}
              >
                {scanning ? "Scanning…" : "🤖 Run AI Scan"}
              </Button>
              {image && (
                <Button variant="ghost" onClick={() => { setImage(null); setResult(null); }}>
                  Clear
                </Button>
              )}
            </div>
          </motion.div>

          {/* Results panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {!result && !scanning ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: T.bgCard, borderRadius: 18, border: `1px solid ${T.border}`,
                    padding: "2rem", textAlign: "center", minHeight: 280, display: "flex",
                    flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                  }}
                >
                  <div style={{ fontSize: "3rem" }}>🧠</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: T.text }}>AI Analysis Ready</div>
                  <div style={{ fontSize: "0.82rem", color: T.textMuted, lineHeight: 1.6 }}>
                    Upload a photo and run the AI scan to get instant species detection, breed estimation, injury assessment, and rescue priority.
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ background: T.bgCard, borderRadius: 18, border: `1px solid ${T.border}`, padding: "1.75rem", boxShadow: `0 4px 24px ${T.shadow}` }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 3 }}>AI ANALYSIS COMPLETE</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: T.text }}>{result.commonName}</div>
                      <div style={{ fontSize: "0.78rem", color: T.textMuted, fontStyle: "italic" }}>{result.species}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", marginBottom: 3 }}>URGENCY</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 900, color: result.urgencyColor, letterSpacing: "-0.04em" }}>{result.urgency}%</div>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: result.urgencyColor, background: `${result.urgencyColor}22`, padding: "2px 8px", borderRadius: 20 }}>
                        {result.urgencyLabel}
                      </div>
                    </div>
                  </div>

                  {/* Urgency bar */}
                  <div style={{ height: 6, borderRadius: 3, background: T.border, marginBottom: "1.25rem" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.urgency}%` }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${result.urgencyColor}, ${result.urgencyColor}99)` }}
                    />
                  </div>

                  {/* Breed */}
                  <div style={{ marginBottom: "1rem", padding: "0.75rem", borderRadius: 8, background: T.bgAlt, border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em", marginBottom: 3 }}>BREED ESTIMATE</div>
                    <div style={{ fontSize: "0.85rem", color: T.text, fontWeight: 600 }}>{result.breed}</div>
                  </div>

                  {/* Injuries */}
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em", marginBottom: "0.5rem" }}>DETECTED CONDITIONS</div>
                    {result.injuries.map((inj, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0", borderBottom: i < result.injuries.length - 1 ? `1px solid ${T.border}` : "none" }}
                      >
                        <span style={{ color: result.urgencyColor, fontSize: "0.8rem" }}>⚠</span>
                        <span style={{ fontSize: "0.82rem", color: T.text }}>{inj}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Priority */}
                  <div style={{ padding: "0.75rem", borderRadius: 8, background: `${result.urgencyColor}12`, border: `1px solid ${result.urgencyColor}33`, marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: result.urgencyColor, letterSpacing: "0.08em", marginBottom: 3 }}>RECOMMENDED ACTION</div>
                    <div style={{ fontSize: "0.85rem", color: T.text, fontWeight: 600 }}>{result.priority}</div>
                  </div>

                  {/* Action steps */}
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em", marginBottom: "0.5rem" }}>IMMEDIATE STEPS</div>
                    {result.actions.map((a, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", padding: "0.25rem 0" }}
                      >
                        <span style={{ color: T.accent, fontWeight: 700, fontSize: "0.8rem", flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                        <span style={{ fontSize: "0.82rem", color: T.textSub }}>{a}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
