import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import logoMain from "../../assets/logos/logo-main.png";

const FOOTER_LINKS = {
  Platform: [
    { label: "For NGOs", to: "/ngos" },
    { label: "AI Health Scanner", to: "/ai-health" },
    { label: "Rescue Operations", to: "/rescue" },
    { label: "Adoption", to: "/adoption" },
  ],
  Resources: [
    { label: "Documentation", to: "#" },
    { label: "API Access", to: "#" },
    { label: "Case Studies", to: "#" },
    { label: "Blog", to: "#" },
  ],
  Company: [
    { label: "About", to: "#" },
    { label: "Mission", to: "/#mission" },
    { label: "Careers", to: "#" },
    { label: "Contact", to: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "#" },
    { label: "Terms of Use", to: "#" },
    { label: "Cookie Policy", to: "#" },
  ],
};

const SOCIAL = [
  {
    label: "Twitter",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "GitHub",
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
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.35)",
    textDecoration: "none",
    transition: "color 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
    fontWeight: 400,
    letterSpacing: "-0.003em",
  };

  return (
    <footer
      style={{
        width: "100%",
        background: T.bgFooter,
        borderTop: `1px solid rgba(255,255,255,0.05)`,
        color: "rgba(255,255,255,0.55)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem) 0",
        }}
      >
        {/* Top grid */}
        <div
          className="rq-footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "clamp(200px, 30%, 300px) repeat(auto-fit, minmax(140px, 1fr))",
            gap: "clamp(2rem, 5vw, 3rem)",
            marginBottom: "clamp(2.5rem, 5vw, 3.5rem)",
          }}
        >
          {/* Brand column */}
          <div>
            {/* Premium logo branding */}
            <div style={{ marginBottom: "1.25rem" }}>
              <img
                src={logoMain}
                alt="ResQNet"
                style={{
                  height: "clamp(84px, 15vw, 120px)",
                  width: "auto",
                  display: "block",
                  objectFit: "contain",
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.85";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              />
            </div>

            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.32)",
                lineHeight: 1.65,
                marginBottom: "1.5rem",
                maxWidth: 260,
                fontWeight: 400,
                letterSpacing: "-0.003em",
              }}
            >
              AI-powered animal rescue coordination platform connecting NGOs, veterinary clinics, and volunteers across India.
            </p>

            {/* Social links - refined spacing */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.3)",
                    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(56,189,248,0.08)";
                    e.currentTarget.style.color = "#38BDF8";
                    e.currentTarget.style.borderColor = "rgba(56,189,248,0.2)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, items]) => (
            <div key={section}>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.42)",
                  marginBottom: "1rem",
                  fontVariant: "small-caps",
                  opacity: 0.9,
                }}
              >
                {section}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    style={linkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.color = "rgba(255,255,255,0.65)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "rgba(255,255,255,0.35)";
                    }}
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
            borderTop: "1px solid rgba(255,255,255,0.04)",
            padding: "1.5rem 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", letterSpacing: "-0.003em", fontWeight: 400 }}>
            © {new Date().getFullYear()} ResQNet. All rights reserved.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10B981",
                display: "inline-block",
                animation: "rq-pulse-dot 3s ease-in-out infinite",
                boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)",
              }}
            />
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.22)", letterSpacing: "-0.003em", fontWeight: 400 }}>Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
