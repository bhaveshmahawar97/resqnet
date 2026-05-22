import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Label from "../ui/Label";
import { vFadeUp } from "../../animations/variants";
import { CARE_CARDS } from "../../data/adoptionData";

export default function ResponsibleAdoption() {
  const { T } = useT();
  const vp    = useViewport();

  const gridCols = vp.mobile ? "1fr" : vp.tablet ? "1fr 1fr" : "repeat(4, 1fr)";

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
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          <Label>Adopt Responsibly</Label>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: T.text,
              margin: 0,
            }}
          >
            A lifetime commitment.<br />Handled with care.
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: "clamp(0.75rem, 2vw, 1.25rem)",
          }}
        >
          {CARE_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={vFadeUp}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 18,
                padding: "clamp(1.2rem, 2.5vw, 1.75rem)",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 2px 14px ${T.shadow}`,
              }}
            >
              {/* Number watermark */}
              <div
                style={{
                  position: "absolute",
                  top: "-0.5rem",
                  right: "0.75rem",
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  color: T.accentPale,
                  letterSpacing: "-0.06em",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                0{i + 1}
              </div>

              {/* Icon box */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: T.accentPale,
                  border: `1px solid ${T.accentGlow}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                }}
              >
                {card.icon}
              </div>

              {/* Badge */}
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: T.accent,
                  background: T.accentPale,
                  border: `1px solid ${T.accentGlow}`,
                  padding: "0.12rem 0.5rem",
                  borderRadius: 20,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  display: "inline-block",
                  marginBottom: "0.55rem",
                }}
              >
                {card.badge}
              </span>

              <h3 style={{ fontSize: "clamp(0.9rem, 1.8vw, 1rem)", fontWeight: 700, color: T.text, margin: "0 0 0.5rem" }}>
                {card.title}
              </h3>
              <p style={{ fontSize: "0.78rem", color: T.textSub, lineHeight: 1.72, margin: 0 }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
