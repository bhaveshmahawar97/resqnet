import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useCountUp from "../../hooks/useCountUp";
import { vFadeUp } from "../../animations/variants";

export default function StatPill({ value, suffix, label, i }) {
  const { T } = useT();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(value, inView);
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
        {count.toLocaleString()}
        {suffix}
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

