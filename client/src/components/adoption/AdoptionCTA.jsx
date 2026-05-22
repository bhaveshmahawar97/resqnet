import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import Button from "../ui/Button";
import Label from "../ui/Label";
import { vFadeUp } from "../../animations/variants";

export default function AdoptionCTA() {
  const { T } = useT();

  return (
    <section style={{ width: "100%", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=2000&q=70"
          alt=""
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 55%",
            opacity: 0.08,
            filter: "grayscale(30%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${T.bg} 0%, ${T.bgAlt} 55%, ${T.accentPale} 100%)`,
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3.5rem)",
          textAlign: "center",
        }}
      >
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}>
          <Label>Open a New Chapter</Label>
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
            Give a rescued animal<br />
            <span
              style={{
                background: `linear-gradient(100deg, ${T.accent} 0%, ${T.accentDim} 55%, ${T.accent} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              their second chance.
            </span>
          </h2>
          <p
            style={{
              color: T.textSub,
              margin: "0 auto 2.5rem",
              lineHeight: 1.75,
              fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
              maxWidth: 560,
            }}
          >
            Browse available animals, connect with verified NGOs, and start your adoption journey today — all on ResQNet, all trusted, all free.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="primary" size="lg">Browse All Animals</Button>
            <Button variant="ghost"   size="lg">Partner as an NGO</Button>
          </div>
          <div style={{ marginTop: "1.5rem", fontSize: "0.72rem", color: T.textMuted }}>
            No fees for adopters · 312+ NGO partners · AI-matched for your lifestyle
          </div>
        </motion.div>
      </div>
    </section>
  );
}
