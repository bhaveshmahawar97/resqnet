import { useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../../../context/ThemeContext";
import { SEVERITY_COLOR } from "../../../constants/ui";
import { SYSTEM_HEALTH } from "../../../data/dashboardData";
import { SectionLabel, Card } from "../DashboardShared";
import Button from "../../ui/Button";

export function ActionBtn({ label, color, onClick, outline = false }) {
  return (
    <Button
      variant={outline ? "outline" : "primary"}
      size="sm"
      onClick={onClick}
      style={!outline ? { background: color } : { color, borderColor: color }}
    >
      {label}
    </Button>
  );
}

export function EmergencyAlertCard({ alert, onAck }) {
  const { T } = useT();
  const color = SEVERITY_COLOR[alert.type] || T.accent;
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        padding: "12px 14px",
        borderRadius: 10,
        background: `${color}0D`,
        border: `1px solid ${color}35`,
        borderLeft: `3px solid ${color}`,
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 8,
      }}
    >
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, marginTop: 5, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.79rem", fontWeight: 700, color: T.text, letterSpacing: "-0.02em", marginBottom: 2 }}>{alert.title}</div>
        <div style={{ fontSize: "0.71rem", color: T.textSub, lineHeight: 1.45 }}>{alert.body}</div>
        <div style={{ fontSize: "0.62rem", color: T.textMuted, marginTop: 4 }}>{alert.time}</div>
      </div>
      {!alert.acknowledged && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onAck(alert.id)}
          type="button"
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            border: `1px solid ${color}50`,
            background: "transparent",
            color,
            fontSize: "0.68rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            flexShrink: 0,
          }}
        >
          Ack
        </motion.button>
      )}
    </motion.div>
  );
}

export function SystemHealthPanel() {
  const { T } = useT();
  const statusColor = { operational: "#16A34A", degraded: "#D97706", down: "#DC2626" };

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${T.border}` }}>
        <SectionLabel>System Health</SectionLabel>
      </div>
      {SYSTEM_HEALTH.map((sys, i) => {
        const color = statusColor[sys.status] || T.textMuted;
        return (
          <div
            key={sys.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderBottom: i < SYSTEM_HEALTH.length - 1 ? `1px solid ${T.border}` : "none",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 600, color: T.text }}>{sys.label}</div>
            </div>
            <div style={{ fontSize: "0.62rem", color: T.textMuted }}>{sys.latency}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color, textTransform: "uppercase" }}>{sys.status}</span>
            </div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: T.textMuted, background: T.bgAlt, border: `1px solid ${T.border}`, padding: "2px 6px", borderRadius: 6 }}>
              {sys.uptime}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

export function AdminInsights({ tips }) {
  const { T } = useT();
  if (!tips.length) return null;
  return (
    <div
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 20,
        borderLeft: `3px solid ${T.accent}`,
      }}
    >
      <div style={{ fontSize: "0.62rem", fontWeight: 800, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
        Operations Intelligence
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {tips.map((tip) => (
          <div key={tip} style={{ fontSize: "0.76rem", color: T.textSub, lineHeight: 1.5 }}>
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingToggle({ label, defaultOn = false }) {
  const { T } = useT();
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 12px",
        background: T.bgAlt,
        borderRadius: 9,
        border: `1px solid ${T.border}`,
      }}
    >
      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: T.text }}>{label}</span>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          cursor: "pointer",
          background: on ? T.accent : T.border,
          border: "none",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: on ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}
