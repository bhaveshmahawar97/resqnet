import { useT } from "../../../context/ThemeContext";

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
export function DashboardTimeline({ events = [] }) {
  const { T } = useT();
  const safeEvents = Array.isArray(events) ? events : [];
  
  if (safeEvents.length === 0) {
    return <div style={{ color: T.textMuted, fontSize: "0.85rem", padding: "10px 0" }}>No timeline events available.</div>;
  }

  return (
    <div style={{ position: "relative", paddingLeft: 24 }}>
      <div style={{
        position: "absolute", left: 10, top: 8, bottom: 8,
        width: 2, background: T.border, borderRadius: 2,
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {safeEvents.map((ev, i) => {
          const isLatest = i === safeEvents.length - 1;
          const statusColors = { pending: "#D97706", accepted: "#2563EB", in_progress: "#0EA5E9", rescued: "#16A34A", completed: "#10B981", cancelled: "#DC2626" };
          const color = statusColors[ev.status] || T.accent;
          const label = ev.label || ev.note || `Status updated to ${ev.status}`;
          const time = ev.time || (ev.createdAt ? new Date(ev.createdAt).toLocaleString() : "");

          return (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: color,
                border: `2px solid ${T.bgCard}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, position: "absolute", left: 1, marginTop: 2,
                zIndex: 1,
                boxShadow: `0 0 0 1px ${T.border}`
              }}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5L3.5 6.5 7.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ marginLeft: 12 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: T.text, letterSpacing: "-0.01em", lineHeight: 1.25 }}>
                  {label}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: 4 }}>
                  <span style={{ fontSize: "0.68rem", color: T.textMuted }}>{time}</span>
                  {ev.role && (
                    <span style={{ fontSize: "0.6rem", color: T.textOnAccent, background: T.accent, padding: "0.1rem 0.4rem", borderRadius: 4, textTransform: "capitalize" }}>
                      {ev.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

