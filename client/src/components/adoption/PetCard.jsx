import { useT } from "../../context/ThemeContext";

export default function PetCard({ pet }) {
  const { T } = useT();
  if (!pet) return null;
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{pet.name}</div>
      <div style={{ fontSize: 12, color: T.textSub }}>{pet.breed}</div>
      <div style={{ marginTop: 8, fontSize: 13, color: T.text }}>{pet.summary || pet.age}</div>
    </div>
  );
}
