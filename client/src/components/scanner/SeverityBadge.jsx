import { useT } from "../../context/ThemeContext";
import { getSeverityMeta } from "./scannerUtils";

export default function SeverityBadge({ severity }) {
  const { T } = useT();
  const meta = getSeverityMeta(severity);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        padding: "0.35rem 0.85rem",
        background: `${meta.color}22`,
        color: meta.color,
        fontWeight: 700,
        fontSize: "0.78rem",
      }}
    >
      {meta.label}
    </span>
  );
}
