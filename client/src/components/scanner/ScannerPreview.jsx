import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import ScannerEmpty from "./ScannerEmpty";

/**
 * ScannerPreview — image preview with processing overlay
 */
export default function ScannerPreview({ previewUrl, isProcessing }) {
  const { T } = useT();

  if (!previewUrl) {
    return <ScannerEmpty />;
  }

  return (
    <div style={{ position: "relative", width: "100%", padding: "1rem" }}>
      <img
        src={previewUrl}
        alt="Animal preview"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        style={{
          width: "100%",
          maxHeight: 360,
          objectFit: "contain",
          borderRadius: "var(--radius-lg)",
          display: "block",
        }}
      />

      {/* Processing Overlay */}
      {isProcessing && (
        <>
          {/* Scanning Border */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              position: "absolute",
              inset: "1rem",
              borderRadius: "var(--radius-lg)",
              border: `3px solid ${T.accent}`,
              pointerEvents: "none",
              boxShadow: `0 0 20px ${T.accent}60`,
            }}
          />

          {/* Scanning Line */}
          <motion.div
            animate={{ top: ["1rem", "calc(100% - 1rem)", "1rem"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              left: "1rem",
              right: "1rem",
              height: 3,
              background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
              boxShadow: `0 0 12px ${T.accent}`,
              pointerEvents: "none",
            }}
          />

          {/* Processing Badge */}
          <div style={{
            position: "absolute",
            top: "1.75rem",
            right: "1.75rem",
            padding: "0.4rem 0.75rem",
            borderRadius: "var(--radius-full)",
            background: `${T.accent}95`,
            backdropFilter: "blur(8px)",
            border: `1px solid ${T.accent}`,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            boxShadow: `0 4px 12px ${T.accent}40`,
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 12,
                height: 12,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
              }}
            />
            <span style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}>
              Analyzing
            </span>
          </div>
        </>
      )}
    </div>
  );
}
