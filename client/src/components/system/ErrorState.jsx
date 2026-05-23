import { useT } from "../../context/ThemeContext";

export default function ErrorState({ message = "An unexpected error occurred.", onRetry, minHeight = "200px" }) {
  const { T } = useT();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight,
        padding: "2rem",
        textAlign: "center",
        background: `${T.error}10`,
        borderRadius: "12px",
        border: `1px solid ${T.error}30`,
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "1rem", color: T.error }}>
        ⚠️
      </div>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: T.error, margin: "0 0 0.5rem 0" }}>
        Something went wrong
      </h3>
      <p style={{ fontSize: "0.85rem", color: T.error, opacity: 0.8, maxWidth: "400px", margin: "0 0 1.5rem 0", lineHeight: 1.5 }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: T.error,
            background: "transparent",
            border: `1px solid ${T.error}`,
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
