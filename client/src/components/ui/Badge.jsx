import { useT } from "../../context/ThemeContext";

/**
 * ResQNet — Badge Component
 * Standardized status/category badges
 * Variants: success | warning | danger | info | accent | neutral | pending
 */
export default function Badge({ children, variant = "neutral", dot = false, size = "sm" }) {
  const { T } = useT();

  const variants = {
    success: {
      bg: T.successPale || "rgba(5,150,105,0.09)",
      border: T.successBorder || "rgba(5,150,105,0.3)",
      color: T.success || "#059669",
    },
    warning: {
      bg: T.warningPale || "rgba(217,119,6,0.09)",
      border: "rgba(217,119,6,0.3)",
      color: T.warning || "#D97706",
    },
    danger: {
      bg: T.dangerPale || "rgba(220,38,38,0.08)",
      border: T.dangerBorder || "rgba(220,38,38,0.25)",
      color: T.danger || "#DC2626",
    },
    info: {
      bg: T.infoPale || "rgba(14,165,233,0.09)",
      border: "rgba(14,165,233,0.3)",
      color: T.info || "#0EA5E9",
    },
    accent: {
      bg: T.accentPale,
      border: `${T.accent}40`,
      color: T.accent,
    },
    neutral: {
      bg: T.bgAlt,
      border: T.border,
      color: T.textSub,
    },
    pending: {
      bg: "rgba(147,51,234,0.09)",
      border: "rgba(147,51,234,0.3)",
      color: "#9333EA",
    },
  };

  const sizes = {
    xs: { padding: "0.12rem 0.5rem", fontSize: "0.62rem" },
    sm: { padding: "0.2rem 0.65rem", fontSize: "0.7rem" },
    md: { padding: "0.3rem 0.85rem", fontSize: "0.78rem" },
  };

  const v = variants[variant] || variants.neutral;
  const s = sizes[size] || sizes.sm;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: s.padding,
        borderRadius: 9999,
        fontSize: s.fontSize,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        background: v.bg,
        border: `1px solid ${v.border}`,
        color: v.color,
        lineHeight: 1.4,
      }}
    >
      {dot && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: v.color,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
