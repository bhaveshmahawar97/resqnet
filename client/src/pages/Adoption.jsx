import { motion } from "framer-motion";
import { useT } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import useViewport from "../hooks/useViewport";
import { usePlatformStats, formatStat } from "../hooks/usePlatformStats";
import AdoptionGrid from "../components/adoption/AdoptionGrid";

export default function Adoption() {
  const { T } = useT();
  const vp = useViewport();
  const { stats } = usePlatformStats();

  return (
    <main style={{ width: "100%", overflowX: "hidden", background: T.bg, minHeight: "100vh" }}>
      {/* Professional Header */}
      <div style={{
        background: T.bgAlt,
        borderBottom: `1px solid ${T.border}`,
        paddingTop: vp.mobile ? 72 : 80,
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: vp.mobile ? "1.5rem 1rem 1.25rem" : "2rem clamp(1.25rem, 4vw, 3.5rem) 1.5rem",
        }}>
          <div style={{
            display: "flex",
            alignItems: vp.mobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexDirection: vp.mobile ? "column" : "row",
            gap: "1rem",
          }}>
            {/* Left: Title + Badge */}
            <div>
              {/* Verified Adoption Badge */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
                background: `${T.success}10`,
                border: `1px solid ${T.success}30`,
                marginBottom: "0.75rem",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: T.success,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  Verified Adoptions
                </span>
              </div>

              <h1 style={{
                fontSize: vp.mobile ? "1.5rem" : "clamp(1.75rem, 3vw, 2.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                color: T.textHeading,
                margin: "0 0 0.5rem",
              }}>
                Give an Animal a Home
              </h1>
              <p style={{
                fontSize: "0.9rem",
                color: T.textSub,
                margin: 0,
                lineHeight: 1.65,
                maxWidth: 600,
              }}>
                Browse rescued animals looking for safe, caring, and permanent homes. Every adoption saves a life and opens space for another rescue.
              </p>
            </div>

            {/* Right: Stats + Action */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: vp.mobile ? "flex-start" : "flex-end",
              gap: "0.85rem",
            }}>
              {/* Stats */}
              <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${T.border}`,
                  background: T.bgCard,
                  minWidth: 80,
                }}>
                  <span style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: T.text,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}>
                    {formatStat(stats.totalAdoptions)}
                  </span>
                  <span style={{
                    fontSize: "0.6rem",
                    color: T.textMuted,
                    marginTop: 3,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    fontWeight: 600,
                  }}>
                    Adopted
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${T.border}`,
                  background: T.bgCard,
                  minWidth: 80,
                }}>
                  <span style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: T.text,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}>
                    {formatStat(stats.totalNgos)}
                  </span>
                  <span style={{
                    fontSize: "0.6rem",
                    color: T.textMuted,
                    marginTop: 3,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    fontWeight: 600,
                  }}>
                    Partners
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${T.border}`,
                  background: T.bgCard,
                  minWidth: 80,
                }}>
                  <span style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: T.text,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}>
                    100%
                  </span>
                  <span style={{
                    fontSize: "0.6rem",
                    color: T.textMuted,
                    marginTop: 3,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    fontWeight: 600,
                  }}>
                    Verified
                  </span>
                </div>
              </div>

              {/* List Animal Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/ngo-register"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.65rem 1.25rem",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${T.border}`,
                    background: T.bgCard,
                    color: T.text,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.accent;
                    e.currentTarget.style.color = T.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.color = T.text;
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  List an Animal
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Success Messaging */}
          <div style={{
            marginTop: "1.25rem",
            padding: "0.65rem 0.85rem",
            borderRadius: "var(--radius-md)",
            background: `${T.success}08`,
            border: `1px solid ${T.success}20`,
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span style={{ fontSize: "0.75rem", color: T.textSub, lineHeight: 1.6 }}>
              <strong style={{ fontWeight: 700, color: T.text }}>Adoption Success:</strong> All animals are health-checked, vaccinated, and come from verified rescue partners. Post-adoption support included.
            </span>
          </div>
        </div>
      </div>

      {/* Adoption Grid Content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: vp.mobile ? "1.5rem 1rem 3rem" : "2rem clamp(1.25rem, 4vw, 3.5rem) 3rem" }}>
        <AdoptionGrid />
      </div>
    </main>
  );
}
