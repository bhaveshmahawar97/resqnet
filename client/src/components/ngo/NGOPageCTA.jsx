import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import Btn from "../ui/Button";
import Label from "../ui/Label";

export default function NGOPageCTA() {
  const { T } = useT();
  return (
    <section style={{ width: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=2000&q=70"
          alt=""
          aria-hidden
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 50%", opacity: 0.09, filter: "grayscale(30%)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${T.bg} 0%, ${T.bgAlt} 55%, ${T.accentPale} 100%)` }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3.5rem)", textAlign: "center" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}>
          <Label>Get Started</Label>
          <h2 style={{ fontSize: "clamp(2rem, 6vw, 4.2rem)", fontWeight: 900, letterSpacing: "-0.045em", margin: "0 0 1.1rem", color: T.text, lineHeight: 1.08 }}>
            Your NGO belongs<br />
            <span
              style={{
                background: `linear-gradient(100deg, ${T.accent} 0%, ${T.accentDim} 55%, ${T.accent} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in this network.
            </span>
          </h2>
          <p style={{ color: T.textSub, margin: "0 auto 2.5rem", lineHeight: 1.75, fontSize: "clamp(0.9rem, 2vw, 1.05rem)" }}>
            Register today and connect your rescue operations with the most advanced coordination platform for animal welfare in India — free for verified NGOs.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="primary" size="lg">
              Register Your NGO — Free
            </Btn>
            <Btn variant="ghost" size="lg">
              Talk to Our Team
            </Btn>
          </div>
          <div style={{ marginTop: "1.5rem", fontSize: "0.72rem", color: T.textMuted }}>
            No cost for verified NGOs · Verified in 48 hrs · 312+ organizations already onboard
          </div>
        </motion.div>
      </div>
    </section>
  );
}
