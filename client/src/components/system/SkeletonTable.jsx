import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";

export default function SkeletonTable({ rows = 3 }) {
  const { T } = useT();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderBottom: `1px solid ${T.border}`,
            position: "relative",
            overflow: "hidden",
            background: T.bgCard,
          }}
        >
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              background: `linear-gradient(90deg, transparent, ${T.border}80, transparent)`,
            }}
          />
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.border, opacity: 0.5, flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ height: 12, width: "40%", background: T.border, borderRadius: 4, opacity: 0.5 }} />
            <div style={{ height: 10, width: "25%", background: T.border, borderRadius: 4, opacity: 0.4 }} />
          </div>
          <div style={{ width: 60, height: 20, borderRadius: 10, background: T.border, opacity: 0.4 }} />
        </div>
      ))}
    </div>
  );
}
