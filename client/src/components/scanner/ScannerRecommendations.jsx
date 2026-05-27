import { Link } from "react-router-dom";
import { useT } from "../../context/ThemeContext";

const CATEGORY_ICONS = {
  care: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  ngo: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  transport: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  monitor: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

function getIcon(text) {
  const lower = text.toLowerCase();
  if (lower.includes("ngo") || lower.includes("rescue") || lower.includes("contact")) return "ngo";
  if (lower.includes("transport") || lower.includes("move") || lower.includes("clinic")) return "transport";
  if (lower.includes("monitor") || lower.includes("watch") || lower.includes("observe")) return "monitor";
  return "care";
}

export default function ScannerRecommendations({ result }) {
  const { T } = useT();

  if (!result) {
    return (
      <div
        style={{
          background: T.bgCard,
          border: `1px dashed ${T.border}`,
          borderRadius: 10,
          padding: "1.5rem 1rem",
          textAlign: "center",
          color: T.textMuted,
          fontSize: "0.78rem",
        }}
      >
        Recommendations will appear after a scan completes.
      </div>
    );
  }

  const items = Array.isArray(result.recommendations) ? result.recommendations
    : result.recommendation ? [result.recommendation]
    : [];

  return (
    <div
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "0.6rem 1rem",
          borderBottom: `1px solid ${T.border}`,
          background: T.bgAlt,
          fontSize: "0.66rem",
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Clinical Recommendations
      </div>

      {items.length > 0 ? (
        <div style={{ padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {items.map((item, i) => {
            const cat = getIcon(item);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                  paddingBottom: i < items.length - 1 ? "0.65rem" : 0,
                  borderBottom: i < items.length - 1 ? `1px solid ${T.borderLight}` : "none",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: T.accentPale,
                    color: T.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "0.1rem",
                  }}
                >
                  {CATEGORY_ICONS[cat]}
                </div>
                <span style={{ fontSize: "0.8rem", color: T.text, lineHeight: 1.55 }}>{item}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: "1rem", color: T.textMuted, fontSize: "0.78rem" }}>
          No specific recommendations available for this scan.
        </div>
      )}

      {/* Report animal CTA */}
      <div
        style={{
          padding: "0.65rem 1rem",
          borderTop: `1px solid ${T.border}`,
          background: T.bgAlt,
        }}
      >
        <Link
          to="/rescue"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.76rem",
            fontWeight: 700,
            color: T.danger,
            textDecoration: "none",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          Report this animal for rescue
        </Link>
      </div>
    </div>
  );
}
