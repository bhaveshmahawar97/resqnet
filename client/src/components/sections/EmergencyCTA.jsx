import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import Button from "../ui/Button";
import Label from "../ui/Label";
import heroIllustration from "../../assets/illustrations/hero-illustration.png";

export default function EmergencyCTA() {
  const { T } = useT();
  return (
    <section id="emergency" style={{ width: "100%", position: "relative", overflow: "hidden" }}>
      {/* Full-bleed BG */}
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src={heroIllustration}
          alt=""
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 60%",
            opacity: 0.12,
            filter: "grayscale(30%)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${T.bg} 0%, ${T.bgAlt} 55%, ${T.accentPale} 100%)` }} />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3.5rem)",
          display: "grid",
          gridTemplateColumns: "1fr",
          textAlign: "center",
        }}
      >
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}>
          {/* Pulsing alert */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "1.4rem" }}>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: 10, height: 10, borderRadius: "50%", background: "#E53935", boxShadow: "0 0 0 5px rgba(229,57,53,0.2)" }}
            />
            <Label color="#E53935">Emergency Response</Label>
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 6vw, 4.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.045em",
              margin: "0 0 1.1rem",
              color: T.text,
              lineHeight: 1.08,
            }}
          >
            Animal in distress?<br />
            <span style={{ color: "#E53935" }}>Alert the network.</span>
            <br />
            Help arrives in minutes.
          </h2>
          <p
            style={{
              color: T.textSub,
              margin: "0 auto 2.5rem",
              lineHeight: 1.75,
              fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
            }}
          >
            One tap sends an emergency signal to the nearest available rescuer, vetinary clinic, and NGO
            partner — simultaneously, in real time.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="danger" size="lg">
              Send Emergency Alert
            </Button>
            <Button variant="ghost" size="lg">
              View Rescue Map
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

