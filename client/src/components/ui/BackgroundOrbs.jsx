import { motion, useReducedMotion } from "framer-motion";
import { useT } from "../../context/ThemeContext";

export default function BackgroundOrbs() {
  const { T } = useT();
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Edge-to-edge grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />
      {/* Orb TL */}
      <motion.div
        animate={reduce ? {} : { scale: [1, 1.12, 1], x: [0, 30, 0], y: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "55vw",
          height: "55vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${T.orb1} 0%, transparent 68%)`,
          top: "-18vw",
          right: "-12vw",
        }}
      />
      {/* Orb BL */}
      <motion.div
        animate={reduce ? {} : { scale: [1, 1.08, 1], x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute",
          width: "45vw",
          height: "45vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${T.orb2} 0%, transparent 68%)`,
          bottom: "-15vw",
          left: "-10vw",
        }}
      />
      {/* Orb center accent */}
      <motion.div
        animate={reduce ? {} : { opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          width: "30vw",
          height: "30vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${T.orb1} 0%, transparent 70%)`,
          top: "30%",
          left: "35%",
        }}
      />
    </div>
  );
}

