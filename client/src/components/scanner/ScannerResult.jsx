import { useT } from "../../context/ThemeContext";
import { Link } from "react-router-dom";
import { formatTime } from "./scannerUtils";
import { getSeverityStyle } from "../../constants/ui";

function Section({ title, children, T }) {
  return (
    <div
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "0.6rem 1rem",
          borderBottom: `1px solid ${T.border}`,
          background: T.bgAlt,
          fontSize: "0.66rem",
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      <div style={{ padding: "0.85rem 1rem" }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, T }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", padding: "0.3rem 0", borderBottom: `1px solid ${T.borderLight}` }}>
      <span style={{ fontSize: "0.72rem", color: T.textMuted, fontWeight: 600, minWidth: 90, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: "0.82rem", color: T.text, fontWeight: 500 }}>{value || "—"}</span>
    </div>
  );
}

export default function ScannerResult({ result }) {
  const { T } = useT();

  if (!result) {
    return (
      <div
        style={{
          background: T.bgCard,
          border: `1px dashed ${T.border}`,
          borderRadius: 12,
          padding: "2.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: T.bgAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.textMuted,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
            <circle cx="12" cy="12" r="3.5" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.text, marginBottom: "0.3rem" }}>Awaiting scan</div>
          <div style={{ fontSize: "0.76rem", color: T.textMuted, lineHeight: 1.5 }}>
            Upload an animal photo and run the scan.<br />Results will appear here.
          </div>
        </div>
      </div>
    );
  }

  const sev = getSeverityStyle(result.severity, T);
  const sevLabel = result.severity ? result.severity.charAt(0).toUpperCase() + result.severity.slice(1) : "Unknown";
  const detectedIssues = Array.isArray(result.detectedIssues) ? result.detectedIssues
    : result.issues ? [result.issues]
    : result.condition ? [result.condition]
    : [];

  const isHighPriority = ["critical", "high"].includes(result.severity?.toLowerCase());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Animal Identity */}
      <Section title="Animal Identification" T={T}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: T.text, letterSpacing: "-0.015em" }}>
              {result.animal || result.species || "Unknown Animal"}
            </div>
            {result.breed && (
              <div style={{ fontSize: "0.76rem", color: T.textMuted, marginTop: "0.2rem" }}>{result.breed}</div>
            )}
          </div>
          {result.confidence != null && (
            <div
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: 9999,
                background: T.accentPale,
                border: `1px solid ${T.accent}33`,
                fontSize: "0.72rem",
                fontWeight: 700,
                color: T.accent,
              }}
            >
              {result.confidence}% confidence
            </div>
          )}
        </div>
        <div style={{ marginTop: "0.65rem", paddingTop: "0.65rem", borderTop: `1px solid ${T.borderLight}` }}>
          <InfoRow label="Scanned" value={formatTime(result.timestamp)} T={T} />
          {result.priority && <InfoRow label="Priority" value={result.priority} T={T} />}
        </div>
      </Section>

      {/* Severity Assessment */}
      <Section title="Severity Assessment" T={T}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              padding: "0.6rem 1.1rem",
              borderRadius: 8,
              background: sev.bg,
              border: `1.5px solid ${sev.border}`,
              color: sev.color,
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "-0.01em",
              flexShrink: 0,
            }}
          >
            {sevLabel}
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: T.textSub, lineHeight: 1.5 }}>
              {isHighPriority
                ? "Immediate veterinary attention required. Contact the nearest NGO."
                : "Monitor the animal and seek assistance if condition worsens."}
            </div>
          </div>
        </div>
      </Section>

      {/* Detected Issues */}
      {detectedIssues.length > 0 && (
        <Section title="Detected Issues" T={T}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {detectedIssues.map((issue, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: sev.color,
                    flexShrink: 0,
                    marginTop: "0.35rem",
                  }}
                />
                <span style={{ fontSize: "0.8rem", color: T.text, lineHeight: 1.5 }}>{issue}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* NGO CTA for high/critical */}
      {isHighPriority && (
        <Link
          to="/ngos"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
            borderRadius: 10,
            border: `1px solid ${T.danger}33`,
            background: T.dangerPale,
            textDecoration: "none",
            color: T.danger,
          }}
        >
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>Find a rescue NGO</div>
            <div style={{ fontSize: "0.72rem", opacity: 0.8, marginTop: "0.15rem" }}>This case requires immediate attention</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
