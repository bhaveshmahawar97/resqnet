import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";

const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Emergency Rescue", to: "/rescue" },
      { label: "AI Health Scanner", to: "/ai-health" },
      { label: "Adoption Hub", to: "/adoption" },
      { label: "NGO Network", to: "/ngos" },
      { label: "Volunteer Program", to: "/register" },
    ],
  },
  {
    heading: "Organizations",
    links: [
      { label: "Register NGO", to: "/ngo-register" },
      { label: "NGO Dashboard", to: "/dashboard/ngo" },
      { label: "Volunteer Dashboard", to: "/dashboard/volunteer" },
      { label: "Admin Portal", to: "/dashboard/admin" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Contact", to: "#" },
      { label: "Privacy Policy", to: "#" },
      { label: "Terms of Service", to: "#" },
    ],
  },
];

const SOCIAL = [
  {
    label: "Twitter",
    to: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    to: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    to: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { T } = useT();

  const linkStyle = {
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.45)",
    textDecoration: "none",
    fontWeight: 400,
    lineHeight: 1,
    transition: "color 0.15s",
    display: "block",
  };

  return (
    <footer
      style={{
        width: "100%",
        background: T.bgFooter,
        borderTop: `1px solid rgba(255,255,255,0.07)`,
        color: T.textInverse,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem) 0",
        }}
      >
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "clamp(200px, 28%, 280px) repeat(3, 1fr)",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            marginBottom: "clamp(2rem, 4vw, 3rem)",
          }}
          className="rq-footer-top"
        >
          {/* Brand column */}
          <div>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                textDecoration: "none",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: "1rem", fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.025em" }}>ResQNet</span>
            </Link>

            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 230 }}>
              AI-powered animal rescue coordination — connecting communities, NGOs, and volunteers across India.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.to}
                  aria-label={s.label}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 7,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.35)",
                    textDecoration: "none",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.38)",
                  marginBottom: "1rem",
                }}
              >
                {col.heading}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {col.links.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "1.25rem 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} ResQNet. All rights reserved.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22C55E",
                boxShadow: "0 0 6px #22C55E80",
                animation: "rq-pulse-dot 3s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.28)", fontWeight: 500 }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>

      {/* Mobile responsive override */}
      <style>{`
        @media (max-width: 767px) {
          .rq-footer-top {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .rq-footer-top {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
