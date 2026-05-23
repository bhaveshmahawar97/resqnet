import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import ScannerLoader from "./ScannerLoader";
import ScannerHistoryCard from "./ScannerHistoryCard";
import { fetchScanHistory } from "../../services/aiService";
import { getApiErrorMessage } from "../../utils/apiErrors";

export default function ScannerHistory() {
  const { T } = useT();
  const vp = useViewport();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadScanHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const { scans = [] } = await fetchScanHistory({ limit: 8, page: 1 });
      setHistory(scans);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to load scan history."));
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScanHistory();
  }, []);

  return (
    <section style={{ marginTop: "2rem" }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: T.text }}>Scan history</div>
          <div style={{ fontSize: "0.88rem", color: T.textMuted }}>
            Recent AI scans saved in the ResQNet AI database.
          </div>
        </div>
        <button
          type="button"
          onClick={loadScanHistory}
          disabled={loading}
          style={{
            padding: "0.8rem 1rem",
            borderRadius: 10,
            border: `1px solid ${T.border}`,
            background: T.bgAlt,
            color: T.text,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading…" : "Refresh history"}
        </button>
      </motion.div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {loading ? (
          <ScannerLoader label="Loading scan history…" />
        ) : error ? (
          <div
            style={{
              padding: "1.5rem",
              borderRadius: 12,
              border: "1px solid #DC2626",
              background: "rgba(220,38,38,0.08)",
              color: "#B91C1C",
            }}
          >
            {error}
          </div>
        ) : history.length === 0 ? (
          <div
            style={{
              padding: "1.5rem",
              borderRadius: 12,
              border: `1px solid ${T.border}`,
              background: T.bgCard,
              color: T.textMuted,
            }}
          >
            No scans yet. Run an AI scan to build your history.
          </div>
        ) : (
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: vp.mobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {history.map((scan) => (
              <ScannerHistoryCard
                key={scan.scanId || scan._id || scan.timestamp}
                scan={scan}
                onImageError={() => {}}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

