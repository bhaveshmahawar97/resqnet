import { motion } from "framer-motion";
import { useT } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import useViewport from "../hooks/useViewport";
import { usePlatformStats, formatStat } from "../hooks/usePlatformStats";
import NGODirectory from "../components/ngo/NGODirectory";

export default function NGOs() {
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
              {/* Verified Network Badge */}
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: T.success,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  Verified Network
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
                Locate Rescue Partners
              </h1>
              <p style={{
                fontSize: "0.9rem",
                color: T.textSub,
                margin: 0,
                lineHeight: 1.65,
                maxWidth: 600,
              }}>
                Find verified rescue organizations, animal shelters, wildlife responders, and veterinary healthcare providers across India.
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
                    {formatStat(stats.citiesCovered)}
                  </span>
                  <span style={{
                    fontSize: "0.6rem",
                    color: T.textMuted,
                    marginTop: 3,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    fontWeight: 600,
                  }}>
                    Cities
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
                    24/7
                  </span>
                  <span style={{
                    fontSize: "0.6rem",
                    color: T.textMuted,
                    marginTop: 3,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    fontWeight: 600,
                  }}>
                    Coverage
                  </span>
                </div>
              </div>

              {/* Join Network Button */}
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
                    border: "none",
                    background: T.accent,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    boxShadow: `0 2px 8px ${T.accent}40`,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Join Rescue Network
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Location Awareness Notice */}
          <div style={{
            marginTop: "1.25rem",
            padding: "0.65rem 0.85rem",
            borderRadius: "var(--radius-md)",
            background: `${T.info}08`,
            border: `1px solid ${T.info}20`,
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.info} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ fontSize: "0.75rem", color: T.textSub, lineHeight: 1.6 }}>
              <strong style={{ fontWeight: 700, color: T.text }}>Location-Based Search:</strong> Use the search bar to find partners near any city, or enable location access to discover nearby rescue organizations.
            </span>
          </div>
        </div>
      </div>

      {/* Directory Content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: vp.mobile ? "1.5rem 1rem 3rem" : "2rem clamp(1.25rem, 4vw, 3.5rem) 3rem" }}>
        <NGODirectory />
      </div>
    </main>
  );
}
