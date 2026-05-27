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
      }}
    >
      {Icon && (
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: T.bgAlt,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          color: T.textMuted,
        }}>
          {typeof Icon === "string" ? (
            <span style={{ fontSize: "1.5rem" }}>{Icon}</span>
          ) : (
            <Icon size={24} />
          )}
        </div>
      )}
      <h3 style={{ fontSize: "1rem", fontWeight: 600, color: T.textHeading, marginBottom: "0.5rem", margin: "0 0 0.5rem" }}>
        {title}
      </h3>
      {text && (
        <p style={{ fontSize: "0.875rem", color: T.textSub, maxWidth: "300px", margin: "0 0 1.5rem" }}>
          {text}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">{actionLabel}</Button>
      )}
    </div>
  );
}

export default EmptyState;
