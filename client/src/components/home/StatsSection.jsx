import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { usePlatformStats, formatStat } from "../../hooks/usePlatformStats";

function useCountUp(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatCard({ stat, index, active }) {
  const { T } = useT();
  const count = useCountUp(stat.value, 1600, active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: "1 1 160px",
        minWidth: 0,
        padding: "1.5rem 1.25rem",
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        boxShadow: T.shadow,
        textAlign: "center",
        transition: "box-shadow 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={{ y: -1 }}
    >
      {/* Left accent line */}
      <div
        style={{
          position: "absolute",
          left: 0, top: "25%", bottom: "25%",
          width: 3,
          background: T.accent,
          borderRadius: "0 3px 3px 0",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
          fontWeight: 800,
          color: T.textHeading || T.text,
          letterSpacing: "-0.035em",
          lineHeight: 1,
          marginBottom: "0.35rem",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {active ? formatStat(count) : formatStat(stat.value)}
        <span style={{ color: T.accent, fontSize: "0.7em" }}>{stat.suffix}</span>
      </div>

      <div
        style={{
          fontSize: "0.82rem",
          fontWeight: 600,
          color: T.text,
          marginBottom: "0.3rem",
        }}
      >
        {stat.label}
      </div>

      <div style={{ fontSize: "0.72rem", color: T.textMuted, lineHeight: 1.45 }}>
        {stat.description}
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const { T } = useT();
  const { stats, loading } = usePlatformStats();
  const [inView, setInView] = useState(false);

  const displayStats = [
    { value: stats.totalRescues, suffix: "", label: "Animals Rescued", description: "Lives saved through our network" },
    { value: stats.totalNgos, suffix: "", label: "Partner NGOs", description: "Verified rescue organizations" },
    { value: stats.recoveryRate, suffix: "%", label: "Recovery Rate", description: "Successful case outcomes" },
    { value: stats.avgResponseMinutes, suffix: "m", label: "Avg Response", description: "Emergency response time" },
    { value: stats.totalAdoptions, suffix: "", label: "Adoptions", description: "Animals found new homes" },
  ];

  return (
    <section style={{ width: "100%", padding: "clamp(3rem, 6vw, 5rem) 0", background: T.bgAlt }}>
      <div
        style={{
          width: "100%", maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3rem)",
        }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setInView(true)}
          transition={{ duration: 0.45 }}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 4vw, 3rem)" }}
        >
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              background: T.accentSurface || T.accentPale,
              border: `1px solid ${T.accentGlow}`,
              borderRadius: 9999,
              padding: "0.28rem 0.85rem",
              marginBottom: "0.85rem",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent, display: "inline-block" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Platform Impact
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
              fontWeight: 800,
              color: T.textHeading || T.text,
              letterSpacing: "-0.035em",
              lineHeight: 1.2,
              margin: "0 0 0.6rem",
            }}
          >
            Measurable outcomes, real-world impact
          </h2>

          <p style={{ fontSize: "0.9rem", color: T.textSub, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
            Every number represents an animal given a second chance at life.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div
          style={{
            display: "flex",
            gap: "clamp(0.75rem, 1.5vw, 1.25rem)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {displayStats.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} active={inView} />
          ))}
        </div>

        {/* Live indicator */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "0.4rem", marginTop: "1.75rem",
            }}
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: T.success || "#059669",
                display: "inline-block",
                animation: "rq-pulse-dot 2.5s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: "0.68rem", color: T.textMuted, fontWeight: 500 }}>
              Live platform data — updated in real time
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
