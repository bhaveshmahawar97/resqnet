import { useNavigate } from "react-router-dom";
import { useT } from "../../../context/ThemeContext";

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const SIDEBAR_ICONS = {
  overview: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  rescues: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  scans: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  adoptions: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  activity: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  volunteers: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  analytics: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  missions: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg>,
  tasks: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  history: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ngos: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  users: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  ai: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
  alerts: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  settings: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
};

export function DashboardSidebar({ role, activeSection, onSection }) {
  const { T } = useT();
  const navigate = useNavigate();

  const SECTIONS = {
    user: [
      { id: "overview", label: "Overview" },
      { id: "rescues", label: "My Rescues" },
      { id: "scans", label: "AI Scans" },
      { id: "adoptions", label: "Adoptions" },
      { id: "activity", label: "Activity Log" },
    ],
    ngo: [
      { id: "overview", label: "Overview" },
      { id: "rescues", label: "Active Rescues" },
      { id: "volunteers", label: "Volunteers" },
      { id: "adoptions", label: "Adoption Queue" },
      { id: "analytics", label: "Analytics" },
    ],
    volunteer: [
      { id: "overview", label: "Overview" },
      { id: "missions", label: "My Missions" },
      { id: "tasks", label: "Tasks" },
      { id: "history", label: "History" },
    ],
    admin: [
      { id: "overview", label: "Overview" },
      { id: "ngos", label: "NGO Management" },
      { id: "rescues", label: "Rescue Operations" },
      { id: "users", label: "User Management" },
      { id: "ai", label: "AI Monitoring" },
      { id: "analytics", label: "Analytics" },
      { id: "alerts", label: "System Alerts" },
      { id: "settings", label: "Settings" },
    ],
  };

  const sections = SECTIONS[role] || SECTIONS.user;

  return (
    <div style={{
      width: 220, flexShrink: 0,
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: 14, padding: "12px 8px 16px",
      boxShadow: T.shadow,
      height: "fit-content",
      position: "sticky", top: "clamp(4.5rem, 10vw, 5.75rem)",
    }}>
      <div style={{
        fontSize: "0.62rem", fontWeight: 700, color: T.textMuted,
        letterSpacing: "0.1em", textTransform: "uppercase",
        padding: "4px 12px 10px",
      }}>
        Navigation
      </div>

      {sections.map((s) => {
        const active = activeSection === s.id;
        const icon = SIDEBAR_ICONS[s.id] || SIDEBAR_ICONS.overview;
        return (
          <button
            key={s.id}
            onClick={() => onSection(s.id)}
            style={{
              width: "100%", padding: "9px 12px",
              borderRadius: 8, border: "none",
              background: active ? T.accentSurface || T.accentPale : "transparent",
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 10,
              textAlign: "left",
              borderLeft: active ? `3px solid ${T.accent}` : "3px solid transparent",
              transition: "all 0.15s",
              marginBottom: 2,
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.bgAlt; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ color: active ? T.accent : T.textMuted, flexShrink: 0, display: "flex", alignItems: "center" }}>
              {icon}
            </span>
            <span style={{
              fontSize: "0.82rem", fontWeight: active ? 700 : 500,
              color: active ? T.accent : T.textSub,
              letterSpacing: "-0.01em",
            }}>
              {s.label}
            </span>
          </button>
        );
      })}

      {/* Divider */}
      <div style={{ height: 1, background: T.border, margin: "10px 12px" }} />

      {/* Home link */}
      <button
        onClick={() => navigate("/")}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 10, border: "none",
          background: "transparent", cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 10,
          textAlign: "left", borderLeft: "3px solid transparent",
          transition: "background 0.15s",
          color: T.textMuted,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = T.bgAlt}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span style={{ fontSize: "0.82rem", fontWeight: 500, color: T.textSub }}>Back to Home</span>
      </button>
    </div>
  );
}
