import { useT } from "../../context/ThemeContext";

export default function ScannerEmpty() {
  const { T } = useT();
  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        borderRadius: 18,
        background: T.bgCard,
        border: `1px dashed ${T.border}`,
        color: T.textMuted,
      }}
    >
      <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", color: T.text }}>
        Start your AI scan
      </div>
      <div style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
        Drag & drop an animal photo or click to select a file. Once uploaded, ResQNet will analyze injury severity and recommend next steps.
      </div>
    </div>
  );
}
