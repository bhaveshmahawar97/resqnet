import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";

export default function Footer() {
  const { T } = useT();
  const vp = useViewport();
  const cols = {
    Platform: ["For NGOs", "For Clinics", "For Rescuers", "For Adopters", "Pricing"],
    Resources: ["Documentation", "API Access", "Case Studies", "Blog", "Community"],
    Company: ["About", "Mission", "Careers", "Press Kit", "Contact"],
    Legal: ["Privacy Policy", "Terms of Use", "Cookie Policy", "DPDP Compliance"],
  };
  const gridCols = vp.mobile
    ? "1fr 1fr"
    : vp.tablet
      ? "2fr 1fr 1fr 1fr"
      : "2.5fr 1fr 1fr 1fr 1fr";

  return (
    <footer
      style={{
        width: "100%",
        background: T.bgFooter,
        borderTop: `1px solid ${T.border}`,
        padding: `clamp(3rem, 7vw, 5.5rem) 0 0`,
      }}
    >
      <div style={{ width: "100%", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: "clamp(1.5rem, 3vw, 2.5rem)",
            marginBottom: "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: vp.mobile ? "1 / -1" : "auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.85rem",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: T.text,
                }}
              >
                ResQ<span style={{ color: T.accent }}>Net</span>
              </span>
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                color: T.textSub,
                lineHeight: 1.7,
                margin: "0 0 1.2rem",
                maxWidth: 230,
              }}
            >
              AI-powered platform connecting animal rescuers, clinics, and NGOs nationwide.
            </p>
            {/* Social stubs */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["X", "in", "gh"].map((s) => (
                <div
                  key={s}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    border: `1px solid ${T.border}`,
                    background: T.bgCard,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    color: T.textSub,
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(cols).map(([section, items]) => (
            <div key={section}>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: T.text,
                  marginBottom: "0.9rem",
                }}
              >
                {section}
              </div>
              {items.map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    display: "block",
                    fontSize: "0.78rem",
                    color: T.textSub,
                    textDecoration: "none",
                    marginBottom: "0.55rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = T.accent)}
                  onMouseLeave={(e) => (e.target.style.color = T.textSub)}
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${T.border}`,
            padding: "1.5rem 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.65rem",
          }}
        >
          <span style={{ fontSize: "0.72rem", color: T.textMuted }}>
            &copy; {new Date().getFullYear()} ResQNet Technologies Pvt. Ltd. — All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} />
            </motion.div>
            <span style={{ fontSize: "0.7rem", color: T.textSub }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

