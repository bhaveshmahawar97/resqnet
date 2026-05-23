import React from "react";
import { useT } from "../../context/ThemeContext";
import Button from "./Button";

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, height = "250px" }) {
  const { T } = useT();

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
          color: T.textMuted
        }}>
          <Icon size={24} />
        </div>
      )}
      <h3 style={{ fontSize: "1rem", fontWeight: 600, color: T.textHeading, marginBottom: "0.5rem" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.875rem", color: T.textSub, maxWidth: "300px", marginBottom: actionLabel ? "1.5rem" : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
