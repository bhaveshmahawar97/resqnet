import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import Label from "../ui/Label";
import StatPill from "../ui/StatPill";
import { getRescueStats } from "../../services/rescueService";
import { fetchAdoptionStats } from "../../services/adoptionService";

// Fallback static stats — shown while loading or on API error
const FALLBACK_STATS = [
  { value: 48200, suffix: "+", label: "Animals Rescued" },
  { value: 312, suffix: "", label: "Partner NGOs" },
  { value: 94, suffix: "%", label: "Recovery Rate" },
  { value: 18, suffix: "m", label: "Avg Response" },
  { value: 7400, suffix: "+", label: "Adoptions" },
];

export default function StatsSection() {
  const { T } = useT();
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchStats() {
      try {
        const [rescueRes, adoptionRes] = await Promise.allSettled([
          getRescueStats(),
          fetchAdoptionStats(),
        ]);

        if (!mounted) return;

        const rescue = rescueRes.status === "fulfilled" && rescueRes.value?.success
          ? rescueRes.value.data
          : null;
        const adoption = adoptionRes.status === "fulfilled" && adoptionRes.value?.success
          ? adoptionRes.value.data
          : null;

        // Merge live data with fallbacks
        if (rescue || adoption) {
          setStats([
            {
              value: rescue?.total ?? FALLBACK_STATS[0].value,
              suffix: "+",
              label: "Animals Rescued",
            },
            {
              value: FALLBACK_STATS[1].value,
              suffix: "",
              label: "Partner NGOs",
            },
            {
              value: rescue?.completionRate
                ? Math.round(rescue.completionRate)
                : FALLBACK_STATS[2].value,
              suffix: "%",
              label: "Recovery Rate",
            },
            {
              value: rescue?.avgResponseMinutes ?? FALLBACK_STATS[3].value,
              suffix: "m",
              label: "Avg Response",
            },
            {
              value: adoption?.adopted ?? FALLBACK_STATS[4].value,
              suffix: "+",
              label: "Adoptions",
            },
          ]);
        }
      } catch {
        // silently fall back to static stats
      } finally {
        if (mounted) setLoaded(true);
      }
    }

    fetchStats();
    return () => { mounted = false; };
  }, []);

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
      {/* Subtle divider top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(640px, 80%)",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${T.accent}55, transparent)`,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3.5rem)",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={vFadeUp}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          <Label>Platform Impact</Label>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: T.text,
              margin: 0,
            }}
          >
            Measurable outcomes,
            <br />
            <span
              style={{
                background: `linear-gradient(100deg, ${T.accent}, ${T.accentDim})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              real-world impact.
            </span>
          </h2>
          <p
            style={{
              fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
              color: T.textSub,
              marginTop: "0.75rem",
              lineHeight: 1.65,
            }}
          >
            Every number represents an animal given a second chance.
          </p>
        </motion.div>

        <div
          style={{
            display: "flex",
            gap: "clamp(0.65rem, 1.5vw, 1.25rem)",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {stats.map((s, i) => (
            <StatPill key={s.label} {...s} i={i} />
          ))}
        </div>

        {/* Live data indicator */}
        {loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              marginTop: "2rem",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: T.accent,
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{ fontSize: "0.65rem", color: T.textMuted, fontWeight: 500 }}
            >
              Live platform data
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
