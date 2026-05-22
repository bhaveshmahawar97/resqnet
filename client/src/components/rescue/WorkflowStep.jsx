import { useT } from "../../context/ThemeContext";

export default function WorkflowStep({ title, desc, i }) {
  const { T } = useT();
  return (
    <div style={{ background: T.bgAlt, borderRadius: 10, padding: 12, border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: T.text }}>{i}. {title}</div>
      <div style={{ fontSize: 13, color: T.textSub, marginTop: 6 }}>{desc}</div>
    </div>
  );
}
