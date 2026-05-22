import { useT } from "../../context/ThemeContext";

export default function DashboardSectionTabs({ sections, activeSection, onSection }) {
  const { T } = useT();

  return (
    <div className="dashboard-section-tabs">
      {sections.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSection(id)}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: activeSection === id ? `1px solid ${T.accent}` : `1px solid ${T.border}`,
            background: activeSection === id ? T.accentPale : T.bgCard,
            color: activeSection === id ? T.accent : T.textSub,
            fontSize: "0.76rem",
            fontWeight: activeSection === id ? 700 : 500,
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "-0.01em",
            transition: "all 0.15s",
            textTransform: "capitalize",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
