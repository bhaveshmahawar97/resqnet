import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import Label from "../ui/Label";
import { vFadeUp } from "../../animations/variants";

const SUCCESS_STORIES = [
  {
    adoptee: "Rahul & Priya Sharma",
    animal: "Buddy (now Sheru)",
    breed: "Labrador Mix · 3 yrs",
    quote: "We never imagined a rescue dog would bond this fast with our toddler. Sheru is our family's heartbeat now. ResQNet made the whole process transparent and trustworthy.",
    city: "Mumbai",
    outcome: "Adopted 6 months ago",
    img: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=400&q=75",
  },
  {
    adoptee: "Ananya Krishnan",
    animal: "Mittens",
    breed: "Persian Mix · 2 yrs",
    quote: "As a first-time cat owner living alone, the AI compatibility matching gave me so much confidence. Mittens was exactly the calm, indoor-loving companion I needed.",
    city: "Bengaluru",
    outcome: "Adopted 3 months ago",
    img: "https://images.unsplash.com/photo-1543955430-d5b784b96494?w=400&q=75",
  },
  {
    adoptee: "The Mehta Family",
    animal: "Pepper",
    breed: "Indie Street Dog · 4 yrs",
    quote: "Our kids learn about compassion every day from Pepper. He came from a tough background but you'd never know it. The transition support from the NGO was excellent.",
    city: "Pune",
    outcome: "Adopted 1 year ago",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=75",
  },
];
export default function SuccessStories() {
  const { T } = useT();

  return (
    <section
      style={{
        width: "100%",
        padding: "clamp(3.5rem, 8vw, 6rem) 0",
        background: T.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "3px",
          height: "100%",
          background: `linear-gradient(to bottom, transparent, ${T.accent}, transparent)`,
        }}
      />

      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={vFadeUp}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          <Label>Success Stories</Label>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: T.text,
              margin: 0,
            }}
          >
            Families made whole.<br />Lives forever changed.
          </h2>
        </motion.div>

        <div
          style={{
            display: "flex",
            gap: "clamp(0.75rem, 2vw, 1.25rem)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {SUCCESS_STORIES.map((story, i) => (
            <motion.div
              key={story.adoptee}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={vFadeUp}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 18,
                padding: "clamp(1.3rem, 2.5vw, 1.8rem)",
                flex: "1 1 clamp(260px, 28vw, 370px)",
                boxShadow: `0 2px 18px ${T.shadow}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Large quote mark */}
              <div
                style={{
                  position: "absolute",
                  top: "0.8rem",
                  right: "1.2rem",
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  color: T.accentPale,
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                &ldquo;
              </div>

              {/* Animal image + name */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
                <img
                  src={story.img}
                  alt={story.animal}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    objectFit: "cover",
                    border: `2px solid ${T.accentGlow}`,
                  }}
                />
                <div>
                  <div style={{ fontSize: "0.86rem", fontWeight: 800, color: T.text }}>{story.animal}</div>
                  <div style={{ fontSize: "0.68rem", color: T.textMuted }}>{story.breed}</div>
                </div>
              </div>

              {/* Accent dots (stars) */}
              <div style={{ display: "flex", gap: 3, marginBottom: "0.85rem" }}>
                {[...Array(5)].map((_, k) => (
                  <div
                    key={k}
                    style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }}
                  />
                ))}
              </div>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: T.textSub,
                  lineHeight: 1.78,
                  margin: "0 0 1.25rem",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{story.quote}&rdquo;
              </p>

              <div
                style={{
                  borderTop: `1px solid ${T.border}`,
                  paddingTop: "0.9rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text }}>{story.adoptee}</div>
                  <div style={{ fontSize: "0.68rem", color: T.textMuted }}>{story.outcome}</div>
                </div>
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: T.accent,
                    background: T.accentPale,
                    padding: "0.18rem 0.55rem",
                    borderRadius: 20,
                    fontWeight: 600,
                  }}
                >
                  {story.city}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
