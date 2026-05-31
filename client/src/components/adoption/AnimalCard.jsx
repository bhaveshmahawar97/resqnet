import { useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";

function getSpeciesColors(species, T) {
  const map = {
    Dog:      { bg: `${T.success}12`, border: `${T.success}30`, text: T.success },
    Cat:      { bg: `${T.accent}12`,  border: `${T.accent}30`,  text: T.accent },
    Bird:     { bg: `${T.warning}12`, border: `${T.warning}30`, text: T.warning },
    Wildlife: { bg: `${T.danger}12`,  border: `${T.danger}30`,  text: T.danger },
    Rabbit:   { bg: `${T.info}12`,    border: `${T.info}30`,    text: T.info },
  };
  return map[species] || { bg: T.bgAlt, border: T.borderLight, text: T.textSub };
}

function getStatusMeta(status, T) {
  const map = {
    Available:   { bg: T.success, label: "Available" },
    "In Foster": { bg: T.warning, label: "In Foster" },
    "On Hold":   { bg: T.info,    label: "On Hold" },
  };
  return map[status] || { bg: T.success, label: "Available" };
}

export default function AnimalCard({ animal, i, onAdopt }) {
  const { T } = useT();
  const [favorited, setFavorited] = useState(false);

  const sc = getSpeciesColors(animal.species, T);
  const st = getStatusMeta(animal.status, T);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setFavorited((f) => !f);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={() => onAdopt(animal)}
      style={{
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        border: `1px solid ${T.border}`,
        background: T.bgCard,
        cursor: "pointer",
        boxShadow: T.shadowCard,
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = T.shadowHov;
        e.currentTarget.style.borderColor = T.borderHov;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = T.shadowCard;
        e.currentTarget.style.borderColor = T.border;
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", flexShrink: 0 }}>
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={animal.img}
          alt={animal.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Status Badge */}
        <div style={{
          position: "absolute",
          top: "0.75rem",
          left: "0.75rem",
          padding: "0.3rem 0.75rem",
          borderRadius: "var(--radius-full)",
          background: st.bg,
          color: "#fff",
          fontSize: "0.68rem",
          fontWeight: 800,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}>
          {st.label}
        </div>

        {/* Species Badge */}
        <div style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          padding: "0.3rem 0.75rem",
          borderRadius: "var(--radius-full)",
          background: sc.bg,
          border: `1px solid ${sc.border}`,
          color: sc.text,
          fontSize: "0.68rem",
          fontWeight: 700,
          backdropFilter: "blur(8px)",
        }}>
          {animal.species}
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavorite}
          style={{
            position: "absolute",
            bottom: "0.75rem",
            right: "0.75rem",
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: favorited ? T.accent : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
          title={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={favorited ? "#fff" : "none"}
            stroke={favorited ? "#fff" : T.text}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.button>
      </div>

      {/* Body */}
      <div style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        flex: 1,
      }}>
        {/* Name + Gender */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
          <h3 style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            margin: 0,
            color: T.textHeading,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}>
            {animal.name}
          </h3>
          <span style={{
            fontSize: "0.7rem",
            color: T.textSub,
            background: T.bgAlt,
            border: `1px solid ${T.borderLight}`,
            padding: "0.25rem 0.65rem",
            borderRadius: "var(--radius-full)",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}>
            {animal.gender}
          </span>
        </div>

        {/* Breed + Age + Weight */}
        <p style={{
          fontSize: "0.8rem",
          color: T.textSub,
          margin: 0,
          fontWeight: 500,
        }}>
          {animal.breed} · {animal.age} · {animal.weight}
        </p>

        {/* Health Tags */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {animal.vaccinated && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.68rem",
              fontWeight: 700,
              color: T.success,
              background: `${T.success}12`,
              border: `1px solid ${T.success}30`,
              padding: "0.25rem 0.65rem",
              borderRadius: "var(--radius-full)",
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Vaccinated
            </div>
          )}
          {animal.neutered && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.68rem",
              fontWeight: 700,
              color: T.info,
              background: `${T.info}12`,
              border: `1px solid ${T.info}30`,
              padding: "0.25rem 0.65rem",
              borderRadius: "var(--radius-full)",
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Neutered
            </div>
          )}
        </div>

        {/* Rescue Story */}
        {animal.rescueStory && (
          <p style={{
            fontSize: "0.75rem",
            color: T.textMuted,
            lineHeight: 1.65,
            margin: 0,
            fontStyle: "italic",
            borderLeft: `2px solid ${T.accent}40`,
            paddingLeft: "0.75rem",
          }}>
            {animal.rescueStory}
          </p>
        )}

        {/* NGO Source */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 0.75rem",
          borderRadius: "var(--radius-md)",
          background: T.bgAlt,
          border: `1px solid ${T.borderLight}`,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span style={{ fontSize: "0.72rem", color: T.textSub, fontWeight: 500 }}>
            {animal.ngo} · {animal.city}
          </span>
        </div>

        {/* Compatibility Tags */}
        {animal.compatibility && animal.compatibility.length > 0 && (
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {animal.compatibility.slice(0, 3).map((c, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "0.68rem",
                  color: T.textSub,
                  background: T.bgAlt,
                  border: `1px solid ${T.borderLight}`,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 500,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onAdopt(animal);
          }}
          style={{
            marginTop: "auto",
            padding: "0.75rem",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: T.accent,
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.85rem",
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
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Meet {animal.name}
        </motion.button>
      </div>
    </motion.div>
  );
}
