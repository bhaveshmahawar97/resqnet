import { useAuth } from "../../context/AuthContext";
import { useT } from "../../context/ThemeContext";

export default function AuthLoaderGate({ children }) {
  const { loading } = useAuth();
  const { T } = useT();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: T.bg,
          color: T.text,
          gap: "1rem",
        }}
      >
        <div 
          style={{ 
            width: 32, 
            height: 32, 
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
          Initializing Platform...
        </span>
      </div>
    );
  }

  return children;
}
