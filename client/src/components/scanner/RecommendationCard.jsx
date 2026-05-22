import { useT } from "../../context/ThemeContext";

/**
 * RecommendationCard — single AI recommendation item
 */
export default function RecommendationCard({ children }) {
  const { T } = useT();

  return (
    <div
      style={{
        padding: "0.95rem 1rem",
        borderRadius: 16,
        background: T.bgAlt,
        color: T.text,
        fontSize: "0.94rem",
      }}
    >
      • {children}
    </div>
  );
}
