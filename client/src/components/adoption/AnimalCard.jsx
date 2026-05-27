import { useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import Button from "../ui/Button";
import { vFadeUp } from "../../animations/variants";
function getSpeciesColors(species, T) {
  const map = {
    Dog:      { bg: T.successPale, text: T.success },
    Cat:      { bg: T.accentPale,  text: T.accent },
    Bird:     { bg: T.warningPale, text: T.warning },
    Wildlife: { bg: T.dangerPale,  text: T.danger },
    Rabbit:   { bg: T.infoPale,    text: T.info },
  };
  return map[species] || { bg: T.bgAlt, text: T.textSub };
}

function getStatusMeta(status, T) {
  const map = {
    Available:   { bg: T.success, label: "Available" },
    "In Foster": { bg: T.warning, label: "In Foster" },
    "On Hold":   { bg: T.info,    label: "On Hold" },
  };
  return map[status] || { bg: T.textSub, label: status || "Available" };
}
export default function AnimalCard({ animal, i, onAdopt }) {
  const { T } = useT();
  const [hov,       setHov]       = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [heartPop,  setHeartPop]  = useState(false);

  const sc = getSpeciesColors(animal.species, T);
  const st = getStatusMeta(animal.status, T);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setFavorited((f) => !f);
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 400);
  };

  return (
    <motion.div
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={vFadeUp}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${hov ? T.borderHov : T.border}`,
        background: T.bgCard,
        cursor: "pointer",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? T.shadowHov : T.shadow,
        transition: "all 0.25s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", flexShrink: 0 }}>
        <img
          src={animal.img}
          alt={animal.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.55s ease",
            transform: hov ? "scale(1.07)" : "scale(1)",
            display: "block",
          }}
        />
        {/* Status badge */}
        <div
          style={{
            position: "absolute",
            top: "0.6rem",
            left: "0.6rem",
            padding: "0.2rem 0.65rem",
            borderRadius: 20,
            background: st.bg,
            color: T.textOnAccent,
            fontSize: "0.62rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          {st.label}
        </div>

        {/* Species badge */}
        <div
          style={{
            position: "absolute",
            top: "0.6rem",
            right: "0.6rem",
            padding: "0.2rem 0.55rem",
            borderRadius: 20,
            background: sc.bg,
            color: sc.text,
            fontSize: "0.62rem",
            fontWeight: 700,
            border: `1px solid ${sc.text}22`,
            backdropFilter: "blur(8px)",
          }}
        >
          {animal.species}
        </div>

        {/* Since overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "0.6rem",
            right: "0.6rem",
            fontSize: "0.6rem",
            color: T.textMuted,
            background: T.bgGlass,
            backdropFilter: "blur(10px)",
            border: `1px solid ${T.borderGlass}`,
            borderRadius: 10,
            padding: "0.18rem 0.5rem",
            fontWeight: 500,
          }}
        >
          Listed {animal.since} ago
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "clamp(1rem, 2vw, 1.3rem)", display: "flex", flexDirection: "column", gap: "0.65rem", flex: 1 }}>

        {/* Name + gender */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "clamp(1rem, 2vw, 1.1rem)", fontWeight: 800, margin: 0, color: T.text }}>{animal.name}</h3>
          <span
            style={{
              fontSize: "0.68rem",
              color: T.textSub,
              background: T.bgAlt,
              border: `1px solid ${T.border}`,
              padding: "0.18rem 0.55rem",
              borderRadius: 20,
            }}
          >
            {animal.gender}
          </span>
        </div>

        {/* Breed + age */}
        <p style={{ fontSize: "0.76rem", color: T.textSub, margin: 0 }}>
          {animal.breed} · {animal.age} · {animal.weight}
        </p>

        {/* Health tags */}
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {animal.vaccinated && (
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: T.accent,
                background: T.accentPale,
                border: `1px solid ${T.accentGlow}`,
                padding: "0.15rem 0.5rem",
                borderRadius: 20,
              }}
            >
              ✓ Vaccinated
            </span>
          )}
          {animal.neutered && (
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: T.accent,
                background: T.accentPale,
                border: `1px solid ${T.accentGlow}`,
                padding: "0.15rem 0.5rem",
                borderRadius: 20,
              }}
            >
              ✓ Neutered
            </span>
          )}
        </div>

        {/* Rescue story */}
        <p
          style={{
            fontSize: "0.72rem",
            color: T.textMuted,
            lineHeight: 1.65,
            margin: 0,
            fontStyle: "italic",
            borderLeft: `2px solid ${T.accentGlow}`,
            paddingLeft: "0.6rem",
          }}
        >
          {animal.rescueStory}
        </p>

        {/* NGO source */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
          <span style={{ fontSize: "0.65rem", color: T.textSub }}>{animal.ngo} · {animal.city}</span>
        </div>

        {/* Compatibility tags */}
        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
          {animal.compatibility.map((c) => (
            <span
              key={c}
              style={{
                fontSize: "0.58rem",
                color: T.textSub,
                background: T.bgAlt,
                border: `1px solid ${T.border}`,
                padding: "0.12rem 0.45rem",
                borderRadius: 20,
              }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ marginTop: "auto", paddingTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
          <Button
            variant="primary"
            size="sm"
            style={{ flex: 1 }}
            onClick={() => onAdopt(animal)}
          >
            Meet {animal.name}
          </Button>

          {/* Favorite heart */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            animate={heartPop ? { scale: [1, 1.45, 1] } : {}}
            onClick={handleFavorite}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              border: `1px solid ${favorited ? T.accent : T.border}`,
              background: favorited ? T.accentPale : T.bgCard,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.25s, border-color 0.25s",
            }}
            title={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={favorited ? T.accent : "none"}
              stroke={favorited ? T.accent : T.textSub}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
