import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import useCountUp from "../../hooks/useCountUp";
import Label from "../ui/Label";
import { vFadeUp } from "../../animations/variants";
import { usePlatformStats, formatStat } from "../../hooks/usePlatformStats";

const STATS = [
  { value: 0, suffix: "", label: "Avg Response", sub: "For critical emergencies", icon: "⚡", color: "#EF4444" },
  { value: 0, suffix: "", label: "Verified NGOs", sub: "On standby nationwide", icon: "🏥", color: "#3B82F6" },
  { value: 0, suffix: "", label: "Animals Saved", sub: "Since ResQNet launched", icon: "💚", color: "#22C55E" },
];

function StatCard({ stat, active }) {
  const { T } = useT();
  const count = useCountUp(stat.value, active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      style={{
        background: T.bgCard,
        borderRadius: 14,
        border: `1px solid ${T.border}`,
        padding: "1.5rem",
        boxShadow: T.shadow,
        transition: "box-shadow 0.3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent glow corner */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${stat.color}18`, pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <div style={{ fontSize: "1.6rem", width: 44, height: 44, borderRadius: 10, background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {stat.icon}
        </div>
        {stat.live && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444" }}
            />
            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#EF4444", letterSpacing: "0.08em" }}>LIVE</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "0.1rem", marginBottom: "0.25rem" }}>
        <span style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: stat.color, letterSpacing: "-0.04em", lineHeight: 1 }}>
          {count.toLocaleString()}
        </span>
        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: stat.color }}>{stat.suffix}</span>
      </div>
      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.text, marginBottom: "0.2rem" }}>{stat.label}</div>
      <div style={{ fontSize: "0.75rem", color: T.textMuted }}>{stat.sub}</div>
    </motion.div>
  );
}

export default function EmergencyStats() {
  const { T } = useT();
  const { stats } = usePlatformStats();

  const STATS = [
    { value: stats.avgResponseMinutes, suffix: "m", label: "Avg Response", sub: "For critical emergencies", icon: "⚡", color: "#EF4444" },
    { value: stats.totalNgos, suffix: "", label: "Verified NGOs", sub: "On standby nationwide", icon: "🏥", color: "#3B82F6" },
    { value: stats.totalRescues, suffix: "", label: "Animals Saved", sub: "Since ResQNet launched", icon: "💚", color: "#22C55E" },
  ];
  
  const vp = useViewport();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bg }}>
      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp} style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>Operational Data</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: "0 0 0.75rem" }}>
            Impact in Real Numbers
          </h2>
          <p style={{ color: T.textSub, fontSize: "clamp(0.88rem, 2vw, 1rem)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Every metric reflects a real animal helped. This is what AI-powered rescue coordination looks like at scale.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr 1fr" : vp.tablet ? "repeat(3, 1fr)" : "repeat(3, 1fr)", gap: "1.25rem" }}>
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
