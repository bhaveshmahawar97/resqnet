import { useT } from "../../context/ThemeContext";

export default function LoadingState({ message = "Loading...", minHeight = "200px" }) {
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
        background: "transparent",
        color: T.text,
        gap: "1rem",
      }}
    >
      <div 
        style={{ 
          width: 28, 
          height: 28, 
          border: `3px solid ${T.border}`, 
          borderTopColor: T.accent, 
          borderRadius: "50%", 
          animation: "spin 1s linear infinite" 
        }} 
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: T.textMuted, letterSpacing: "0.02em" }}>
        {message}
      </span>
    </div>
  );
}
