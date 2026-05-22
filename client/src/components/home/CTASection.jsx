import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import Button from "../ui/Button";

const CTA_CARDS = [
  {
    icon: "🤝",
    tag: "Volunteer",
    title: "Join the rescue force",
    desc: "Become a verified volunteer. Get dispatched to local rescue missions.",
    primary: { label: "Become a Volunteer", to: "/register" },
    secondary: { label: "Learn More", to: "/rescue" },
    accent: "#16A056",
  },
  {
    icon: "🏥",
    tag: "NGOs",
    title: "List your organization",
    desc: "Register your rescue NGO and receive verified rescue assignments, adoptions, and funding connections.",
    primary: { label: "Register NGO", to: "/register" },
    secondary: { label: "NGO Directory", to: "/ngos" },
    accent: "#2563EB",
    featured: true,
  },
  {
    icon: "🚨",
    tag: "Emergency",
    title: "Spot an animal in danger?",
    desc: "Report immediately. Our system routes it to the nearest available rescue team in seconds.",
    primary: { label: "Report Now", to: "/rescue" },
    secondary: { label: "Try AI Scanner", to: "/scanner" },
    accent: "#DC2626",
  },
];

export default function CTASection() {
  const { T } = useT();

  return (
    <section
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 7vw, 5.5rem) 0",
        background: T.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={vFadeUp}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 4vw, 3rem)" }}
        >
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: T.text,
              margin: "0 0 0.6rem",
            }}
          >
            Your role in the ecosystem.
          </h2>
          <p
            style={{
              fontSize: "clamp(0.85rem, 1.7vw, 1rem)",
              color: T.textSub,
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Whether you're a volunteer, an NGO, or someone who just spotted an
            animal in need — ResQNet has a place for you.
          </p>
        </motion.div>

        {/* CTA cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(0.75rem, 2vw, 1.25rem)",
          }}
        >
          {CTA_CARDS.map((card, i) => (
            <motion.div
              key={card.tag}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={vFadeUp}
              style={{
                padding: "clamp(1.5rem, 3vw, 2rem)",
                background: card.featured ? T.bgCard : T.bgCard,
                border: `1px solid ${card.featured ? card.accent + "44" : T.border}`,
                borderRadius: 22,
                position: "relative",
                overflow: "hidden",
                boxShadow: card.featured
                  ? `0 8px 48px ${card.accent}18`
                  : `0 2px 16px ${T.shadow}`,
              }}
            >
              {/* Featured accent top line */}
              {card.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${card.accent}, ${card.accent}88)`,
                  }}
                />
              )}

              {/* Tag */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.22rem 0.65rem",
                  borderRadius: 20,
                  background: card.accent + "18",
                  border: `1px solid ${card.accent}33`,
                  color: card.accent,
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                <span>{card.icon}</span>
                {card.tag}
              </div>

              <h3
                style={{
                  fontSize: "clamp(1.1rem, 2.2vw, 1.35rem)",
                  fontWeight: 800,
                  color: T.text,
                  margin: "0 0 0.6rem",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: "0.83rem",
                  color: T.textSub,
                  lineHeight: 1.65,
                  margin: "0 0 1.5rem",
                }}
              >
                {card.desc}
              </p>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <Link to={card.primary.to}>
                  <Button
                    variant="primary"
                    size="sm"
                    style={{ background: card.accent }}
                  >
                    {card.primary.label}
                  </Button>
                </Link>
                <Link to={card.secondary.to}>
                  <Button variant="ghost" size="sm">
                    {card.secondary.label}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
