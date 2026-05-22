import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { formatTime, getSeverityMeta, normalizeImageUrl } from "./scannerUtils";
import SeverityBadge from "./SeverityBadge";

/**
 * ScannerHistoryCard - Individual scan history card
 * Displays scan result thumbnail, animal info, and metadata
 */
export default function ScannerHistoryCard({ scan, onImageError }) {
  const { T } = useT();
  const vp = useViewport();

  const severity = getSeverityMeta(scan.predictedSeverity || scan.analysis?.severity);
  const recommendation = scan.recommendations?.[0] || scan.analysis?.recommendation || "No action suggested";
  const rawImageUrl = scan.imageUrl || scan.image || scan.analysis?.imageUrl;
  const imageUrl = normalizeImageUrl(rawImageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "grid",
        gap: "1rem",
        borderRadius: 22,
        border: `1px solid ${T.border}`,
        background: T.bgCard,
        overflow: "hidden",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={scan.analysis?.animal || "Scanned animal"}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={() => onImageError?.(imageUrl)}
          style={{ width: "100%", height: 170, objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 170,
            background: T.bgAlt,
            display: "grid",
            placeItems: "center",
            color: T.textMuted,
          }}
        >
          No image available
        </div>
      )}
      <div style={{ padding: "1rem", display: "grid", gap: "0.7rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.93rem", fontWeight: 700, color: T.text }}>
              {scan.analysis?.animal || scan.animal || "Unknown animal"}
            </div>
            <div style={{ fontSize: "0.78rem", color: T.textMuted }}>
              {formatTime(scan.createdAt || scan.timestamp)}
            </div>
          </div>
          <SeverityBadge severity={scan.predictedSeverity || scan.analysis?.severity || "unknown"} />
        </div>
        <div style={{ color: T.textMuted, lineHeight: 1.6, minHeight: 56 }}>
          {recommendation}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            fontSize: "0.82rem",
            color: T.textMuted,
          }}
        >
          <span>Confidence: {scan.confidence ?? scan.analysis?.confidence ?? "—"}%</span>
          <span>{scan.priority ? scan.priority.toUpperCase() : "PRIORITY N/A"}</span>
        </div>
      </div>
    </motion.div>
  );
}
