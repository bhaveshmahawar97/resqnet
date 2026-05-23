import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import useNgos from "../../hooks/useNgos";
import Button from "../ui/Button";
import SkeletonCard from "../system/SkeletonCard";
import EmptyState from "../system/EmptyState";

export default function NGOPreviewSection() {
  const { T } = useT();
  const { data: ngos = [], loading } = useNgos({ limit: 4 });
  const previewNgos = ngos.filter(n => n.verified).slice(0, 4);

  return (
    <section
      id="ngo-network"
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 7vw, 5.5rem) 0",
        background: T.bgAlt,
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
              fontSize: "0.6875rem", fontWeight: 700, color: T.success || "#059669",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.success || "#059669" }} />
            Partner Network
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
            Trusted NGO{" "}
            <span style={{ color: T.success || "#059669" }}>partners</span>
          </h2>
          <p
            style={{
              fontSize: "clamp(0.82rem, 1.5vw, 0.92rem)",
              color: T.textSub,
              lineHeight: 1.7,
            }}
          >
            A growing network of verified animal welfare organizations
            ready to respond across India.
          </p>
        </motion.div>

        {/* NGO cards */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "0.875rem", marginBottom: "2rem" }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} height={140} />)}
          </div>
        ) : previewNgos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "0.875rem",
              marginBottom: "2rem",
            }}
          >
            {previewNgos.map((ngo) => {
              const name = ngo.organizationName || ngo.name || "Partner NGO";
              const city = ngo.city || ngo.location || "India";
              const tags = (ngo.specialties || ngo.services || []).slice(0, 3);

              return (
                <div
                  key={ngo._id || name}
                  style={{
                    padding: "1.125rem",
                    background: T.bgCard,
                    border: `1px solid ${T.border}`,
                    borderRadius: 14,
                    transition: "box-shadow 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.65rem" }}>
                    <div
                      style={{
                        width: 38, height: 38, borderRadius: 9,
                        background: T.successPale || "rgba(5,150,105,0.07)",
                        border: `1px solid ${T.successBorder || "rgba(5,150,105,0.15)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: T.success || "#059669",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text, lineHeight: 1.2 }}>
                        {name}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: T.textMuted, marginTop: "0.1rem" }}>
                        {city}
                      </div>
                    </div>
                  </div>
                  {tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                      {tags.map((s) => (
                        <span
                          key={s}
                          style={{
                            fontSize: "0.62rem", fontWeight: 600, color: T.textMuted,
                            background: T.bgMuted || T.bgAlt,
                            padding: "0.15rem 0.45rem", borderRadius: 4,
                            textTransform: "capitalize",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        ) : (
          <EmptyState icon="🏢" title="No NGO Partners Found" message="We are actively onboarding new NGO partners. Check back soon!" minHeight="200px" />
        )}

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link to="/ngos">
            <Button variant="ghost" size="md">
              View All NGO Partners →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
