/**
 * ResQNet Dashboard Ecosystem — Shared Components
 * DashboardHeader, DashboardStats, DashboardCards, DashboardActivityFeed,
 * DashboardNotifications, DashboardTimeline, DashboardCharts,
 * DashboardQuickActions, DashboardModal, DashboardSidebar
 *
 * All components use ThemeContext tokens. No standalone wrappers.
 */

import { Component, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { SEVERITY_COLOR, STATUS_LABEL } from "../../constants/ui";
import { getRescueImageUrl } from "../../utils/imageUrl";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard render error:", error, errorInfo);
  }

  render() {
    const { T } = this.props;
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, borderRadius: 14, border: `1px solid ${T?.border || "#e5e7eb"}`, background: T?.bgCard || "#fff", color: T?.text || "#111" }}>
          <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 8 }}>Dashboard temporarily unavailable</div>
          <div style={{ fontSize: "0.9rem", color: T?.textMuted || "#6b7280" }}>
            An unexpected rendering error occurred. Please refresh the page or try again later.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function SeverityBadge({ level, size = "sm" }) {
  const { T } = useT();
  const color = SEVERITY_COLOR[level] || T.accent;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: size === "sm" ? "2px 8px" : "4px 12px",
      borderRadius: 20,
      background: `${color}18`,
      border: `1px solid ${color}40`,
      color,
      fontSize: size === "sm" ? "0.67rem" : "0.75rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {level}
    </span>
  );
}

export function StatusBadge({ status }) {
  const { T } = useT();
  const colorMap = {
    pending: "#9333EA",
    accepted: "#2563EB",
    in_progress: "#0EA5E9",
    rescued: "#16A34A",
    completed: "#10B981",
    cancelled: "#EF4444",
    dispatched: "#D97706",
    on_site: T.accent,
    resolved: "#16A34A",
    active: "#16A34A",
    available: "#16A34A",
    busy: "#EA580C",
    offline: "#6B7280",
  };
  const color = colorMap[status] || T.textMuted;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 9px", borderRadius: 20,
      background: `${color}15`, border: `1px solid ${color}35`,
      color, fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.03em",
      textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {STATUS_LABEL[status] || status}
    </span>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
export function SectionLabel({ children, action, onAction }) {
  const { T } = useT();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ fontSize: "0.68rem", fontWeight: 750, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {children}
      </div>
      {action && (
        <button onClick={onAction} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "0.72rem", color: T.accent, fontWeight: 600,
          fontFamily: "inherit", letterSpacing: "-0.01em",
          padding: "2px 0",
        }}>{action} →</button>
      )}
    </div>
  );
}

// ─── CARD SHELL ───────────────────────────────────────────────────────────────
export function Card({ children, style: s = {}, hover = true, onClick }) {
  const { T } = useT();
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: `0 8px 28px ${T.shadowHov}` } : {}}
      onClick={onClick}
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: 18,
        boxShadow: `0 2px 12px ${T.shadow}`,
        cursor: onClick ? "pointer" : "default",
        ...s,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── DASHBOARD HEADER ─────────────────────────────────────────────────────────
