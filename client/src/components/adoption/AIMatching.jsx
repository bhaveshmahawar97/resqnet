import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Label from "../ui/Label";
import { vFadeUp } from "../../animations/variants";
const AI_TRAITS = [
  { label: "Living Space", options: ["Apartment", "House with Yard", "Villa"] },
  { label: "Activity Level", options: ["Sedentary", "Moderate", "Active"] },
  { label: "Experience", options: ["First-timer", "Some experience", "Expert"] },
  { label: "Household", options: ["Solo", "Couple", "Family + Kids"] },
];

const AI_MATCHES = [
  { name: "Karo",    breed: "Indian Pariah · 5 yrs", score: 97, img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=70" },
  { name: "Biscuit", breed: "Golden Mix · 6 yrs",    score: 94, img: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=300&q=70" },
  { name: "Bruno",   breed: "Labrador Mix · 2 yrs",  score: 88, img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&q=70" },
];
export default function AIMatching() {
  const { T } = useT();
  const vp    = useViewport();
  const [selected, setSelected] = useState({});
  const [scanning, setScanning] = useState(false);

  const handleSelect = (label, option) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[label] === option) {
        delete next[label]; // toggle off
      } else {
        next[label] = option;
        // Trigger brief "scanning" animation
        setScanning(true);
        setTimeout(() => setScanning(false), 700);
      }
      return next;
    });
  };

  const filled = Object.keys(selected).length;
  const pct    = Math.round((filled / AI_TRAITS.length) * 100);

  // Dynamically adjust scores based on fill
  const dynamicMatches = AI_MATCHES.map((m, i) => ({
    ...m,
    score: filled > 0 ? Math.max(70, m.score - i * 3 + Math.round(filled * 2.5)) : m.score,
  }));

  return (
    <section
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 8vw, 6rem) 0",
        background: T.bgAlt,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative grid lines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={vFadeUp}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          <Label>AI Compatibility Engine</Label>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: T.text,
              margin: "0 0 0.75rem",
            }}
          >
            Tell us about your life.<br />
            <span
              style={{
                background: `linear-gradient(100deg, ${T.accent} 0%, ${T.accentDim} 60%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              We&apos;ll find your match.
            </span>
          </h2>
          <p style={{ color: T.textSub, fontSize: "clamp(0.88rem, 2vw, 1rem)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Our model scores every rescued animal against your lifestyle traits to surface the highest-compatibility companions.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr",
            gap: "clamp(1rem, 3vw, 2rem)",
            alignItems: "start",
          }}
        >
          {/* Left — trait selectors */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={vFadeUp}
          >
            {/* Progress bar */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: T.textSub }}>Profile Completeness</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: T.accent }}>{pct}%</span>
              </div>
              <div style={{ height: 5, background: T.bgCard, borderRadius: 4, overflow: "hidden", border: `1px solid ${T.border}` }}>
                <motion.div
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", background: `linear-gradient(90deg, ${T.accent}, ${T.accentDim})`, borderRadius: 4 }}
                />
              </div>
            </div>

            {AI_TRAITS.map((trait, ti) => (
              <motion.div
                key={trait.label}
                custom={ti}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={vFadeUp}
                style={{ marginBottom: "1.25rem" }}
              >
                <div style={{ fontSize: "0.76rem", fontWeight: 700, color: T.text, marginBottom: "0.5rem" }}>
                  {trait.label}
                  {selected[trait.label] && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ marginLeft: "0.5rem", fontSize: "0.6rem", color: T.accent, fontWeight: 600 }}
                    >
                      ✓ {selected[trait.label]}
                    </motion.span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {trait.options.map((opt) => {
                    const active = selected[trait.label] === opt;
                    return (
                      <motion.button
                        key={opt}
                        onClick={() => handleSelect(trait.label, opt)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: "0.38rem 0.9rem",
                          borderRadius: 8,
                          border: `1px solid ${active ? T.accent : T.border}`,
                          background: active ? T.accentPale : T.bgCard,
                          color: active ? T.accent : T.textSub,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontFamily: "inherit",
                        }}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {filled > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelected({})}
                style={{
                  fontSize: "0.72rem",
                  color: T.textMuted,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                Reset all
              </motion.button>
            )}
          </motion.div>

          {/* Right — match results panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: `0 40px 100px ${T.shadowDeep}`,
              padding: "1.5rem",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: T.bgAlt,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              {/* Pulse dot */}
              <motion.div
                animate={scanning ? { scale: [1, 1.6, 1], opacity: [1, 0.5, 1] } : { opacity: [0.7, 1, 0.7] }}
                transition={scanning
                  ? { duration: 0.6, ease: "easeInOut" }
                  : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }
                style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, flexShrink: 0 }}
              />
              <span style={{ fontSize: "0.72rem", color: T.textSub, fontWeight: 600 }}>
                {scanning
                  ? "Recalculating matches…"
                  : filled > 0
                    ? `${filled} / ${AI_TRAITS.length} traits matched — Top results`
                    : "Select traits to see your matches"}
              </span>
            </div>

            {/* Match list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <AnimatePresence mode="popLayout">
                {dynamicMatches.map(({ name, breed, score, img }, idx) => (
                  <motion.div
                    key={name}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + idx * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.85rem",
                      padding: "0.75rem",
                      borderRadius: 12,
                      border: `1px solid ${T.border}`,
                      background: T.bgAlt,
                    }}
                  >
                    <img
                      src={img}
                      alt={name}
                      style={{ width: 46, height: 46, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text }}>{name}</div>
                      <div style={{ fontSize: "0.66rem", color: T.textSub }}>{breed}</div>
                    </div>
                    {/* Score ring */}
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <motion.div
                        animate={scanning ? { rotate: [0, 180, 360] } : {}}
                        transition={{ duration: 0.6 }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          border: `2px solid ${T.accentGlow}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: T.accentPale,
                        }}
                      >
                        <span style={{ fontSize: "0.65rem", fontWeight: 900, color: T.accent }}>
                          {filled > 0 ? `${score}%` : "—"}
                        </span>
                      </motion.div>
                      <div style={{ fontSize: "0.55rem", color: T.textMuted, marginTop: 2 }}>match</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* AI badge */}
            <div
              style={{
                marginTop: "1rem",
                padding: "0.6rem 0.9rem",
                background: T.accentPale,
                border: `1px solid ${T.accentGlow}`,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "0.85rem" }}>🤖</span>
              <span style={{ fontSize: "0.68rem", color: T.accent, fontWeight: 600 }}>
                AI Matching Engine · Powered by ResQNet Intelligence
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
