import { useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { vFade, vFadeUp } from "../../animations/variants";
import animals from "../../data/animals";
import Button from "../ui/Button";
import Label from "../ui/Label";

function AdoptCard({ name, breed, age, status, img, i }) {
  const { T } = useT();
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={vFadeUp}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${hov ? T.borderHov : T.border}`,
        background: T.bgCard,
        cursor: "pointer",
        transform: hov ? "translateY(-7px) scale(1.01)" : "none",
        boxShadow: hov ? `0 24px 65px ${T.shadowHov}` : `0 2px 14px ${T.shadow}`,
        transition: "all 0.32s ease",
        flex: "1 1 clamp(185px, 22vw, 270px)",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
        <img
          src={img}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.55s ease",
            transform: hov ? "scale(1.07)" : "scale(1)",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "0.6rem",
            right: "0.6rem",
            padding: "0.2rem 0.6rem",
            borderRadius: 20,
            background: status === "Available" ? T.accent : "#F59E0B",
            color: "#fff",
            fontSize: "0.63rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          {status}
        </div>
      </div>
      <div style={{ padding: "clamp(0.9rem, 2vw, 1.2rem)" }}>
        <h3 style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)", fontWeight: 700, margin: "0 0 0.18rem", color: T.text }}>
          {name}
        </h3>
        <p style={{ fontSize: "0.76rem", color: T.textSub, margin: "0 0 0.9rem" }}>
          {breed} · {age}
        </p>
        <Button variant="primary" size="sm" style={{ width: "100%", borderRadius: 8 }}>
          Meet {name}
        </Button>
      </div>
    </motion.div>
  );
}

export default function AdoptionShowcase() {
  const { T } = useT();
  return (
    <section id="adopt" style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bgAlt }}>
      <div style={{ width: "100%", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1.25rem",
            marginBottom: "clamp(2rem, 5vw, 3rem)",
          }}
        >
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}>
            <Label>Adoption Hub</Label>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: 0 }}>
              Find your forever<br />
              companion.
            </h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFade}>
            <Button variant="ghost" size="sm">
              Browse All Animals
            </Button>
          </motion.div>
        </div>
        <div style={{ display: "flex", gap: "clamp(0.65rem, 1.5vw, 1rem)", flexWrap: "wrap", justifyContent: "flex-start" }}>
          {animals.map((a, i) => (
            <AdoptCard key={a.name} {...a} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

