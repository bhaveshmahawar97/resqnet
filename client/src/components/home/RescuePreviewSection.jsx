import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import Button from "../ui/Button";

const RESCUE_FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "Real-Time Coordination",
    desc: "Instant routing to the nearest available NGO and rescue volunteers.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: "GPS-Enabled Tracking",
    desc: "Auto-detect location to reduce response time by up to 60%.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
      </svg>
    ),
    title: "AI Severity Triage",
    desc: "Intelligent priority scoring to ensure critical cases get immediate attention.",
  },
];

const METRICS = [
  { label: "Avg. NGO Response", value: "18 min" },
  { label: "Coverage Area", value: "Nationwide" },
  { label: "Active Volunteers", value: "2,400+" },
];

export default function RescuePreviewSection() {
  const { T } = useT();

  return (
    <section
      id="rescue"
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 7vw, 5.5rem) 0",
        background: T.bgAlt,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3rem)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(2rem, 5vw, 4rem)",
            alignItems: "center",
          }}
        >
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.6875rem", fontWeight: 700, color: T.danger || "#DC2626",
                letterSpacing: "0.1em", textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.danger || "#DC2626" }} />
              Emergency Rescue
            </div>

            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: T.textHeading,
                margin: "0 0 0.75rem",
                lineHeight: 1.2,
              }}
            >
              Report an animal in{" "}
              <span style={{ color: T.danger || "#DC2626" }}>distress</span>
            </h2>

            <p
              style={{
                fontSize: "clamp(0.82rem, 1.5vw, 0.92rem)",
                color: T.textSub,
                lineHeight: 1.7,
                marginBottom: "1.5rem",
                maxWidth: 420,
              }}
            >
              Our platform instantly routes your report to the nearest
              available NGO and rescue volunteers — reducing response time
              and coordinating care in real time.
            </p>

            {/* Metrics */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.625rem 0.875rem",
                    background: T.bgCard,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: T.textSub }}>{m.label}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text }}>{m.value}</span>
                </div>
              ))}
            </div>

            <Link to="/rescue">
              <Button variant="primary" size="md">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                Report a Rescue
              </Button>
            </Link>
          </motion.div>

          {/* Right: Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {RESCUE_FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "1.125rem",
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderRadius: 14,
                  alignItems: "flex-start",
                  transition: "box-shadow 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: T.dangerPale || "rgba(220,38,38,0.06)",
                    border: `1px solid ${T.dangerBorder || "rgba(220,38,38,0.12)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: T.danger || "#DC2626",
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text, marginBottom: "0.2rem" }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: T.textSub, lineHeight: 1.55 }}>
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          #rescue > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
