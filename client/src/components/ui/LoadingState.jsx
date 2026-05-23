import React from "react";
import { useT } from "../../context/ThemeContext";

export function LoadingState({ message = "Loading...", height = "200px" }) {
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
        border: `1px solid ${T.border}`,
        borderRadius: "12px",
        color: T.textSub,
        gap: "1rem",
      }}
    >
      <div className="spinner" style={{
        width: "2rem",
        height: "2rem",
        border: `3px solid ${T.border}`,
        borderTopColor: T.accent,
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{message}</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
