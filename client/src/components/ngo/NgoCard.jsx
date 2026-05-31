import { useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import NgoDetailsModal from "./NgoDetailsModal";

function getTypeColors(type, T) {
  const map = {
    Rescue:    { bg: `${T.danger}12`,   border: `${T.danger}30`,   text: T.danger },
    Medical:   { bg: `${T.success}12`,  border: `${T.success}30`,  text: T.success },
    Wildlife:  { bg: `${T.info}12`,     border: `${T.info}30`,     text: T.info },
    Shelter:   { bg: `${T.accent}12`,   border: `${T.accent}30`,   text: T.accent },
    Adoption:  { bg: `${T.accent}12`,   border: `${T.accent}30`,   text: T.accent },
    Advocacy:  { bg: `${T.warning}12`,  border: `${T.warning}30`,  text: T.warning },
    Sanctuary: { bg: T.bgAlt,           border: T.borderLight,     text: T.textSub },
  };
  return map[type] || { bg: T.bgAlt, border: T.borderLight, text: T.textSub };
}

function VerificationBadge({ verified, T }) {
  if (verified) {
    return (
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.3rem 0.65rem",
        borderRadius: "var(--radius-full)",
        background: `${T.success}12`,
        border: `1px solid ${T.success}30`,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          color: T.success,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
        }}>
          Verified
        </span>
      </div>
    );
  }

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.35rem",
      padding: "0.3rem 0.65rem",
      borderRadius: "var(--radius-full)",
      background: `${T.warning}12`,
      border: `1px solid ${T.warning}30`,
    }}>
      <div style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: T.warning,
      }} />
      <span style={{
        fontSize: "0.68rem",
        fontWeight: 600,
        color: T.warning,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
      }}>
        Pending
      </span>
    </div>
  );
}

export default function NgoCard({ ngo, i }) {
  const { T } = useT();
  const [showModal, setShowModal] = useState(false);

  const name = ngo.organizationName || ngo.name || "Unknown NGO";
  const city = ngo.city || ngo.location || "India";
  const type = (ngo.specialties || ["Partner"])[0];
  const specialties = (ngo.specialties || []).slice(0, 3);
  const tc = getTypeColors(type, T);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        style={{
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: "var(--radius-xl)",
          padding: "1.5rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: T.shadowCard,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = T.shadowHov;
          e.currentTarget.style.borderColor = T.borderHov;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = T.shadowCard;
          e.currentTarget.style.borderColor = T.border;
        }}
        onClick={() => !ngo.isMapResult && setShowModal(true)}
      >
        {/* Header */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          {/* Logo */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "var(--radius-lg)",
            background: `linear-gradient(135deg, ${T.accentPale}, ${T.accentSurface})`,
            border: `2px solid ${T.accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: "1rem",
              fontWeight: 800,
              margin: "0 0 0.35rem",
              color: T.textHeading,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {name}
            </h3>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              marginBottom: "0.5rem",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontSize: "0.78rem", color: T.textSub, fontWeight: 500 }}>
                {city}
              </span>
            </div>
            <VerificationBadge verified={ngo.verified} T={T} />
          </div>

          {/* Type Badge */}
          <div style={{
            padding: "0.35rem 0.75rem",
            borderRadius: "var(--radius-full)",
            background: tc.bg,
            border: `1px solid ${tc.border}`,
          }}>
            <span style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: tc.text,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}>
              {type}
            </span>
          </div>
        </div>

        {/* Specialties */}
        {specialties.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {specialties.map((spec, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "0.72rem",
                  color: T.textSub,
                  background: T.bgAlt,
                  border: `1px solid ${T.borderLight}`,
                  padding: "0.25rem 0.65rem",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 500,
                }}
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Distance/Response Time */}
        {(ngo.distance || ngo.responseTime) && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-md)",
            background: T.bgAlt,
            border: `1px solid ${T.borderLight}`,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{ fontSize: "0.78rem", color: T.textSub, fontWeight: 500 }}>
              {ngo.distance ? `${ngo.distance} away` : ngo.responseTime || "~20 min response"}
            </span>
          </div>
        )}

        {/* Stats or Map Data */}
        {!ngo.isMapResult ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.75rem",
            padding: "1rem 0 0",
            borderTop: `1px solid ${T.borderLight}`,
          }}>
            {[
              { icon: "⚡", val: ngo.responseTime || "~20 min", sub: "Response" },
              { icon: "🎯", val: ngo.missionsCompleted?.toLocaleString?.() ?? 0, sub: "Missions" },
              { icon: "⭐", val: ngo.rating ?? 4.8, sub: "Rating" },
            ].map(({ icon, val, sub }) => (
              <div key={sub} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>{icon}</div>
                <div style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}>
                  {val}
                </div>
                <div style={{
                  fontSize: "0.68rem",
                  color: T.textMuted,
                  marginTop: "0.25rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                }}>
                  {sub}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: "0.85rem 1rem",
            borderRadius: "var(--radius-md)",
            background: T.bgAlt,
            border: `1px solid ${T.borderLight}`,
          }}>
            <div style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: T.text,
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.info} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              OpenStreetMap Data
            </div>
            <div style={{ fontSize: "0.72rem", color: T.textSub, lineHeight: 1.6 }}>
              {ngo.phone && <div>📞 {ngo.phone}</div>}
              {ngo.website && (
                <div>
                  🌐 <a
                    href={ngo.website.startsWith('http') ? ngo.website : `http://${ngo.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: T.accent, textDecoration: "none", fontWeight: 600 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Website
                  </a>
                </div>
              )}
              {!ngo.phone && !ngo.website && <div>Facility from map location search</div>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.65rem", marginTop: "auto" }}>
          {ngo.isMapResult ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://www.openstreetmap.org/search?query=${ngo.lat},${ngo.lon}`, '_blank');
              }}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${T.border}`,
                background: T.bgAlt,
                color: T.text,
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              View on Map
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: T.accent,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: `0 2px 8px ${T.accent}30`,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Connect Partner
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${T.border}`,
                  background: T.bgCard,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {showModal && <NgoDetailsModal ngo={ngo} onClose={() => setShowModal(false)} />}
    </>
  );
}
