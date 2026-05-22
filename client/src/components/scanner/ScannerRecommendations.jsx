import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import RecommendationCard from "./RecommendationCard";

/**
 * ScannerRecommendations - AI recommendations panel
 * Shows emergency recommendations and suggested actions
 */
export default function ScannerRecommendations({ result }) {
  const { T } = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      style={{
        borderRadius: 24,
        border: `1px solid ${T.border}`,
        background: T.bgCard,
        padding: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.92rem", color: T.textMuted }}>Emergency recommendation</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: T.text }}>
            {result?.recommendation || "No recommendation yet"}
          </div>
        </div>
      </div>

      {result?.recommendations?.length > 0 ? (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {result.recommendations.map((item, index) => (
            <RecommendationCard key={index}>{item}</RecommendationCard>
          ))}
        </div>
      ) : (
        <div style={{ color: T.textMuted, lineHeight: 1.7 }}>
          Use the scanner to generate AI-led recommendations and safe rescue actions.
        </div>
      )}
    </motion.div>
  );
}
