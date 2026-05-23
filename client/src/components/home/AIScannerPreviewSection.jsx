import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import Button from "../ui/Button";

const SCANNER_FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    title: "Upload & Scan",
    desc: "Upload any animal photo for instant AI-powered health assessment.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
      </svg>
    ),
    title: "AI-Powered Analysis",
    desc: "Identifies species, breed, visible conditions, and severity in seconds.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "Triage & Recommendations",
    desc: "Get severity scoring, first aid steps, and nearby care resources.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Scan History",
    desc: "Track all your past scans with full analysis records accessible anytime.",
  },
];

export default function AIScannerPreviewSection() {
  const { T } = useT();

  return (
    <section
      id="ai-scanner"
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 7vw, 5.5rem) 0",
        background: T.bg,
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
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: "center",
            maxWidth: 560,
            margin: "0 auto clamp(2rem, 4vw, 3rem)",
          }}
        >
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "0.6875rem", fontWeight: 700, color: T.accent,
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} />
            AI Health Scanner
          </div>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: T.textHeading,
              margin: "0 0 0.65rem",
              lineHeight: 1.2,
            }}
          >
            Instant AI-powered{" "}
            <span style={{ color: T.accent }}>health assessment</span>
          </h2>
          <p
            style={{
              fontSize: "clamp(0.82rem, 1.5vw, 0.92rem)",
              color: T.textSub,
              lineHeight: 1.7,
            }}
          >
            Upload a photo of any animal and our AI engine identifies conditions,
            provides severity scoring, and recommends immediate next steps.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "0.875rem",
            marginBottom: "2rem",
          }}
        >
          {SCANNER_FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "1.25rem",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = T.shadowHov || "0 4px 16px rgba(15,23,42,0.07)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "";
              }}
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: T.accentPale,
                  border: `1px solid ${T.accentGlow}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: T.accent,
                  marginBottom: "0.75rem",
                }}
              >
                {f.icon}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text, marginBottom: "0.25rem" }}>
                {f.title}
              </div>
              <div style={{ fontSize: "0.78rem", color: T.textSub, lineHeight: 1.55 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link to="/ai-health">
            <Button variant="primary" size="lg">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              Try AI Health Scanner
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
