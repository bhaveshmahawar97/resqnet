import { useT } from "../../context/ThemeContext";
import Button from "./Button";

export function EmptyState({ icon: Icon, title, description, message, actionLabel, onAction, height = "250px" }) {
  const { T } = useT();
  const text = description || message;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: height,
        width: "100%",
        padding: "2rem",
        background: T.bgCard,
        border: `1px dashed ${T.border}`,
        borderRadius: "12px",
        textAlign: "center",
        gap: "0.65rem",
      }}
    >
      {Icon && (
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: T.bgAlt,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: T.textMuted,
        }}>
          {typeof Icon === "function" || (typeof Icon === "object" && Icon.render) ? <Icon size={20} /> : <span style={{ fontSize: "1.25rem" }}>{Icon}</span>}
        </div>
      )}
      <div>
        <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: T.textHeading, margin: "0 0 0.3rem" }}>
          {title}
        </h3>
        {text && (
          <p style={{ fontSize: "0.78rem", color: T.textSub, maxWidth: "280px", margin: 0, lineHeight: 1.5 }}>
            {text}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">{actionLabel}</Button>
      )}
    </div>
  );
}

export default EmptyState;
