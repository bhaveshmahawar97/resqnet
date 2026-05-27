import { useT } from "../../context/ThemeContext";

export default function EmptyState({
  icon,
  title = "No data found",
  message,
  actionLabel,
  onAction,
  minHeight = "200px",
}) {
  const { T } = useT();

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === "string") {
      return (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: T.bgAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.textMuted,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
      );
    }
    const Icon = icon;
    return (
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: T.bgAlt,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: T.textMuted,
        }}
      >
        <Icon size={20} />
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight,
        padding: "2rem 1.5rem",
        textAlign: "center",
        background: T.bgCard,
        borderRadius: 12,
        border: `1px dashed ${T.border}`,
        gap: "0.65rem",
      }}
    >
      {renderIcon()}
      <div>
        <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: T.text, margin: "0 0 0.3rem", letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        {message && (
          <p style={{ fontSize: "0.78rem", color: T.textMuted, margin: 0, lineHeight: 1.55, maxWidth: 280 }}>
            {message}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.bgAlt,
            color: T.text,
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
