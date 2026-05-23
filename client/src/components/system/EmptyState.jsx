import { useT } from "../../context/ThemeContext";

export default function EmptyState({ icon = "📭", title = "No Data Found", message = "There is nothing to display here yet.", actionLabel, onAction, minHeight = "200px" }) {
  const { T } = useT();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight,
        padding: "2rem",
        textAlign: "center",
        background: T.bgCard,
        borderRadius: "12px",
        border: `1px dashed ${T.border}`,
      }}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.8 }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: T.text, margin: "0 0 0.5rem 0" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.85rem", color: T.textMuted, maxWidth: "300px", margin: "0 0 1.5rem 0", lineHeight: 1.5 }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rq-btn rq-btn-primary"
          style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
