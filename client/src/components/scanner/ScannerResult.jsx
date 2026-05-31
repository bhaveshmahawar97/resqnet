import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { Link } from "react-router-dom";
import { formatTime, getSeverityMeta } from "./scannerUtils";

function DiagnosticCard({ title, icon, children, T, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.bgCard,
        border: `1px solid ${accent ? `${accent}25` : T.border}`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: T.shadowSm,
        ...(accent ? { borderLeft: `3px solid ${accent}` } : {}),
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 1rem",
        borderBottom: `1px solid ${T.borderLight}`,
        background: T.bgAlt,
      }}>
        {icon}
        <span style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          color: accent || T.textMuted,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          {title}
        </span>
      </div>
      <div style={{ padding: "1rem" }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function ScannerResult({ result }) {
  const { T } = useT();

  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: T.bgCard,
          border: `2px dashed ${T.borderLight}`,
          borderRadius: "var(--radius-xl)",
          padding: "3rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "1rem",
        }}
      >
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "var(--radius-lg)",
          background: T.bgAlt,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: T.textMuted,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
            <circle cx="12" cy="12" r="3.5"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: T.text, marginBottom: "0.4rem" }}>
            Awaiting Analysis
          </div>
          <div style={{ fontSize: "0.82rem", color: T.textMuted, lineHeight: 1.6, maxWidth: 280 }}>
            Upload an animal photo and run the health scan. AI assessment results will appear here.
          </div>
        </div>
      </motion.div>
    );
  }

  const sevMeta = getSeverityMeta(result.severity);
  const sevLabel = sevMeta.label;
  const sevColor = sevMeta.color;

  const detectedIssues = Array.isArray(result.detectedIssues) ? result.detectedIssues
    : result.issues ? [result.issues]
    : result.condition ? [result.condition]
    : [];

  const isHighPriority = ["critical", "high"].includes(result.severity?.toLowerCase());
  const confidence = result.confidence != null ? result.confidence : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Animal Identification */}
      <DiagnosticCard
        title="Animal Identification"
        T={T}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
            <path d="M5 10a7 7 0 0 0 14 0"/>
            <path d="M12 17v5"/>
          </svg>
        }
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "1.15rem",
              fontWeight: 800,
              color: T.textHeading,
              letterSpacing: "-0.02em",
              marginBottom: "0.25rem",
            }}>
              {result.animal || result.species || "Unknown Animal"}
            </div>
            {result.breed && (
              <div style={{ fontSize: "0.8rem", color: T.textSub, marginBottom: "0.75rem" }}>
                {result.breed}
              </div>
            )}
            <div style={{ fontSize: "0.72rem", color: T.textMuted }}>
              Scanned: {formatTime(result.timestamp)}
            </div>
          </div>

          {/* Confidence Badge */}
          {confidence != null && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.35rem",
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `conic-gradient(${T.accent} ${confidence * 3.6}deg, ${T.borderLight} 0deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: T.bgCard,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  color: T.accent,
                }}>
                  {confidence}%
                </div>
              </div>
              <span style={{ fontSize: "0.68rem", color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Confidence
              </span>
            </div>
          )}
        </div>
      </DiagnosticCard>

      {/* Severity Assessment */}
      <DiagnosticCard
        title="Health Assessment"
        accent={sevColor}
        T={T}
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sevColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{
            padding: "0.65rem 1.25rem",
            borderRadius: "var(--radius-md)",
            background: `${sevColor}12`,
            border: `2px solid ${sevColor}`,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: sevColor,
              boxShadow: `0 0 0 3px ${sevColor}30`,
            }} />
            <span style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: sevColor,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
            }}>
              {sevLabel}
            </span>
          </div>
        </div>

        <div style={{
          padding: "0.85rem 1rem",
          borderRadius: "var(--radius-md)",
          background: T.bgAlt,
          border: `1px solid ${T.borderLight}`,
        }}>
          <div style={{ fontSize: "0.82rem", color: T.text, lineHeight: 1.65 }}>
            {isHighPriority
              ? "⚠️ Immediate veterinary attention required. Contact the nearest rescue partner or emergency vet clinic."
              : "Monitor the animal's condition. Seek professional assistance if symptoms worsen or new issues appear."}
          </div>
        </div>
      </DiagnosticCard>

      {/* Detected Issues */}
      {detectedIssues.length > 0 && (
        <DiagnosticCard
          title="Detected Conditions"
          accent={sevColor}
          T={T}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sevColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {detectedIssues.map((issue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-sm)",
                  background: T.bgAlt,
                  border: `1px solid ${T.borderLight}`,
                }}
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: sevColor,
                  flexShrink: 0,
                  marginTop: "0.35rem",
                }} />
                <span style={{ fontSize: "0.82rem", color: T.text, lineHeight: 1.6, flex: 1 }}>
                  {issue}
                </span>
              </motion.div>
            ))}
          </div>
        </DiagnosticCard>
      )}

      {/* Emergency CTA for high/critical */}
      {isHighPriority && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/ngos"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              borderRadius: "var(--radius-lg)",
              border: `2px solid ${T.danger}`,
              background: `${T.danger}08`,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${T.danger}12`;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 4px 16px ${T.danger}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${T.danger}08`;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.danger, marginBottom: "0.25rem" }}>
                Find Rescue Partners
              </div>
              <div style={{ fontSize: "0.75rem", color: T.danger, opacity: 0.85 }}>
                This case requires immediate professional attention
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.danger} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
