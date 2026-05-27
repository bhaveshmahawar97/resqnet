import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";

const FOOTER_LINKS = [
  { label: "Rescue", to: "/rescue" },
  { label: "AI Scan", to: "/ai-health" },
  { label: "NGOs", to: "/ngos" },
  { label: "Adopt", to: "/adoption" },
  { label: "Privacy", to: "#" },
  { label: "Terms", to: "#" },
];

export default function Footer() {
  const { T } = useT();

  return (
    <footer
      style={{
        width: "100%",
        background: T.bgFooter,
        borderTop: `1px solid ${T.borderLight}`,
        color: T.textInverse,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "1rem clamp(1.25rem, 4vw, 3rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Left: brand mark + © */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", minWidth: 0 }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: T.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 12h-4l-3 9L9 3l-3 9H2"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "-0.015em" }}>
              ResQNet
            </span>
          </Link>
          <span style={{ fontSize: "0.72rem", opacity: 0.55, whiteSpace: "nowrap" }}>
            © {new Date().getFullYear()}
          </span>
        </div>

        {/* Center: nav links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              style={{
                fontSize: "0.74rem",
                color: "inherit",
                opacity: 0.6,
                textDecoration: "none",
                fontWeight: 500,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: operational status */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: T.success,
              boxShadow: `0 0 6px ${T.success}`,
              animation: "rq-pulse-dot 3s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: "0.72rem", opacity: 0.65, fontWeight: 500 }}>
            Operational
          </span>
        </div>
      </div>
    </footer>
  );
}