export function DashboardHeader({ role, userName, onNotifClick, notifCount = 0 }) {
  const { T } = useT();
  const navigate = useNavigate();
  const roles = { user: "My Dashboard", ngo: "NGO Command Center", volunteer: "Field Operations", admin: "Platform Control" };
  const subtitles = {
    user: "Track rescues, scans, and adoptions",
    ngo: "Manage rescues, volunteers, and operations",
    volunteer: "Your active missions and field tasks",
    admin: "Platform health, NGO verification, and analytics",
  };

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      flexWrap: "wrap", gap: 12, marginBottom: 28,
    }}>
      <div>
        <div style={{ fontSize: "0.66rem", fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
          ResQNet · {roles[role] || "Dashboard"}
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: T.text, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
          Welcome back, {userName}
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: "0.84rem", color: T.textSub, letterSpacing: "-0.01em" }}>
          {subtitles[role]}
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
          onClick={onNotifClick}
          style={{
            position: "relative", width: 40, height: 40, borderRadius: 10,
            border: `1px solid ${T.border}`, background: T.bgCard,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {notifCount > 0 && (
            <span style={{
              position: "absolute", top: 6, right: 6,
              width: 8, height: 8, borderRadius: "50%",
              background: "#DC2626", border: `2px solid ${T.bgCard}`,
            }} />
          )}
        </motion.button>

        {/* Quick navigate */}
        {role !== "admin" && (
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/rescue")}
            style={{
              padding: "8px 16px", borderRadius: 10,
              background: T.accent, border: "none", color: "#fff",
              fontSize: "0.8rem", fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              letterSpacing: "-0.02em",
            }}
          >
            + New Rescue
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ─── STATS ROW ────────────────────────────────────────────────────────────────
export function DashboardStats({ stats = [] }) {
  const { T } = useT();
  const safeStats = Array.isArray(stats) ? stats : [];
  if (safeStats.length === 0) {
    return (
      <div style={{ padding: 18, borderRadius: 14, border: `1px solid ${T.border}`, background: T.bgCard, color: T.textMuted, marginBottom: 28 }}>
        No statistics are available yet.
      </div>
    );
  }
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: 12, marginBottom: 28,
    }}>
      {safeStats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: T.bgCard,
            border: `1px solid ${stat.highlight ? `${T.accent}40` : T.border}`,
            borderRadius: 12,
            padding: "16px 18px",
            boxShadow: stat.highlight ? `0 0 0 1px ${T.accent}20, 0 4px 16px ${T.shadow}` : `0 2px 8px ${T.shadow}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ fontSize: "0.67rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {stat.label}
            </div>
            {stat.icon && (
              <span style={{ fontSize: "1rem", opacity: 0.7 }}>{stat.icon}</span>
            )}
          </div>
          <div style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: stat.highlight ? T.accent : T.text, letterSpacing: "-0.05em", lineHeight: 1 }}>
            {stat.value}
          </div>
          {stat.sub && (
            <div style={{ fontSize: "0.68rem", color: stat.trend === "up" ? "#16A34A" : stat.trend === "down" ? "#DC2626" : T.textMuted, marginTop: 5, fontWeight: 600 }}>
              {stat.trend === "up" ? "↑" : stat.trend === "down" ? "↓" : ""} {stat.sub}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
const FEED_ICONS = {
  rescue: "🚑", scan: "📸", ngo: "🏢", adoption: "🏠",
  volunteer: "👤", system: "⚙️", default: "●",
};

export function DashboardActivityFeed({ items = [], limit = 6 }) {
  const { T } = useT();
  const [expanded, setExpanded] = useState(false);
  const safeItems = Array.isArray(items) ? items : [];
  const shown = expanded ? safeItems : safeItems.slice(0, limit);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {shown.map((item, i) => {
          const color = SEVERITY_COLOR[item.severity] || T.accent;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                padding: "9px 12px", borderRadius: 9,
                background: "transparent",
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: `${color}12`, border: `1px solid ${color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem",
              }}>
                {FEED_ICONS[item.type] || FEED_ICONS.default}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.79rem", color: T.text, fontWeight: 500, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                  {item.text}
                </div>
                <div style={{ fontSize: "0.66rem", color: T.textMuted, marginTop: 2 }}>{item.time}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
      {safeItems.length > limit && (
        <button
          onClick={() => setExpanded((p) => !p)}
          style={{
            marginTop: 8, background: "none", border: "none",
            cursor: "pointer", color: T.accent, fontSize: "0.74rem",
            fontWeight: 600, fontFamily: "inherit", letterSpacing: "-0.01em",
            padding: "4px 0",
          }}
        >
          {expanded ? "Show less ↑" : `Show ${safeItems.length - limit} more ↓`}
        </button>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS PANEL ──────────────────────────────────────────────────────
export function DashboardNotifications({ items = [], onClose, onMarkAll }) {
  const { T } = useT();
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      style={{
        position: "absolute", top: "calc(100% + 8px)", right: 0,
        width: "min(340px, calc(100vw - 24px))",
        background: T.bgCard, border: `1px solid ${T.border}`,
        borderRadius: 14, boxShadow: `0 16px 48px ${T.shadowDeep}`,
        zIndex: 200, overflow: "hidden",
      }}
    >
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 14px 10px", borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>Notifications</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onMarkAll} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.7rem", color: T.accent, fontFamily: "inherit", fontWeight: 600 }}>
            Mark all read
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: "1rem", lineHeight: 1 }}>✕</button>
        </div>
      </div>
      <div style={{ maxHeight: 360, overflowY: "auto", scrollbarWidth: "thin" }}>
        {safeItems.map((n) => (
          <div key={n.id} style={{
            display: "flex", gap: 10, padding: "11px 14px",
            borderBottom: `1px solid ${T.border}`,
            background: n.read ? "transparent" : T.accentPale,
            alignItems: "flex-start",
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", marginTop: 5,
              background: n.read ? T.border : T.accent, flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: T.text, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: "0.72rem", color: T.textSub, marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>
              <div style={{ fontSize: "0.65rem", color: T.textMuted, marginTop: 3 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
export function DashboardTimeline({ events = [] }) {
  const { T } = useT();
  const safeEvents = Array.isArray(events) ? events : [];
  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute", left: 14, top: 16, bottom: 8,
        width: 2, background: T.accentPale, borderRadius: 2,
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {safeEvents.map((ev, i) => {
          const color = SEVERITY_COLOR[ev.type] || T.accent;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.28 }}
              style={{ display: "flex", gap: 14, alignItems: "flex-start", position: "relative" }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: ev.done ? color : T.bgAlt,
                border: `2px solid ${ev.done ? color : T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, zIndex: 1,
              }}>
                {ev.done ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.border }} />
                )}
              </div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontSize: "0.81rem", fontWeight: 600, color: T.text, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                  {ev.label}
                </div>
                {ev.time && <div style={{ fontSize: "0.67rem", color: T.textMuted, marginTop: 2 }}>{ev.time}</div>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BAR CHART (CSS-only, no library) ────────────────────────────────────────
export function DashboardBarChart({ data = [], label, color }) {
  const { T } = useT();
  const safeData = Array.isArray(data) ? data : [];
  const max = safeData.length > 0 ? Math.max(...safeData) : 0;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div>
      {label && <div style={{ fontSize: "0.67rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12 }}>{label}</div>}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
        {safeData.map((v, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${max === 0 ? 0 : (v / max) * 100}%` }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              flex: 1, borderRadius: "4px 4px 0 0",
              background: i === safeData.length - 1 ? color || T.accent : `${color || T.accent}55`,
              minHeight: 6, cursor: "default",
              position: "relative",
            }}
            title={`${days[i]}: ${v}`}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "0.6rem", color: T.textMuted }}>{d}</div>
        ))}
      </div>
    </div>
  );
}

// ─── DONUT CHART (SVG) ────────────────────────────────────────────────────────
export function DashboardDonutChart({ segments = [], size = 90 }) {
  const { T } = useT();
  const safeSegments = Array.isArray(segments) ? segments : [];
  const total = safeSegments.reduce((s, seg) => s + (seg?.value || 0), 0);
  const r = 36;
  const cx = 45;
  const cy = 45;

  const paths = safeSegments.reduce((acc, seg) => {
    const pct = total === 0 ? 0 : (seg?.value || 0) / total;
    const start = acc.angle;
    const end = acc.angle + pct * 360;
    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = pct > 0.5 ? 1 : 0;
    acc.items.push({
      d: `M${cx},${cy} L${x1},${y1} A${r},${r},0,${largeArc},1,${x2},${y2}Z`,
      color: seg?.color || T.accent,
      label: seg?.label || "Unknown",
      value: seg?.value || 0,
    });
    acc.angle = end;
    return acc;
  }, { angle: -90, items: [] }).items;

  if (safeSegments.length === 0 || total === 0) {
    return (
      <div style={{ padding: 18, borderRadius: 12, border: `1px solid ${T.border}`, background: T.bgCard, color: T.textMuted }}>
        No chart data available.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <svg width={size} height={size} viewBox="0 0 90 90">
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.color} opacity={0.85} />
        ))}
        <circle cx={cx} cy={cy} r={22} fill={T.bgCard} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {safeSegments.map((seg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color || T.accent, flexShrink: 0 }} />
            <span style={{ color: T.textSub, letterSpacing: "-0.01em" }}>{seg.label || "Unknown"}</span>
            <span style={{ color: T.text, fontWeight: 700, marginLeft: "auto" }}>{seg.value || 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── QUICK ACTIONS ────────────────────────────────────────────────────────────
export function DashboardQuickActions({ actions = [] }) {
  const { T } = useT();
  const safeActions = Array.isArray(actions) ? actions : [];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
      {safeActions.map((action, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={action.onClick}
          style={{
            padding: "12px 12px",
            borderRadius: 10,
            border: action.primary ? "none" : `1px solid ${T.border}`,
            background: action.primary ? T.accent : action.danger ? "rgba(220,38,38,0.08)" : T.bgAlt,
            borderColor: action.danger ? "rgba(220,38,38,0.3)" : undefined,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6,
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>{action.icon}</span>
          <span style={{
            fontSize: "0.77rem", fontWeight: 650,
            color: action.primary ? "#fff" : action.danger ? "#DC2626" : T.text,
            letterSpacing: "-0.02em", lineHeight: 1.2,
          }}>
            {action.label}
          </span>
          {action.sub && (
            <span style={{ fontSize: "0.63rem", color: action.primary ? "rgba(255,255,255,0.7)" : T.textMuted, lineHeight: 1.1 }}>
              {action.sub}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function DashboardModal({ isOpen, title, onClose, children, width = 480 }) {
  const { T } = useT();

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", zIndex: 1000,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: `min(${width}px, calc(100vw - 32px))`,
              maxHeight: "85vh", overflowY: "auto",
              background: T.bgCard, border: `1px solid ${T.border}`,
              borderRadius: 16, boxShadow: `0 24px 60px ${T.shadowDeep}`,
              zIndex: 1001, scrollbarWidth: "none",
            }}
          >
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 20px 14px", borderBottom: `1px solid ${T.border}`,
            }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.text, letterSpacing: "-0.03em" }}>{title}</div>
              <button onClick={onClose} style={{
                width: 28, height: 28, borderRadius: 8,
                border: `1px solid ${T.border}`, background: T.bgAlt,
                cursor: "pointer", color: T.textMuted, fontSize: "0.85rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>
            <div style={{ padding: "18px 20px 20px" }}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── RESCUE CASE ROW ──────────────────────────────────────────────────────────
export function RescueCaseRow({ rescue, onView, onAssign, showAssign = false }) {
  const { T } = useT();
  const thumb = getRescueImageUrl(rescue);
  return (
    <motion.div
      whileHover={{ background: T.bgCardHov }}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "11px 14px", borderBottom: `1px solid ${T.border}`,
        cursor: "pointer", borderRadius: 8, transition: "background 0.15s",
        flexWrap: "wrap",
      }}
      onClick={onView}
    >
      {/* Thumbnail */}
      <div style={{ width: 64, height: 64, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, overflow: "hidden", background: T.bgAlt }}>
        {thumb ? (
          <img src={thumb} alt="rescue" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ fontSize: "1.25rem" }}>📷</div>
        )}
      </div>

      {/* ID + animal */}
      <div style={{ flex: "1 1 160px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
          <span style={{ fontSize: "0.67rem", fontWeight: 700, color: T.textMuted, fontFamily: "monospace" }}>{rescue.id || rescue._id?.slice(-6)}</span>
          <SeverityBadge level={rescue.severity} />
        </div>
        <div style={{ fontSize: "0.82rem", fontWeight: 650, color: T.text, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          {rescue.animal}
        </div>
        <div style={{ fontSize: "0.69rem", color: T.textMuted, marginTop: 1 }}>{rescue.location}</div>
      </div>

      {/* Status */}
      <div style={{ flexShrink: 0 }}>
        <StatusBadge status={rescue.status} />
      </div>

      {/* AI score */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: "0.67rem", color: T.textMuted, marginBottom: 1 }}>AI Score</div>
        <div style={{
          fontSize: "0.86rem", fontWeight: 800,
          color: rescue.aiScore >= 70 ? "#DC2626" : rescue.aiScore >= 40 ? "#D97706" : "#16A34A",
          letterSpacing: "-0.03em",
        }}>
          {rescue.aiScore}
        </div>
      </div>

      {/* Actions */}
      {showAssign && (
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onAssign?.(rescue); }}
          style={{
            padding: "5px 12px", borderRadius: 7,
            background: T.accent, border: "none", color: "#fff",
            fontSize: "0.73rem", fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", letterSpacing: "-0.01em",
          }}
        >
          Assign
        </motion.button>
      )}
    </motion.div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
export function DashboardSidebar({ role, activeSection, onSection }) {
  const { T } = useT();
  const navigate = useNavigate();

  const SECTIONS = {
    user: [
      { id: "overview", label: "Overview", icon: "◈" },
      { id: "rescues", label: "My Rescues", icon: "🚑" },
      { id: "scans", label: "AI Scans", icon: "📸" },
      { id: "adoptions", label: "Adoptions", icon: "🏠" },
      { id: "activity", label: "Activity", icon: "◎" },
    ],
    ngo: [
      { id: "overview", label: "Overview", icon: "◈" },
      { id: "rescues", label: "Active Rescues", icon: "🚑" },
      { id: "volunteers", label: "Volunteers", icon: "👤" },
      { id: "adoptions", label: "Adoption Queue", icon: "🏠" },
      { id: "analytics", label: "Analytics", icon: "◉" },
    ],
    volunteer: [
      { id: "overview", label: "Overview", icon: "◈" },
      { id: "missions", label: "My Missions", icon: "🗺" },
      { id: "tasks", label: "Tasks", icon: "✓" },
      { id: "history", label: "History", icon: "◎" },
    ],
    admin: [
      { id: "overview", label: "Overview", icon: "◈" },
      { id: "ngos", label: "NGO Management", icon: "⬡" },
      { id: "rescues", label: "Rescue Operations", icon: "◉" },
      { id: "users", label: "User Management", icon: "△" },
      { id: "ai", label: "AI Monitoring", icon: "◎" },
      { id: "analytics", label: "Analytics", icon: "⊞" },
      { id: "alerts", label: "System Alerts", icon: "⚡" },
      { id: "settings", label: "Settings", icon: "□" },
    ],
  };

  const sections = SECTIONS[role] || SECTIONS.user;

  return (
    <div style={{
      width: "min(200px, 100%)", flexShrink: 0,
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: 14, padding: "12px 8px",
      boxShadow: `0 2px 12px ${T.shadow}`,
      height: "fit-content",
      position: "sticky", top: "clamp(4.5rem, 12vw, 5.75rem)",
    }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 750, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 8px 8px" }}>
        Navigation
      </div>
      {sections.map((s) => {
        const active = activeSection === s.id;
        return (
          <motion.button
            key={s.id}
            whileHover={{ background: active ? T.accentPale : T.bgAlt }}
            onClick={() => onSection(s.id)}
            style={{
              width: "100%", padding: "9px 10px",
              borderRadius: 8, border: "none",
              background: active ? T.accentPale : "transparent",
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 8,
              textAlign: "left", transition: "background 0.14s",
            }}
          >
            <span style={{ fontSize: "0.85rem", width: 18, textAlign: "center", flexShrink: 0 }}>{s.icon}</span>
            <span style={{
              fontSize: "0.79rem", fontWeight: active ? 700 : 500,
              color: active ? T.accent : T.textSub,
              letterSpacing: "-0.01em",
            }}>
              {s.label}
            </span>
            {active && <span style={{ marginLeft: "auto", width: 3, height: 3, borderRadius: "50%", background: T.accent }} />}
          </motion.button>
        );
      })}

      <div style={{ height: 1, background: T.border, margin: "10px 6px" }} />

      <motion.button
        whileHover={{ background: T.bgAlt }}
        onClick={() => navigate("/")}
        style={{
          width: "100%", padding: "9px 10px", borderRadius: 8, border: "none",
          background: "transparent", cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 8, textAlign: "left",
          transition: "background 0.14s",
        }}
      >
        <span style={{ fontSize: "0.85rem", width: 18, textAlign: "center" }}>←</span>
        <span style={{ fontSize: "0.79rem", fontWeight: 500, color: T.textMuted, letterSpacing: "-0.01em" }}>Back to Platform</span>
      </motion.button>
    </div>
  );
}
