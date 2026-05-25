import { useNavigate } from "react-router-dom";
import { useT } from "../../../context/ThemeContext";

// ─── DASHBOARD HEADER ─────────────────────────────────────────────────────────
export function DashboardHeader({ role, userName }) {
  const { T } = useT();
  const navigate = useNavigate();

  const roleLabels = { user: "My Dashboard", ngo: "NGO Command Center", volunteer: "Field Operations", admin: "Platform Control" };
  const roleDescriptions = {
    user: "Track your rescues, AI scans, and adoption applications",
    ngo: "Manage rescue operations, volunteer coordination, and analytics",
    volunteer: "View your active missions and field assignments",
    admin: "Platform health, NGO verification, and system analytics",
  };
  const roleColors = { user: T.accent, ngo: T.success || "#059669", volunteer: T.warning || "#D97706", admin: T.danger || "#DC2626" };
  const rColor = roleColors[role] || T.accent;

  return (
    <div className="rq-dashboard-header">
      <div className="rq-dashboard-header-content">
        <div className="rq-dashboard-role-pill" style={{ color: rColor, background: `${rColor}15` }}>
          {roleLabels[role] || "Dashboard"}
        </div>
        <h1 className="rq-section-title" style={{ margin: 0, marginBottom: "var(--space-1)" }}>
          Welcome back, {userName} 👋
        </h1>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: T.textSub }}>
          {roleDescriptions[role]}
        </p>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {role !== "admin" && (
          <button
            onClick={() => navigate("/rescue")}
            style={{
              padding: "0.6rem 1.2rem", borderRadius: "var(--radius-md)",
              background: T.accent, border: "none", color: T.textOnAccent,
              fontSize: "var(--text-sm)", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.4rem",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Rescue
          </button>
        )}
      </div>
    </div>
  );
}

