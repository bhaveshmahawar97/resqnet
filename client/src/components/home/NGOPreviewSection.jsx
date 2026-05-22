import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { vFadeUp } from "../../animations/variants";
import Label from "../ui/Label";
import Button from "../ui/Button";
import NgoCard from "../ngo/NgoCard";
import useNgos from "../../hooks/useNgos";

const SkeletonCard = ({ T }) => (
  <div
    style={{
      height: 110,
      background: T.bgCard,
      borderRadius: 14,
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

export default function NGOPreviewSection() {
  const { T } = useT();
  const { data: ngos, loading, error } = useNgos({ limit: 6, sort: "latest" });

  return (
    <section
      id="for-ngos"
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 7vw, 5.5rem) 0",
        background: T.bg,
        position: "relative",
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
            <Label>NGO Network</Label>
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
              Verified rescue partners
              <br />
              <span
                style={{
                  background: `linear-gradient(100deg, ${T.accent}, ${T.accentDim})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                across India.
              </span>
            </h2>
            <p
              style={{
                fontSize: "clamp(0.82rem, 1.6vw, 0.95rem)",
                color: T.textSub,
                margin: 0,
                lineHeight: 1.65,
                maxWidth: 420,
              }}
            >
              Every listed NGO is verified by our admin team. Connect with
              the right partner instantly.
            </p>
          </div>

          <Link to="/ngos">
            <Button variant="outline" size="sm">
              View All NGOs →
            </Button>
          </Link>
        </motion.div>

        {/* NGO grid */}
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
            Unable to load NGO data. Please try again later.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "clamp(0.65rem, 1.5vw, 1rem)",
            }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} T={T} />
                ))
              : ngos.map((n) => (
                  <motion.div
                    key={n._id || n.name}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-40px" }}
                    variants={vFadeUp}
                  >
                    <NgoCard ngo={n} />
                  </motion.div>
                ))}
          </div>
        )}

        {/* Bottom CTA strip */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={vFadeUp}
          viewport={{ once: true }}
          style={{
            marginTop: "clamp(1.5rem, 3vw, 2.5rem)",
            padding: "clamp(1.25rem, 2.5vw, 1.75rem) clamp(1.25rem, 3vw, 2rem)",
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                fontWeight: 700,
                color: T.text,
                marginBottom: "0.25rem",
              }}
            >
              Are you an NGO?
            </div>
            <div
              style={{ fontSize: "0.82rem", color: T.textSub, lineHeight: 1.55 }}
            >
              Join the ResQNet network — get visibility, tools, and funding support.
            </div>
          </div>
          <Link to="/register">
            <Button variant="primary" size="sm">
              Register Your NGO
            </Button>
          </Link>
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
