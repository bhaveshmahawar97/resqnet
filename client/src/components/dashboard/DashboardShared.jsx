/**
 * ResQNet Dashboard Ecosystem — Shared Components (Redesigned)
 * Premium healthcare-grade operational dashboard system.
 * All logic preserved, visual system fully upgraded.
 */

import { Component, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { SEVERITY_COLOR, STATUS_LABEL } from "../../constants/ui";
import { getRescueImageUrl } from "../../utils/imageUrl";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

// ─── ERROR BOUNDARY ──────────────────────────────────────────────────────────
export class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("Dashboard error:", error, info); }
  render() {
    const { T } = this.props;
    if (this.state.hasError) {
      return (
        <div style={{ padding: 28, borderRadius: 16, border: `1px solid ${T?.border || "#E2E8F0"}`, background: T?.bgCard || "#fff" }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: T?.text || "#0F172A", marginBottom: 8 }}>
            Dashboard temporarily unavailable
          </div>
          <div style={{ fontSize: "0.85rem", color: T?.textSub || "#475569", lineHeight: 1.6 }}>
            An unexpected error occurred. Please refresh the page.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── SEVERITY BADGE ───────────────────────────────────────────────────────────
export function SeverityBadge({ level, size = "sm" }) {
  const { T } = useT();
  const colorMap = { critical: "#DC2626", high: "#EA580C", medium: "#D97706", low: "#059669" };
  const color = colorMap[level] || SEVERITY_COLOR[level] || T.accent;
  return (
    <span className={`rq-chip ${size === "sm" ? "rq-chip-sm" : ""}`} style={{
      background: `${color}15`, borderColor: `${color}30`, color
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {level}
    </span>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const { T } = useT();
  const colorMap = {
    pending: "#9333EA", accepted: "#2563EB", in_progress: "#0EA5E9",
    rescued: "#059669", completed: "#10B981", cancelled: "#EF4444",
    dispatched: "#D97706", on_site: T.accent, resolved: "#059669",
    active: "#059669", available: "#059669", busy: "#EA580C", offline: "#6B7280",
    approved: "#059669", rejected: "#EF4444",
  };
  const color = colorMap[status] || T.textMuted;
  return (
    <span className="rq-chip" style={{
      background: `${color}15`, borderColor: `${color}30`, color
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {STATUS_LABEL[status] || status?.replace(/_/g, " ") || status}
    </span>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
export function SectionLabel({ children, action, onAction }) {
  const { T } = useT();
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: "var(--space-4)"
    }}>
      <h3 style={{
        fontSize: "var(--text-xs)", fontWeight: 700, color: T.textSub,
        letterSpacing: "0.08em", textTransform: "uppercase", margin: 0,
      }}>
        {children}
      </h3>
      {action && (
        <button onClick={onAction} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "var(--text-xs)", color: T.accent, fontWeight: 700,
          fontFamily: "inherit", display: "flex", alignItems: "center", gap: "0.25rem",
        }}>
          {action}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
export function Card({ children, style: s = {}, hover = true, onClick }) {
  return (
    <motion.div
      whileHover={hover && !onClick ? {} : hover && onClick ? { y: -2 } : {}}
      onClick={onClick}
      className={`rq-card ${onClick ? "rq-card-interactive" : ""}`}
      style={{
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

  const roleLabels = { user: "My Dashboard", ngo: "NGO Command Center", volunteer: "Field Operations", admin: "Platform Control" };
  const roleDescriptions = {
    user: "Track your rescues, AI scans, and adoption applications",
    ngo: "Manage rescue operations, volunteer coordination, and analytics",
    volunteer: "View your active missions and field assignments",
    admin: "Platform health, NGO verification, and system analytics",
  };
  const roleColors = { user: T.accent, ngo: T.success || "#059669", volunteer: T.warning || "#D97706", admin: T.danger || "#DC2626" };
  const rColor = roleColors[role] || T.accent;

  return (
    <div className="rq-dashboard-header">
      <div className="rq-dashboard-header-content">
        <div className="rq-dashboard-role-pill" style={{ color: rColor, background: `${rColor}15` }}>
          {roleLabels[role] || "Dashboard"}
        </div>
        <h1 className="rq-section-title" style={{ margin: 0, marginBottom: "var(--space-1)" }}>
          Welcome back, {userName} 👋
        </h1>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: T.textSub }}>
          {roleDescriptions[role]}
        </p>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {role !== "admin" && (
          <button
            onClick={() => navigate("/rescue")}
            style={{
              padding: "0.6rem 1.2rem", borderRadius: "var(--radius-md)",
              background: T.accent, border: "none", color: "#fff",
              fontSize: "var(--text-sm)", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.4rem",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Rescue
          </button>
        )}
      </div>
    </div>
  );
}

// ─── STATS ROW ────────────────────────────────────────────────────────────────
export function DashboardStats({ stats = [] }) {
  const { T } = useT();
  const safeStats = Array.isArray(stats) ? stats : [];

  if (safeStats.length === 0) return null;

  return (
    <div className="rq-dashboard-stats-grid">
      {safeStats.map((stat, i) => (
        <div key={i} className="rq-section-card" style={{ padding: "var(--space-5)", marginBottom: 0, position: "relative", border: stat.highlight ? `1px solid ${T.accent}` : undefined }}>
          {stat.highlight && (
            <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: T.accent }} />
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-3)" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {stat.label}
            </div>
            {stat.icon && (
              <div style={{ fontSize: "1.2rem", color: stat.highlight ? T.accent : T.textMuted, opacity: 0.8 }}>
                {stat.icon}
              </div>
            )}
          </div>
          <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: stat.highlight ? T.accent : T.textHeading || T.text, lineHeight: 1 }}>
            {stat.value}
          </div>
          {stat.sub && (
            <div style={{ fontSize: "var(--text-xs)", marginTop: "var(--space-2)", fontWeight: 600, color: stat.trend === "up" ? "#059669" : stat.trend === "down" ? "#DC2626" : T.textMuted }}>
              {stat.trend === "up" ? "↑ " : stat.trend === "down" ? "↓ " : ""}{stat.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
const FEED_ICON_SVG = {
  rescue: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  scan: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  ngo: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  adoption: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  volunteer: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  system: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
};

export function DashboardActivityFeed({ items = [], limit = 6 }) {
  const { T } = useT();
  const [expanded, setExpanded] = useState(false);
  const safeItems = Array.isArray(items) ? items : [];
  const shown = expanded ? safeItems : safeItems.slice(0, limit);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {shown.map((item, i) => {
          const severityColors = { critical: "#DC2626", high: "#EA580C", medium: "#D97706", low: "#059669" };
          const color = severityColors[item.severity] || T.accent;
          const icon = FEED_ICON_SVG[item.type];
          return (
            <div
              key={item.id || i}
              style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "10px 0",
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: `${color}10`, border: `1px solid ${color}20`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color,
              }}>
                {icon || <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>●</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.8rem", color: T.text, fontWeight: 500, lineHeight: 1.35, letterSpacing: "-0.005em" }}>
                  {item.text}
                </div>
                <div style={{ fontSize: "0.68rem", color: T.textMuted, marginTop: 2 }}>{item.time}</div>
              </div>
            </div>
          );
        })}
      </div>
      {safeItems.length > limit && (
        <button
          onClick={() => setExpanded((p) => !p)}
          style={{
            marginTop: 10, background: "none", border: "none",
            cursor: "pointer", color: T.accent, fontSize: "0.76rem",
            fontWeight: 600, fontFamily: "inherit", padding: "4px 0",
            display: "flex", alignItems: "center", gap: "0.3rem",
          }}
        >
          {expanded ? "Show less" : `Show ${safeItems.length - limit} more`}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d={expanded ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export function DashboardNotifications({ items = [], onClose, onMarkAll }) {
  const { T } = useT();
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.16 }}
      style={{
        position: "absolute", top: "calc(100% + 8px)", right: 0,
        width: "min(360px, calc(100vw - 24px))",
        background: T.bgCard, border: `1px solid ${T.border}`,
        borderRadius: 14, boxShadow: T.shadowLg, zIndex: 200, overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 16px 12px", borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.textHeading || T.text, letterSpacing: "-0.02em" }}>
          Notifications
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={onMarkAll} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.72rem", color: T.accent, fontFamily: "inherit", fontWeight: 600,
          }}>
            Mark all read
          </button>
          <button onClick={onClose} style={{
            width: 26, height: 26, borderRadius: 7,
            border: `1px solid ${T.border}`, background: T.bgAlt,
            cursor: "pointer", color: T.textMuted, fontSize: "0.9rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            ✕
          </button>
        </div>
      </div>

      {/* Items */}
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {safeItems.length === 0 && (
          <div style={{ padding: "2rem 1rem", textAlign: "center", color: T.textMuted, fontSize: "0.84rem" }}>
            No notifications yet
          </div>
        )}
        {safeItems.map((n) => (
          <div key={n.id} style={{
            display: "flex", gap: 10, padding: "12px 16px",
            borderBottom: `1px solid ${T.border}`,
            background: n.read ? "transparent" : T.accentSurface || T.accentPale,
            alignItems: "flex-start",
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", marginTop: 6,
              background: n.read ? T.border : T.accent, flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: T.text, lineHeight: 1.35 }}>{n.title}</div>
              <div style={{ fontSize: "0.73rem", color: T.textSub, marginTop: 2, lineHeight: 1.45 }}>{n.body}</div>
              <div style={{ fontSize: "0.66rem", color: T.textMuted, marginTop: 3 }}>{n.time}</div>
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
    <div style={{ position: "relative", paddingLeft: 24 }}>
      <div style={{
        position: "absolute", left: 10, top: 8, bottom: 8,
        width: 2, background: T.border, borderRadius: 2,
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {safeEvents.map((ev, i) => {
          const severityColors = { critical: "#DC2626", high: "#EA580C", medium: "#D97706", low: "#059669" };
          const color = severityColors[ev.type] || T.accent;
          return (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: ev.done ? color : T.bgCard,
                border: `2px solid ${ev.done ? color : T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, position: "absolute", left: 1, marginTop: 2,
                zIndex: 1,
              }}>
                {ev.done && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5L3.5 6.5 7.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div style={{ marginLeft: 12 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: T.text, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{ev.label}</div>
                {ev.time && <div style={{ fontSize: "0.68rem", color: T.textMuted, marginTop: 2 }}>{ev.time}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BAR CHART ────────────────────────────────────────────────────────────────
export function DashboardBarChart({ data = [], label, color }) {
  const { T } = useT();
  const safeData = Array.isArray(data) ? data : [];
  const max = safeData.length > 0 ? Math.max(...safeData) : 0;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
    return <div style={{ padding: 18, borderRadius: 12, border: `1px solid ${T.border}`, color: T.textMuted, fontSize: "0.82rem" }}>No data available.</div>;
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

// ─── QUICK ACTIONS ────────────────────────────────────────────────────────────
export function DashboardQuickActions({ actions = [] }) {
  const { T } = useT();
  const safeActions = Array.isArray(actions) ? actions : [];
  return (
    <div className="rq-quick-action-grid">
      {safeActions.map((action, i) => (
        <button
          key={i}
          onClick={action.onClick}
          className="rq-section-card"
          style={{
            padding: "var(--space-4)", marginBottom: 0,
            border: action.danger ? `1px solid ${T.dangerBorder || "rgba(220,38,38,0.2)"}` : `1px solid ${T.border}`,
            background: action.primary ? T.accent : action.danger ? (T.dangerPale || "rgba(220,38,38,0.07)") : T.bgCard,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8,
            textAlign: "left",
            boxShadow: action.primary ? `0 2px 8px ${T.accentGlow || "rgba(0,0,0,0.2)"}` : "var(--shadow-sm)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
        >
          <span style={{ fontSize: "1.15rem", color: action.primary ? "#fff" : action.danger ? T.danger : T.accent }}>{action.icon}</span>
          <div>
            <div style={{
              fontSize: "var(--text-sm)", fontWeight: 700,
              color: action.primary ? "#fff" : action.danger ? (T.danger || "#DC2626") : T.textHeading || T.text,
              letterSpacing: "-0.01em", lineHeight: 1.25,
            }}>
              {action.label}
            </div>
            {action.sub && (
              <div style={{ fontSize: "var(--text-xs)", color: action.primary ? "rgba(255,255,255,0.65)" : T.textMuted, marginTop: 2, lineHeight: 1.3 }}>
                {action.sub}
              </div>
            )}
          </div>
        </button>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rq-modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="rq-modal"
            style={{ width: `min(${width}px, calc(100vw - 32px))` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="rq-modal-header">
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: T.textHeading || T.text, letterSpacing: "-0.025em" }}>{title}</div>
              <button
                onClick={onClose}
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  border: `1px solid ${T.border}`, background: T.bgAlt,
                  cursor: "pointer", color: T.textMuted,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = T.dangerPale || "rgba(220,38,38,0.07)"; e.currentTarget.style.color = T.danger || "#DC2626"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = T.bgAlt; e.currentTarget.style.color = T.textMuted; }}
              >
                ✕
              </button>
            </div>
            <div className="rq-modal-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── RESCUE CASE ROW ──────────────────────────────────────────────────────────
export function RescueCaseRow({ rescue, onView, onAssign, showAssign = false }) {
  const { T } = useT();
  const thumb = getRescueImageUrl(rescue);
  return (
    <div className="rq-rescue-row" onClick={onView} style={{ cursor: "pointer" }}>
      {/* Thumbnail */}
      {thumb ? (
        <img src={thumb} alt="rescue" className="rq-rescue-row-thumb" />
      ) : (
        <div className="rq-rescue-row-thumb" style={{
          background: T.bgAlt, border: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      )}

      {/* Info */}
      <div className="rq-rescue-row-content">
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: T.textMuted, fontFamily: "monospace" }}>
            #{rescue.id || rescue._id?.slice(-6)}
          </span>
          <SeverityBadge level={rescue.severity} />
        </div>
        <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: T.text, letterSpacing: "-0.015em", lineHeight: 1.25 }}>
          {rescue.animal || rescue.animalType || "Animal rescue"}
        </div>
        <div style={{ fontSize: "var(--text-xs)", color: T.textMuted, marginTop: 2, display: "flex", alignItems: "center", gap: 3 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {rescue.location || rescue.address || "Location not set"}
        </div>
      </div>

      {/* Status */}
      <div style={{ flexShrink: 0 }}>
        <StatusBadge status={rescue.status} />
      </div>

      {/* AI Score */}
      {rescue.aiScore != null && (
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "var(--text-xs)", color: T.textMuted, marginBottom: 2 }}>AI Score</div>
          <div style={{
            fontSize: "var(--text-sm)", fontWeight: 800, letterSpacing: "-0.03em",
            color: rescue.aiScore >= 70 ? (T.danger || "#DC2626")
                 : rescue.aiScore >= 40 ? (T.warning || "#D97706")
                 : (T.success || "#059669"),
          }}>
            {rescue.aiScore}
          </div>
        </div>
      )}

      {/* Assign button */}
      {showAssign && (
        <button
          onClick={(e) => { e.stopPropagation(); onAssign?.(rescue); }}
          style={{
            padding: "5px 12px", borderRadius: "var(--radius-sm)",
            background: T.accent, border: "none", color: "#fff",
            fontSize: "var(--text-xs)", fontWeight: 700,
            cursor: "pointer", flexShrink: 0,
          }}
        >
          Assign
        </button>
      )}
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const SIDEBAR_ICONS = {
  overview: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  rescues: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  scans: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  adoptions: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  activity: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  volunteers: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  analytics: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  missions: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg>,
  tasks: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  history: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ngos: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  users: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  ai: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
  alerts: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  settings: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
};

export function DashboardSidebar({ role, activeSection, onSection }) {
  const { T } = useT();
  const navigate = useNavigate();

  const SECTIONS = {
    user: [
      { id: "overview", label: "Overview" },
      { id: "rescues", label: "My Rescues" },
      { id: "scans", label: "AI Scans" },
      { id: "adoptions", label: "Adoptions" },
      { id: "activity", label: "Activity Log" },
    ],
    ngo: [
      { id: "overview", label: "Overview" },
      { id: "rescues", label: "Active Rescues" },
      { id: "volunteers", label: "Volunteers" },
      { id: "adoptions", label: "Adoption Queue" },
      { id: "analytics", label: "Analytics" },
    ],
    volunteer: [
      { id: "overview", label: "Overview" },
      { id: "missions", label: "My Missions" },
      { id: "tasks", label: "Tasks" },
      { id: "history", label: "History" },
    ],
    admin: [
      { id: "overview", label: "Overview" },
      { id: "ngos", label: "NGO Management" },
      { id: "rescues", label: "Rescue Operations" },
      { id: "users", label: "User Management" },
      { id: "ai", label: "AI Monitoring" },
      { id: "analytics", label: "Analytics" },
      { id: "alerts", label: "System Alerts" },
      { id: "settings", label: "Settings" },
    ],
  };

  const sections = SECTIONS[role] || SECTIONS.user;

  return (
    <div style={{
      width: 220, flexShrink: 0,
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: 14, padding: "12px 8px 16px",
      boxShadow: T.shadow,
      height: "fit-content",
      position: "sticky", top: "clamp(4.5rem, 10vw, 5.75rem)",
    }}>
      <div style={{
        fontSize: "0.62rem", fontWeight: 700, color: T.textMuted,
        letterSpacing: "0.1em", textTransform: "uppercase",
        padding: "4px 12px 10px",
      }}>
        Navigation
      </div>

      {sections.map((s) => {
        const active = activeSection === s.id;
        const icon = SIDEBAR_ICONS[s.id] || SIDEBAR_ICONS.overview;
        return (
          <button
            key={s.id}
            onClick={() => onSection(s.id)}
            style={{
              width: "100%", padding: "9px 12px",
              borderRadius: 8, border: "none",
              background: active ? T.accentSurface || T.accentPale : "transparent",
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 10,
              textAlign: "left",
              borderLeft: active ? `3px solid ${T.accent}` : "3px solid transparent",
              transition: "all 0.15s",
              marginBottom: 2,
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.bgAlt; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ color: active ? T.accent : T.textMuted, flexShrink: 0, display: "flex", alignItems: "center" }}>
              {icon}
            </span>
            <span style={{
              fontSize: "0.82rem", fontWeight: active ? 700 : 500,
              color: active ? T.accent : T.textSub,
              letterSpacing: "-0.01em",
            }}>
              {s.label}
            </span>
          </button>
        );
      })}

      {/* Divider */}
      <div style={{ height: 1, background: T.border, margin: "10px 12px" }} />

      {/* Home link */}
      <button
        onClick={() => navigate("/")}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 10, border: "none",
          background: "transparent", cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 10,
          textAlign: "left", borderLeft: "3px solid transparent",
          transition: "background 0.15s",
          color: T.textMuted,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = T.bgAlt}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span style={{ fontSize: "0.82rem", fontWeight: 500, color: T.textSub }}>Back to Home</span>
      </button>
    </div>
  );
}
