import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";

export default function SkeletonCard({ height = 240 }) {
  const { T } = useT();
  
  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: 14,
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        boxShadow: `0 2px 14px ${T.shadow}`,
        overflow: "hidden",
        position: "relative",
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
      <div style={{ padding: "1.125rem", display: "flex", flexDirection: "column", height: "100%", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: T.border, opacity: 0.5 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 14, width: "60%", background: T.border, borderRadius: 4, marginBottom: 6, opacity: 0.5 }} />
            <div style={{ height: 10, width: "40%", background: T.border, borderRadius: 4, opacity: 0.4 }} />
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ height: 10, width: "90%", background: T.border, borderRadius: 4, opacity: 0.4 }} />
          <div style={{ height: 10, width: "80%", background: T.border, borderRadius: 4, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
}
