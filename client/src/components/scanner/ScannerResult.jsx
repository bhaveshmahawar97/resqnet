import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { formatTime, getSeverityMeta } from "./scannerUtils";
import SeverityBadge from "./SeverityBadge";

/**
 * ScannerResult - AI analysis result display
 * Shows severity badge, condition info, and analysis metadata
 */
export default function ScannerResult({ result }) {
  const { T } = useT();

  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          borderRadius: 24,
          border: `1px solid ${T.border}`,
          background: T.bgCard,
          padding: "1.5rem",
          minHeight: 320,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.92rem", color: T.textMuted, marginBottom: "0.4rem" }}>
              AI Scan Summary
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: T.text }}>
              Awaiting scan
            </div>
          </div>
          <div
            style={{
              borderRadius: 999,
              padding: "0.5rem 0.85rem",
              background: T.bgAlt,
              color: T.textMuted,
              fontWeight: 700,
              fontSize: "0.88rem",
              alignSelf: "center",
            }}
          >
            No result
          </div>
        </div>

        <div style={{ flex: 1, display: "grid", gap: "0.9rem", marginTop: "1rem" }}>
          <div style={{ color: T.textMuted, lineHeight: 1.6 }}>
            The scanner will show AI severity, condition, recommendation, and confidence once a
            successful analysis completes.
          </div>
        </div>
      </motion.div>
    );
  }

  const severity = getSeverityMeta(result.severity || "unknown");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        borderRadius: 24,
        border: `1px solid ${T.border}`,
        background: T.bgCard,
        padding: "1.5rem",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.92rem", color: T.textMuted, marginBottom: "0.4rem" }}>
            AI Scan Summary
          </div>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: T.text }}>
            Analysis complete
          </div>
        </div>
        <SeverityBadge severity={result.severity || "unknown"} />
      </div>

      <div style={{ flex: 1, display: "grid", gap: "0.9rem", marginTop: "1rem" }}>
        <div style={{ color: T.textMuted, lineHeight: 1.8 }}>
          <strong style={{ color: T.text }}>Species:</strong> {result.animal || "Unknown"}
        </div>
        <div style={{ color: T.textMuted, lineHeight: 1.8 }}>
          <strong style={{ color: T.text }}>Condition:</strong> {result.condition || "Not available"}
        </div>
        <div style={{ color: T.textMuted, lineHeight: 1.8 }}>
          <strong style={{ color: T.text }}>Priority:</strong> {result.priority || "Normal"}
        </div>
        <div style={{ color: T.textMuted, lineHeight: 1.8 }}>
          <strong style={{ color: T.text }}>Confidence:</strong> {result.confidence ?? "—"}%
        </div>
        <div style={{ color: T.textMuted, lineHeight: 1.8 }}>
          <strong style={{ color: T.text }}>Scanned:</strong> {formatTime(result.timestamp)}
        </div>
      </div>
    </motion.div>
  );
}
