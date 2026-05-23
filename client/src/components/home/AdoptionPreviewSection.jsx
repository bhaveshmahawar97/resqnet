import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import useAdoptions from "../../hooks/useAdoptions";
import Button from "../ui/Button";

export default function AdoptionPreviewSection() {
  const { T } = useT();
  const { adoptions = [], loading } = useAdoptions();
  const previewPets = adoptions.slice(0, 4);

  return (
    <section
      id="adoption"
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 7vw, 5.5rem) 0",
        background: T.bg,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 4vw, 3rem)",
        }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: "center",
            maxWidth: 560,
            margin: "0 auto clamp(2rem, 4vw, 3rem)",
          }}
        >
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "0.6875rem", fontWeight: 700, color: T.warning || "#D97706",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.warning || "#D97706" }} />
            Adopt & Rehome
          </div>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: T.textHeading,
              margin: "0 0 0.65rem",
              lineHeight: 1.2,
            }}
          >
            Give them a{" "}
            <span style={{ color: T.warning || "#D97706" }}>forever home</span>
          </h2>
          <p
            style={{
              fontSize: "clamp(0.82rem, 1.5vw, 0.92rem)",
              color: T.textSub,
              lineHeight: 1.7,
            }}
          >
            Browse rescued animals ready for adoption. Every adoption
            frees up shelter space for the next rescue.
          </p>
        </motion.div>

        {/* Pet cards */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem 0", color: T.textMuted, fontSize: "0.85rem" }}>
            Loading adoption listings...
          </div>
        ) : previewPets.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
              gap: "0.875rem",
              marginBottom: "2rem",
            }}
          >
            {previewPets.map((pet) => {
              const imgUrl = pet.images?.[0] || pet.image;
              return (
                <div
                  key={pet._id || pet.name}
                  style={{
                    background: T.bgCard,
                    border: `1px solid ${T.border}`,
                    borderRadius: 14,
                    overflow: "hidden",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = T.shadowHov || "0 4px 16px rgba(15,23,42,0.07)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: "100%", height: 160,
                      background: T.bgAlt,
                      overflow: "hidden",
                    }}
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={pet.name || "Pet"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{
                        width: "100%", height: "100%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: T.textMuted, fontSize: "2rem",
                      }}>
                        🐾
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "0.875rem" }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: T.text, marginBottom: "0.2rem" }}>
                      {pet.name || "Unnamed"}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: T.textMuted, display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {pet.species && <span>{pet.species}</span>}
                      {pet.breed && <span>· {pet.breed}</span>}
                      {pet.age && <span>· {pet.age}</span>}
                    </div>
                    {pet.status && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          display: "inline-flex", alignItems: "center", gap: "0.25rem",
                          fontSize: "0.62rem", fontWeight: 600,
                          color: T.success || "#059669",
                          background: T.successPale || "rgba(5,150,105,0.07)",
                          padding: "0.15rem 0.45rem", borderRadius: 4,
                          textTransform: "capitalize",
                        }}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
                        {pet.status}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem 0", color: T.textMuted, fontSize: "0.85rem" }}>
            No pets available for adoption yet.
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link to="/adoption">
            <Button variant="ghost" size="md">
              Browse All Adoptions →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
