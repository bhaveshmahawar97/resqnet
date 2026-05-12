import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import Label from "../ui/Label";
import StatPill from "../ui/StatPill";

export default function Statistics() {
  const { T } = useT();
  const stats = [
    { value: 48200, suffix: "+", label: "Animals Rescued" },
    { value: 312, suffix: "", label: "Partner NGOs" },
    { value: 94, suffix: "%", label: "Recovery Rate" },
    { value: 18, suffix: "m", label: "Avg Response" },
    { value: 7400, suffix: "+", label: "Adoptions" },
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
      <div style={{ width: "100%", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
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
            Measurable outcomes,<br />
            real-world impact.
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
          {stats.map((s, i) => (
            <StatPill key={s.label} {...s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

