import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";

const STAGES = ["Uploading", "Processing", "Analyzing", "Complete"];

export default function ScannerLoader({ label = "Analyzing…" }) {
  const { T } = useT();

  const activeStage = label.toLowerCase().includes("upload") ? 0
    : label.toLowerCase().includes("process") ? 1
    : label.toLowerCase().includes("analyz") ? 2
    : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "1.5rem",
        borderRadius: 12,
        border: `1px solid ${T.border}`,
        background: T.bgCard,
        display: "flex",
        flexDirection: "column",
        gap: "1.1rem",
      }}
    >
      {/* Stage label */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: 18,
            height: 18,
            border: `2.5px solid ${T.border}`,
            borderTopColor: T.accent,
            borderRadius: "50%",
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: T.text }}>{label}</span>
      </div>

      {/* Stage progress */}
      <div style={{ display: "flex", gap: "0.35rem" }}>
        {STAGES.map((stage, i) => (
          <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <div
              style={{
                height: 3,
                borderRadius: 2,
                background: i <= activeStage ? T.accent : T.border,
                transition: "background 0.3s",
              }}
            />
            <span
              style={{
                fontSize: "0.6rem",
                color: i <= activeStage ? T.accent : T.textMuted,
                fontWeight: i === activeStage ? 700 : 400,
                textAlign: "center",
              }}
            >
              {stage}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
