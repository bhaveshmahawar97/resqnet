import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";

export default function AnalysisReportModal({ scanData, onClose }) {
  const { T } = useT();
  if (!scanData) return null;

  const severityColors = {
    low: T.success,
    medium: T.warning,
    high: T.danger,
    critical: T.danger
  };

  const severityColor = severityColors[scanData.severity] || T.accent;
  const analysis = scanData.analysis || {};
  const triageSteps = analysis.triageSteps || [
    "Ensure your own safety first before approaching the animal.",
    "Observe from a distance to assess behavior and injuries.",
    "Do not offer food or water immediately unless instructed by a professional.",
    "Contact local rescue authorities or wait for the assigned NGO."
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: T.bgCard,
            borderRadius: 20,
            width: "100%",
            maxWidth: 600,
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: T.shadowLg,
            border: `1px solid ${T.border}`,
            position: "relative",
          }}
        >
          {/* Header */}
          <div style={{ padding: "1.5rem", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.bgAlt, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentPale, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: T.textHeading }}>AI Analysis Report</h2>
                <span style={{ fontSize: "0.75rem", color: T.textMuted }}>ID: {scanData._id || scanData.id || "Unknown"}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: T.bgCard, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div style={{ padding: "1.5rem" }}>
            {scanData.imageUrl && (
              <img src={scanData.imageUrl} alt="Scan subject" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12, marginBottom: "1.5rem" }} />
            )}

            {/* Core Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ padding: "1rem", borderRadius: 12, border: `1px solid ${T.border}`, background: T.bgAlt }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Detected Species</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: T.textHeading }}>{analysis.animalType || scanData.animalType || "Unknown"}</div>
              </div>
              <div style={{ padding: "1rem", borderRadius: 12, borderTop: `1px solid ${T.border}`, borderRight: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, background: T.bgAlt, borderLeft: `4px solid ${severityColor}` }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Severity Assessment</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: 800, color: severityColor, textTransform: "capitalize" }}>{scanData.severity || "Unknown"}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: T.textMuted }}>Score: {scanData.aiScore || analysis.confidenceScore || 0}</span>
                </div>
              </div>
            </div>

            {/* Observations */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: T.textHeading, margin: "0 0 0.75rem 0", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Condition Observations
              </h3>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: T.text, margin: 0, padding: "1rem", background: T.bgAlt, borderRadius: 12, border: `1px solid ${T.border}` }}>
                {analysis.condition || scanData.description || "No detailed condition description provided by the analysis engine."}
              </p>
            </div>

            {/* Triage Steps */}
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: T.textHeading, margin: "0 0 0.75rem 0", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Recommended Triage Steps
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {triageSteps.map((step, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "1rem", borderRadius: 12, background: T.bgCard, border: `1px solid ${T.border}`, boxShadow: T.shadowSm }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: T.accentPale, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>
                      {idx + 1}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: T.text, lineHeight: 1.5, paddingTop: 2 }}>{step}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
