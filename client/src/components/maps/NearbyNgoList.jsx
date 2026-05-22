import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { sortNgosByDistance } from "../../utils/calculateDistance";

export default function NearbyNgoList({ ngos = [], currentLocation, onSelectNgo, selectedNgo }) {
  const { T } = useT();
  const sorted = sortNgosByDistance(currentLocation, ngos);

  if (!sorted.length) {
    return (
      <div style={{ padding: 16, borderRadius: 18, border: `1px solid ${T.border}`, background: T.bgCard, color: T.textMuted }}>
        No nearby NGOs found for this location.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {sorted.map((ngo) => (
        <motion.button
          key={ngo.id}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onSelectNgo?.(ngo)}
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: 18,
            border: `1px solid ${selectedNgo?.id === ngo.id ? T.accent : T.border}`,
            background: selectedNgo?.id === ngo.id ? T.accentPale : T.bgCard,
            color: T.text,
            textAlign: "left",
            cursor: "pointer",
            display: "grid",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div style={{ fontWeight: 700 }}>{ngo.name}</div>
            <div style={{ fontSize: "0.78rem", color: ngo.distance ? T.accent : T.textMuted }}>{ngo.distance || "Distance unknown"}</div>
          </div>
          <div style={{ color: T.textSub, fontSize: "0.82rem" }}>{ngo.city || "Unknown location"}</div>
          {ngo.specialties?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, color: T.textMuted, fontSize: "0.78rem" }}>
              {ngo.specialties.slice(0, 3).map((item) => (
                <span key={item} style={{ background: T.bgAlt, padding: "0.25rem 0.55rem", borderRadius: 999 }}>{item}</span>
              ))}
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
