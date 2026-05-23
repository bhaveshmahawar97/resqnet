import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { usePlatformStats, formatStat } from "../../hooks/usePlatformStats";
import useCountUp from "../../hooks/useCountUp";

function StatCard({ stat, index, active }) {
  const { T } = useT();
  const count = useCountUp(typeof stat.value === 'number' ? stat.value : 0, active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -1 }}
      style={{
        flex: "1 1 160px",
        minWidth: 0,
        padding: "1.5rem 1.25rem",
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        boxShadow: T.shadow,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: "25%", bottom: "25%", width: 3, background: T.accent, borderRadius: "0 3px 3px 0", opacity: 0.5 }} />

      <div style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: T.textHeading, letterSpacing: "-0.035em", lineHeight: 1, marginBottom: "0.35rem" }}>
        {typeof stat.value === 'number' ? (active ? count.toLocaleString() : stat.value.toLocaleString()) : stat.value}
      </div>
      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: T.text, marginBottom: "0.3rem" }}>{stat.label}</div>
    </motion.div>
  );
}

export default function NGOStats() {
  const { T } = useT();
  const ref = useRef(null);
  const { stats } = usePlatformStats();
  const [active, setActive] = useState(false);

  const STATS = [
    { value: stats.totalNgos, label: "Registered NGOs" },
    { value: stats.totalRescues, label: "Animals Saved" },
    { value: stats.citiesCovered, label: "Cities Covered" },
    { value: "24/7", label: "Support Network" },
  ];

  return (
    <section style={{ width: "100%", padding: "clamp(3rem, 6vw, 5rem) 0", background: T.bgAlt }}>
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3rem)" }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setActive(true)}
          transition={{ duration: 0.45 }}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 4vw, 3rem)" }}
        >
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              background: T.accentSurface || T.accentPale, border: `1px solid ${T.accentGlow}`,
              borderRadius: 9999, padding: "0.28rem 0.85rem", marginBottom: "0.85rem",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent, display: "inline-block" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Network Impact
            </span>
          </div>

          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 800, color: T.textHeading, letterSpacing: "-0.035em", lineHeight: 1.2, margin: "0 0 0.6rem" }}>
            Every number is an animal saved
          </h2>
          <p style={{ fontSize: "0.9rem", color: T.textSub, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
            Real-time data from the ResQNet rescue coordination network.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div style={{ display: "flex", gap: "clamp(0.75rem, 1.5vw, 1.25rem)", flexWrap: "wrap", justifyContent: "center" }}>
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} active={active} />)}
        </div>
      </div>
    </section>
  );
}
