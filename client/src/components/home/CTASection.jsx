import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import Button from "../ui/Button";

const CTA_CARDS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "Respond to an Emergency",
    desc: "Report a rescue or respond to an active emergency in your area.",
    to: "/rescue",
    label: "Report Rescue",
    variant: "primary",
    accent: true,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Become a Volunteer",
    desc: "Join our network of field responders and make a direct difference.",
    to: "/register",
    label: "Join as Volunteer",
    variant: "ghost",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: "Register Your NGO",
    desc: "Connect your organization to the platform and start coordinating missions.",
    to: "/ngos",
    label: "Register NGO",
    variant: "ghost",
  },
];

export default function CTASection() {
  const { T } = useT();

  return (
    <section
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 7vw, 5.5rem) 0",
        background: T.bgAlt,
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3rem)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              background: T.accentSurface || T.accentPale,
              border: `1px solid ${T.accentGlow}`,
              borderRadius: 9999, padding: "0.28rem 0.85rem", marginBottom: "0.85rem",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent, display: "inline-block" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Get Involved
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
              fontWeight: 800, color: T.textHeading || T.text,
              letterSpacing: "-0.035em", lineHeight: 1.2,
              margin: "0 0 0.75rem",
            }}
          >
            Every action saves a life
          </h2>
          <p style={{ fontSize: "0.9rem", color: T.textSub, maxWidth: 440, margin: "0 auto", lineHeight: 1.65 }}>
            Whether you respond to emergencies, volunteer in the field, or manage an NGO — there's a place for you.
          </p>
        </motion.div>

        {/* CTA Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {CTA_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              style={{
                background: card.accent ? T.accent : T.bgCard,
                border: `1px solid ${card.accent ? "transparent" : T.border}`,
                borderRadius: 14,
                padding: "1.75rem",
                boxShadow: card.accent ? `0 4px 20px ${T.accentGlow}` : T.shadow,
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              whileHover={{ y: -2 }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: card.accent ? "rgba(255,255,255,0.15)" : T.accentSurface || T.accentPale,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: card.accent ? "#fff" : T.accent,
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "1rem", fontWeight: 700,
                    color: card.accent ? "#fff" : T.text,
                    letterSpacing: "-0.02em", marginBottom: "0.4rem",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.84rem",
                    color: card.accent ? "rgba(255,255,255,0.75)" : T.textSub,
                    lineHeight: 1.6,
                  }}
                >
                  {card.desc}
                </p>
              </div>

              {/* CTA */}
              <Link to={card.to}>
                <Button
                  variant={card.accent ? "secondary" : card.variant}
                  size="sm"
                  fullWidth
                  style={card.accent ? { background: "rgba(255,255,255,0.18)", color: T.textOnAccent, border: "1px solid rgba(255,255,255,0.25)" } : {}}
                >
                  {card.label}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
