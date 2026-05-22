import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import Label from "../ui/Label";
import Button from "../ui/Button";
import PetCard from "../adoption/PetCard";
import useAdoptions from "../../hooks/useAdoptions";

const SkeletonCard = ({ T }) => (
  <div
    style={{
      height: 80,
      background: T.bgCard,
      borderRadius: 12,
      border: `1px solid ${T.border}`,
      overflow: "hidden",
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(90deg, transparent, ${T.bgAlt}, transparent)`,
        animation: "shimmer 1.6s infinite",
      }}
    />
  </div>
);

export default function AdoptionPreviewSection() {
  const { T } = useT();
  const { data: pets, loading, error } = useAdoptions(6);

  return (
    <section
      id="adopt"
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 7vw, 5.5rem) 0",
        background: T.bgAlt,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-10vw",
          top: "10%",
          width: "35vw",
          height: "35vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${T.accentPale} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={vFadeUp}
          viewport={{ once: true }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "clamp(1.5rem, 3vw, 2.25rem)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <Label>Adopt a Friend</Label>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                color: T.text,
                margin: "0.4rem 0 0.5rem",
                lineHeight: 1.15,
              }}
            >
              Animals ready for
              <br />
              <span
                style={{
                  background: `linear-gradient(100deg, ${T.accent}, ${T.accentDim})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                a loving home.
              </span>
            </h2>
            <p
              style={{
                fontSize: "clamp(0.82rem, 1.6vw, 0.95rem)",
                color: T.textSub,
                margin: 0,
                lineHeight: 1.65,
                maxWidth: 400,
              }}
            >
              Rescued, rehabilitated, and ready. Browse the latest listings
              from verified partner NGOs.
            </p>
          </div>

          <Link to="/adopt">
            <Button variant="outline" size="sm">
              Browse All Animals →
            </Button>
          </Link>
        </motion.div>

        {/* Pet grid */}
        {error ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: T.textMuted,
              fontSize: "0.85rem",
              border: `1px dashed ${T.border}`,
              borderRadius: 14,
            }}
          >
            Unable to load adoption listings. Please try again later.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "clamp(0.65rem, 1.5vw, 1rem)",
            }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} T={T} />
                ))
              : pets.map((p, i) => (
                  <motion.div
                    key={p._id || p.name}
                    custom={i}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-40px" }}
                    variants={vFadeUp}
                  >
                    <PetCard pet={p} />
                  </motion.div>
                ))}
          </div>
        )}

        {/* How it works strip */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={vFadeUp}
          viewport={{ once: true }}
          style={{
            marginTop: "clamp(2rem, 4vw, 3rem)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "clamp(0.75rem, 2vw, 1.25rem)",
          }}
        >
          {[
            { step: "01", title: "Browse", desc: "Find your match by species, breed, or location." },
            { step: "02", title: "Apply", desc: "Fill a quick adoption form — takes 2 minutes." },
            { step: "03", title: "Meet", desc: "The NGO schedules a meet-and-greet with you." },
            { step: "04", title: "Adopt", desc: "Welcome your new family member home." },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                padding: "clamp(1rem, 2.5vw, 1.5rem)",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  color: T.accent,
                  letterSpacing: "0.08em",
                  marginBottom: "0.4rem",
                }}
              >
                STEP {item.step}
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: T.text,
                  marginBottom: "0.25rem",
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: "0.78rem", color: T.textSub, lineHeight: 1.55 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
