import { useT } from "../../context/ThemeContext";

export default function NgoCard({ ngo }) {
  const { T } = useT();
  if (!ngo) return null;

  const createdAt = ngo.createdAt ? new Date(ngo.createdAt) : null;
  const isNew = createdAt
    ? Date.now() - createdAt.getTime() <= 30 * 24 * 60 * 60 * 1000
    : false;
  const badgeText = isNew ? "New" : ngo.verified ? "Verified" : "Unverified";
  const badgeBg = isNew ? "rgba(16,185,129,0.12)" : ngo.verified ? "rgba(59,130,246,0.12)" : "rgba(245,158,11,0.12)";
  const badgeColor = isNew ? "#10B981" : ngo.verified ? "#3B82F6" : "#D97706";

  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{ngo.name}</div>
          <div style={{ fontSize: 12, color: T.textSub }}>{ngo.city}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <div style={{ fontSize: 12, color: T.textMuted }}>{ngo.type}</div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: badgeColor,
              background: badgeBg,
              borderRadius: 999,
              padding: "0.18rem 0.55rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {badgeText}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: T.text }}>{ngo.focus}</div>
    </div>
  );
}
