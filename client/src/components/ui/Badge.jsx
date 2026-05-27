import { useT } from "../../context/ThemeContext";

export default function Badge({ children, variant = "neutral", dot = false, size = "sm" }) {
  const { T } = useT();

  const variants = {
    success: { bg: T.successPale,  border: T.successBorder, color: T.success },
    warning: { bg: T.warningPale,  border: `${T.warning}33`, color: T.warning },
    danger:  { bg: T.dangerPale,   border: T.dangerBorder,   color: T.danger },
    info:    { bg: T.infoPale,     border: `${T.info}33`,    color: T.info },
    accent:  { bg: T.accentPale,   border: `${T.accent}40`,  color: T.accent },
    neutral: { bg: T.bgAlt,        border: T.border,         color: T.textSub },
    pending: { bg: T.infoPale,     border: `${T.info}33`,    color: T.info },
  };

  const sizes = {
    xs: { padding: "0.12rem 0.5rem",  fontSize: "0.62rem" },
    sm: { padding: "0.2rem 0.65rem",  fontSize: "0.7rem" },
    md: { padding: "0.3rem 0.85rem",  fontSize: "0.78rem" },
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
