import { useT } from "../../context/ThemeContext";

export default function Label({ children, color }) {
  const { T } = useT();
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: color || T.accent,
        marginBottom: "0.85rem",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: color || T.accent,
          flexShrink: 0,
        }}
      />
      {children}
    </div>
  );
}
