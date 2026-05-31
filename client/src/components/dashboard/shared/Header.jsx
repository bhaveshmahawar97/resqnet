import { useNavigate } from "react-router-dom";
import { useT } from "../../../context/ThemeContext";

// ─── DASHBOARD HEADER ─────────────────────────────────────────────────────────
export function DashboardHeader({ role, userName }) {
  const { T } = useT();
  const navigate = useNavigate();

  const roleLabels = {
    user: "My Dashboard",
    ngo: "NGO Command Center",
    volunteer: "Field Operations",
    admin: "Platform Control",
  };

  const roleDescriptions = {
    user: "Track your rescues, AI scans, and adoption applications",
    ngo: "Manage rescue operations, volunteer coordination, and analytics",
    volunteer: "View your active missions and field assignments",
    admin: "Platform health, NGO verification, and system analytics",
  };

  const roleColors = {
    user: { color: T.accent, bg: T.accentPale, border: T.accentGlow },
    ngo: { color: T.success, bg: T.successPale, border: T.successBorder },
    volunteer: { color: T.warning, bg: T.warningPale, border: T.warningBorder },
    admin: { color: T.danger, bg: T.dangerPale, border: T.dangerBorder },
  };

  const rc = roleColors[role] || roleColors.user;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "1.5rem 1.75rem",
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        boxShadow: T.shadowCard,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle gradient accent stripe top */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${rc.color} 0%, transparent 60%)`,
          opacity: 0.7,
          borderRadius: "16px 16px 0 0",
          pointerEvents: "none",
        }}
      />

      {/* Left: text block */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", minWidth: 0 }}>
        {/* Role pill */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            alignSelf: "flex-start",
            padding: "0.22rem 0.7rem",
            borderRadius: 999,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: rc.color,
            background: rc.bg,
            border: `1px solid ${rc.border}`,
            userSelect: "none",
          }}
        >
          {/* Live dot */}
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: rc.color,
              flexShrink: 0,
              boxShadow: `0 0 0 2px ${rc.bg}`,
            }}
          />
          {roleLabels[role] || "Dashboard"}
        </span>

        {/* Greeting */}
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.25rem, 2.5vw, 1.6rem)",
            fontWeight: 800,
            color: T.textHeading,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          Welcome back,{" "}
          <span
            style={{
              background: T.gradAccent,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {userName}
          </span>
        </h1>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: "0.83rem",
            color: T.textMuted,
            lineHeight: 1.5,
            fontWeight: 450,
          }}
        >
          {roleDescriptions[role]}
        </p>
      </div>

      {/* Right: CTA */}
      {role !== "admin" && (
        <button
          onClick={() => navigate("/rescue")}
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.6rem 1.25rem",
            borderRadius: 10,
            border: "none",
            background: T.gradAccent,
            color: T.textOnAccent,
            fontSize: "0.82rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            boxShadow: `0 2px 8px ${T.accentGlow}`,
            transition: "opacity 0.15s, transform 0.15s, box-shadow 0.15s",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 4px 16px ${T.accentGlow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 2px 8px ${T.accentGlow}`;
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Rescue
        </button>
      )}
    </div>
  );
}
