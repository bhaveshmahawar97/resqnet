import { useT } from "../../../context/ThemeContext";

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
export function DashboardTimeline({ events = [] }) {
  const { T } = useT();
  const safeEvents = Array.isArray(events) ? events : [];
  return (
    <div style={{ position: "relative", paddingLeft: 24 }}>
      <div style={{
        position: "absolute", left: 10, top: 8, bottom: 8,
        width: 2, background: T.border, borderRadius: 2,
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {safeEvents.map((ev, i) => {
          const severityColors = { critical: "#DC2626", high: "#EA580C", medium: "#D97706", low: "#059669" };
          const color = severityColors[ev.type] || T.accent;
          return (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: ev.done ? color : T.bgCard,
                border: `2px solid ${ev.done ? color : T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, position: "absolute", left: 1, marginTop: 2,
                zIndex: 1,
              }}>
                {ev.done && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5L3.5 6.5 7.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div style={{ marginLeft: 12 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: T.text, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{ev.label}</div>
                {ev.time && <div style={{ fontSize: "0.68rem", color: T.textMuted, marginTop: 2 }}>{ev.time}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

