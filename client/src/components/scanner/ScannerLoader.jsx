import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";

export default function ScannerLoader({ label = "Loading…" }) {
  const { T } = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        padding: "1.5rem",
        borderRadius: 20,
        border: `1px solid ${T.border}`,
        background: T.bgCard,
        color: T.textMuted,
      }}
    >
      <div style={{ fontWeight: 700, color: T.text, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.12 }}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: T.accent,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
