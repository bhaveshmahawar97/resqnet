import { motion } from "framer-motion";
import { useT } from "../../../context/ThemeContext";
import EmptyState from "../../system/EmptyState";

// ─── BAR CHART ────────────────────────────────────────────────────────────────
export function DashboardBarChart({ data = [], label, color }) {
  const { T } = useT();
  const safeData = Array.isArray(data) ? data : [];
  const max = safeData.length > 0 ? Math.max(...safeData) : 0;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (max === 0 || safeData.length === 0) {
    return <EmptyState icon="📊" title="No Analytics Available" message="There is no data to visualize yet." minHeight="150px" />;
  }

  return (
    <div>
      {label && <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12 }}>{label}</div>}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 72 }}>
        {safeData.map((v, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${max === 0 ? 0 : (v / max) * 100}%` }}
            transition={{ delay: i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              flex: 1, borderRadius: "4px 4px 0 0",
              background: i === safeData.length - 1 ? color || T.accent : `${color || T.accent}40`,
              minHeight: 4, cursor: "default",
              transition: "opacity 0.18s",
            }}
            title={`${days[i]}: ${v}`}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "0.6rem", color: T.textMuted }}>{d}</div>
        ))}
      </div>
    </div>
  );
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
export function DashboardDonutChart({ segments = [], size = 90 }) {
  const { T } = useT();
  const safeSegments = Array.isArray(segments) ? segments : [];
  const total = safeSegments.reduce((s, seg) => s + (seg?.value || 0), 0);
  const r = 36; const cx = 45; const cy = 45;

  const paths = safeSegments.reduce((acc, seg) => {
    const pct = total === 0 ? 0 : (seg?.value || 0) / total;
    const start = acc.angle;
    const end = acc.angle + pct * 360;
    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad), y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad),   y2 = cy + r * Math.sin(endRad);
    const largeArc = pct > 0.5 ? 1 : 0;
    acc.items.push({ d: `M${cx},${cy} L${x1},${y1} A${r},${r},0,${largeArc},1,${x2},${y2}Z`, color: seg?.color || T.accent, label: seg?.label || "", value: seg?.value || 0 });
    acc.angle = end;
    return acc;
  }, { angle: -90, items: [] }).items;

  if (total === 0) {
    return <EmptyState icon="🍩" title="No Data Available" message="There is not enough data for this chart." minHeight="150px" />;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <svg width={size} height={size} viewBox="0 0 90 90">
        {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} opacity={0.88} />)}
        <circle cx={cx} cy={cy} r={22} fill={T.bgCard} />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 9, fontWeight: 700, fill: T.textMuted }}>
          {total}
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
        {safeSegments.map((seg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.72rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color || T.accent, flexShrink: 0 }} />
            <span style={{ color: T.textSub, flex: 1 }}>{seg.label}</span>
            <span style={{ color: T.text, fontWeight: 700 }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
