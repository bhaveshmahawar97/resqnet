import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import Label from "../ui/Label";
import useCountUp from "../../hooks/useCountUp";
import { vFadeUp } from "../../animations/variants";
import { useAdoption } from "../../context/AdoptionContext";

function StatPill({ value, suffix, label, i }) {
  const { T } = useT();
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count  = useCountUp(value, inView);

  return (
    <motion.div
      ref={ref}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={vFadeUp}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 18,
        padding: "clamp(1.2rem, 2.5vw, 1.8rem) clamp(1.25rem, 3vw, 2.25rem)",
        textAlign: "center",
        flex: "1 1 clamp(130px, 18vw, 210px)",
        boxShadow: `0 2px 16px ${T.shadow}`,
        cursor: "default",
      }}
    >
      <div
        style={{
          fontSize: "clamp(1.9rem, 5vw, 3rem)",
          fontWeight: 900,
          color: T.text,
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        {count.toLocaleString()}{suffix}
      </div>
      <div
        style={{
          fontSize: "clamp(0.72rem, 1.5vw, 0.82rem)",
          color: T.textSub,
          marginTop: "0.45rem",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: 24,
          height: 2,
          background: T.accent,
          margin: "0.9rem auto 0",
          borderRadius: 2,
        }}
      />
    </motion.div>
  );
}

export default function AdoptionStats() {
  const { T } = useT();
  const { stats } = useAdoption();

  const adoptionStats = [
    { value: stats.listed || 0, suffix: "", label: "Available now", i: 0 },
    { value: stats.adopted || 0, suffix: "", label: "Successfully adopted", i: 1 },
    { value: stats.pendingReview || 0, suffix: "", label: "Applications in review", i: 2 },
    { value: stats.total || 0, suffix: "", label: "Total listings", i: 3 },
  ];

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
      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={vFadeUp}
          style={{
            textAlign: "center",
            marginBottom: "clamp(2rem, 5vw, 3.5rem)",
          }}
        >
          <Label>Adoption Impact</Label>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: T.text,
              margin: 0,
            }}
          >
            Every number is<br />a life transformed.
          </h2>
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
          {adoptionStats.map((s) => (
            <StatPill key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
