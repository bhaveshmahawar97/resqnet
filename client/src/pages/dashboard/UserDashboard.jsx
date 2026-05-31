import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useViewport from "../../hooks/useViewport";
import DashboardPage from "../../components/dashboard/DashboardPage";
import DashboardSectionTabs from "../../components/dashboard/DashboardSectionTabs";
import { getImageUrl } from "../../utils/imageUrl";
import {
  DashboardModal,
  DashboardErrorBoundary,
  SeverityBadge,
  StatusBadge,
  DashboardTimeline,
} from "../../components/dashboard/DashboardShared";
import LoadingState from "../../components/system/LoadingState";
import ErrorState from "../../components/system/ErrorState";
import useDashboardData from "../../hooks/useDashboardData";
import AnalysisReportModal from "../../components/scanner/AnalysisReportModal";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  overview: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  rescues: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  scans: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  adoptions: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  activity: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  emergency: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  scan: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  heart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  building: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  plus: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  eye: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  clock: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  home: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  trendUp: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  paw: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/>
      <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>
    </svg>
  ),
};

// ─── GREETING HELPER ─────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ─── PERSONALIZED HEADER ─────────────────────────────────────────────────────
function UserHeader({ user, onEmergency }) {
  const { T } = useT();
  const firstName = (user?.fullName || user?.name || "").split(" ")[0] || "Rescuer";
  const initials = getInitials(user?.fullName || user?.name || "U");

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 0 16px", gap: 16, flexWrap: "wrap",
    }}>
      {/* Left: avatar + greeting */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.accent}, ${T.accentDeep})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: "1rem", fontWeight: 800,
          letterSpacing: "-0.02em", flexShrink: 0,
          boxShadow: `0 0 0 3px ${T.accentPale}`,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: "1.18rem", fontWeight: 800, color: T.textHeading, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
            {getGreeting()}, {firstName}
          </div>
          <div style={{ fontSize: "0.75rem", color: T.textMuted, marginTop: 2, fontWeight: 500 }}>
            {formatDate()}
          </div>
        </div>
      </div>

      {/* Right: emergency button */}
      <button
        onClick={onEmergency}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 18px", borderRadius: 10,
          background: T.danger, border: "none",
          color: "#fff", fontSize: "0.82rem", fontWeight: 700,
          cursor: "pointer", letterSpacing: "-0.01em",
          boxShadow: `0 2px 12px rgba(220,38,38,0.28)`,
          transition: "all 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 4px 18px rgba(220,38,38,0.36)`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 2px 12px rgba(220,38,38,0.28)`; }}
      >
        {Icon.emergency}
        Report Emergency
      </button>
    </div>
  );
}

// ─── STATS ROW ───────────────────────────────────────────────────────────────
const STAT_DEFS = [
  { key: "rescues",    label: "My Rescues",        icon: Icon.rescues,  trend: "up",   trendLabel: "this month", color: "accent" },
  { key: "scans",      label: "AI Scans Used",      icon: Icon.scans,    trend: "up",   trendLabel: "past 30d",   color: "info" },
  { key: "adoptions",  label: "Adoptions Applied",  icon: Icon.heart,    trend: "none", trendLabel: "total",      color: "success" },
  { key: "helped",     label: "Animals Helped",     icon: Icon.paw,      trend: "up",   trendLabel: "lifetime",   color: "warning" },
];

function UserStats({ stats }) {
  const { T } = useT();
  const colorMap = { accent: T.accent, info: T.info, success: T.success, warning: T.warning };

  const getValue = (key) => {
    if (!stats) return 0;
    if (Array.isArray(stats)) {
      const s = stats.find(s => s.key === key || s.label?.toLowerCase().includes(key));
      return s?.value ?? 0;
    }
    return stats[key] ?? 0;
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 12, marginBottom: 20,
    }}>
      {STAT_DEFS.map((def) => {
        const color = colorMap[def.color] || T.accent;
        const value = getValue(def.key);
        return (
          <div
            key={def.key}
            style={{
              background: T.bgCard, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: "16px 18px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Accent strip */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "12px 12px 0 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {def.label}
              </div>
              <div style={{ color, opacity: 0.7 }}>{def.icon}</div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: T.textHeading, lineHeight: 1, letterSpacing: "-0.04em" }}>
              {value}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
              {def.trend === "up" && (
                <span style={{ color: T.success, display: "flex", alignItems: "center" }}>{Icon.trendUp}</span>
              )}
              <span style={{ fontSize: "0.68rem", color: def.trend === "up" ? T.success : T.textMuted, fontWeight: 600 }}>
                {def.trendLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "overview",   label: "Overview",     icon: Icon.overview },
  { id: "rescues",    label: "My Rescues",   icon: Icon.rescues },
  { id: "scans",      label: "AI Scans",     icon: Icon.scans },
  { id: "adoptions",  label: "Adoptions",    icon: Icon.adoptions },
  { id: "activity",   label: "Activity Log", icon: Icon.activity },
];

function UserSidebar({ activeSection, onSection }) {
  const { T } = useT();
  const navigate = useNavigate();

  return (
    <div style={{
      width: 210, flexShrink: 0,
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: 14, padding: "10px 6px 14px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      height: "fit-content",
      position: "sticky", top: "clamp(4.5rem, 10vw, 5.75rem)",
    }}>
      <div style={{
        fontSize: "0.6rem", fontWeight: 700, color: T.textMuted,
        letterSpacing: "0.1em", textTransform: "uppercase",
        padding: "4px 10px 8px",
      }}>
        Navigation
      </div>

      {SECTIONS.map((s) => {
        const active = activeSection === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSection(s.id)}
            style={{
              width: "100%", padding: "8px 10px",
              borderRadius: 8, border: "none",
              background: active ? T.accentSurface : "transparent",
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 9,
              textAlign: "left",
              borderLeft: active ? `3px solid ${T.accent}` : "3px solid transparent",
              transition: "all 0.14s",
              marginBottom: 1,
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.bgAlt; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ color: active ? T.accent : T.textMuted, flexShrink: 0, display: "flex", alignItems: "center" }}>
              {s.icon}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: active ? 700 : 500, color: active ? T.accent : T.textSub, letterSpacing: "-0.01em" }}>
              {s.label}
            </span>
          </button>
        );
      })}

      <div style={{ height: 1, background: T.border, margin: "8px 10px" }} />

      <button
        onClick={() => navigate("/")}
        style={{
          width: "100%", padding: "8px 10px", borderRadius: 8, border: "none",
          background: "transparent", cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 9,
          textAlign: "left", borderLeft: "3px solid transparent",
          transition: "background 0.14s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = T.bgAlt}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <span style={{ color: T.textMuted, display: "flex", alignItems: "center" }}>{Icon.home}</span>
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: T.textSub }}>Back to Home</span>
      </button>
    </div>
  );
}

// ─── QUICK ACTIONS 2x2 ───────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    label: "Report Emergency",
    desc: "File an urgent animal rescue report",
    icon: Icon.emergency,
    path: "/rescue",
    danger: true,
  },
  {
    label: "AI Health Scan",
    desc: "Analyse an animal's condition with AI",
    icon: Icon.scan,
    path: "/scanner",
    primary: true,
  },
  {
    label: "Browse Adoptions",
    desc: "Find animals available for adoption",
    icon: Icon.heart,
    path: "/adoption",
  },
  {
    label: "Find NGOs",
    desc: "Locate verified rescue organisations",
    icon: Icon.building,
    path: "/ngos",
  },
];

function QuickActionsGrid({ onNavigate }) {
  const { T } = useT();
  return (
    <div>
      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
        Quick Actions
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {QUICK_ACTIONS.map((a) => {
          const bg = a.danger ? T.dangerPale : a.primary ? T.accent : T.bgCard;
          const iconColor = a.danger ? T.danger : a.primary ? "#fff" : T.accent;
          const textColor = a.primary ? "#fff" : T.textHeading;
          const subColor = a.primary ? "rgba(255,255,255,0.65)" : T.textMuted;
          const borderColor = a.danger ? `rgba(220,38,38,0.2)` : a.primary ? "transparent" : T.border;
          return (
            <button
              key={a.label}
              onClick={() => onNavigate(a.path)}
              style={{
                padding: "14px 14px", borderRadius: 12,
                background: bg, border: `1px solid ${borderColor}`,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8,
                textAlign: "left",
                boxShadow: a.primary ? `0 2px 10px ${T.accentGlow}` : "0 1px 4px rgba(0,0,0,0.04)",
                transition: "all 0.14s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = a.primary ? `0 4px 18px ${T.accentGlow}` : "0 3px 10px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = a.primary ? `0 2px 10px ${T.accentGlow}` : "0 1px 4px rgba(0,0,0,0.04)"; }}
            >
              <span style={{ color: iconColor, display: "flex" }}>{a.icon}</span>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: textColor, lineHeight: 1.2 }}>{a.label}</div>
                <div style={{ fontSize: "0.7rem", color: subColor, marginTop: 3, lineHeight: 1.35 }}>{a.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── RESCUE TABLE ─────────────────────────────────────────────────────────────
function RescueTable({ rescues, onView }) {
  const { T } = useT();
  if (!rescues || rescues.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 20px", gap: 12,
      }}>
        <div style={{ fontSize: "2.2rem", opacity: 0.35 }}>
          {/* paw SVG as empty state illustration */}
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/>
            <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>
          </svg>
        </div>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.textHeading }}>No rescues yet</div>
        <div style={{ fontSize: "0.78rem", color: T.textMuted, textAlign: "center", maxWidth: 240, lineHeight: 1.5 }}>
          When you report a rescue, it will appear here with real-time status updates.
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
        <thead>
          <tr>
            {["Animal", "Severity", "Status", "Location", "Date", ""].map((h) => (
              <th key={h} style={{
                padding: "8px 12px", textAlign: "left",
                fontSize: "0.65rem", fontWeight: 700, color: T.textMuted,
                textTransform: "uppercase", letterSpacing: "0.07em",
                borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                background: T.bgAlt,
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rescues.map((r, i) => (
            <motion.tr
              key={r.id || r._id || i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.18 }}
              style={{ borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = T.bgCardHov}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              onClick={() => onView(r)}
            >
              <td style={{ padding: "10px 12px", fontWeight: 600, color: T.text }}>
                {r.animal || r.animalType || "Unknown"}
              </td>
              <td style={{ padding: "10px 12px" }}>
                <SeverityBadge level={r.severity} />
              </td>
              <td style={{ padding: "10px 12px" }}>
                <StatusBadge status={r.status} />
              </td>
              <td style={{ padding: "10px 12px", color: T.textSub, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.location || "N/A"}
              </td>
              <td style={{ padding: "10px 12px", color: T.textMuted, whiteSpace: "nowrap" }}>
                {r.date || r.createdAt ? new Date(r.date || r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
              </td>
              <td style={{ padding: "10px 12px" }}>
                <button
                  onClick={e => { e.stopPropagation(); onView(r); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", borderRadius: 6,
                    border: `1px solid ${T.border}`, background: T.bgAlt,
                    cursor: "pointer", fontFamily: "inherit",
                    fontSize: "0.72rem", fontWeight: 600, color: T.textSub,
                    transition: "all 0.13s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.accentSurface; e.currentTarget.style.color = T.accent; e.currentTarget.style.borderColor = T.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.bgAlt; e.currentTarget.style.color = T.textSub; e.currentTarget.style.borderColor = T.border; }}
                >
                  {Icon.eye} View
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
function ActivityFeed({ rescues, onView }) {
  const { T } = useT();
  if (!rescues || rescues.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", gap: 10 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.textHeading }}>No recent activity</div>
        <div style={{ fontSize: "0.75rem", color: T.textMuted }}>Your rescue activity will appear here.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {rescues.slice(0, 6).map((r, i) => (
        <div
          key={r.id || r._id || i}
          onClick={() => onView(r)}
          style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            padding: "12px 0",
            borderBottom: i < rescues.length - 1 ? `1px solid ${T.border}` : "none",
            cursor: "pointer",
          }}
        >
          {/* Status dot */}
          <div style={{ width: 32, height: 32, borderRadius: 8, background: T.accentPale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: T.accent, display: "flex" }}>{Icon.rescues}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: T.text }}>
                {r.animal || r.animalType || "Animal"} rescue
              </span>
              <StatusBadge status={r.status} />
              <SeverityBadge level={r.severity} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
              <span style={{ color: T.textMuted, display: "flex", alignItems: "center" }}>{Icon.clock}</span>
              <span style={{ fontSize: "0.68rem", color: T.textMuted }}>
                {r.date || r.createdAt ? new Date(r.date || r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently"}
              </span>
              {r.location && (
                <span style={{ fontSize: "0.68rem", color: T.textMuted }}> · {r.location}</span>
              )}
            </div>
            {/* Inline status timeline mini-indicator */}
            {r.status && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                {["pending", "accepted", "resolved"].map((step, si) => {
                  const stepOrder = { pending: 0, accepted: 1, in_progress: 1, dispatched: 1, resolved: 2, rescued: 2, completed: 2 };
                  const currentStep = stepOrder[r.status] ?? 0;
                  const done = si <= currentStep;
                  return (
                    <div key={step} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: done ? T.accent : T.border,
                        transition: "background 0.2s",
                      }} />
                      <span style={{ fontSize: "0.6rem", color: done ? T.accent : T.textMuted, fontWeight: done ? 700 : 400, textTransform: "capitalize" }}>
                        {step}
                      </span>
                      {si < 2 && <div style={{ width: 16, height: 1, background: done && si < currentStep ? T.accent : T.border }} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SCAN EMPTY STATE ─────────────────────────────────────────────────────────
function ScansEmptyState({ onNavigate }) {
  const { T } = useT();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: 14 }}>
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.textHeading }}>No AI scans yet</div>
      <div style={{ fontSize: "0.75rem", color: T.textMuted, textAlign: "center", maxWidth: 220, lineHeight: 1.5 }}>
        Upload a photo of an animal to get an instant AI health assessment.
      </div>
      <button
        onClick={() => onNavigate("/scanner")}
        style={{
          padding: "8px 18px", borderRadius: 9, background: T.accent,
          border: "none", color: "#fff", fontSize: "0.78rem", fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Start AI Scan
      </button>
    </div>
  );
}

// ─── ADOPTIONS EMPTY STATE ────────────────────────────────────────────────────
function AdoptionsEmptyState({ onNavigate }) {
  const { T } = useT();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: 14 }}>
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.textHeading }}>No adoptions applied</div>
      <div style={{ fontSize: "0.75rem", color: T.textMuted, textAlign: "center", maxWidth: 240, lineHeight: 1.5 }}>
        Browse animals available for adoption and give them a loving home.
      </div>
      <button
        onClick={() => onNavigate("/adoption")}
        style={{
          padding: "8px 18px", borderRadius: 9, background: T.success,
          border: "none", color: "#fff", fontSize: "0.78rem", fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Browse Adoptions
      </button>
    </div>
  );
}

// ─── SECTION CARD WRAPPER ─────────────────────────────────────────────────────
function SectionCard({ title, action, onAction, children }) {
  const { T } = useT();
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: 14, overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      {title && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", borderBottom: `1px solid ${T.border}`,
        }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>
            {title}
          </div>
          {action && (
            <button
              onClick={onAction}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.72rem", color: T.accent, fontWeight: 700,
                fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
              }}
            >
              {action}
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      )}
      <div style={{ padding: title ? "14px 16px" : "16px" }}>
        {children}
      </div>
    </div>
  );
}

// ─── SECTION RENDERERS ────────────────────────────────────────────────────────
function OverviewSection({ config, onAction, onNavigate }) {
  const rescues = config?.widgets?.overview?.find(w => w.type === "RescueList")?.data
    || config?.widgets?.rescues?.find(w => w.type === "RescueList")?.data
    || [];
  const activityData = rescues;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <QuickActionsGrid onNavigate={onNavigate} />
      <SectionCard title="Recent Activity" action="View all" onAction={() => onAction("section", "rescues")}>
        <ActivityFeed rescues={activityData} onView={r => onAction("view_rescue", r)} />
      </SectionCard>
    </div>
  );
}

function RescuesSection({ config, onView }) {
  const rescues = config?.widgets?.rescues?.find(w => w.type === "RescueList")?.data || [];
  return (
    <SectionCard title="My Rescues">
      <RescueTable rescues={rescues} onView={onView} />
    </SectionCard>
  );
}

function ScansSection({ config, onView, onNavigate }) {
  const scans = config?.widgets?.scans?.find(w => w.type === "ScanList" || w.type === "RescueList")?.data || [];
  if (!scans || scans.length === 0) {
    return (
      <SectionCard title="AI Scans">
        <ScansEmptyState onNavigate={onNavigate} />
      </SectionCard>
    );
  }
  return (
    <SectionCard title="AI Scans">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {scans.map((scan, i) => (
          <div key={scan.id || scan._id || i} onClick={() => onView(scan)} style={{ cursor: "pointer", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{scan.animal || "Scan"}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function AdoptionsSection({ config, onNavigate }) {
  const adoptions = config?.widgets?.adoptions?.find(w => w.type === "AdoptionList")?.data || [];
  if (!adoptions || adoptions.length === 0) {
    return (
      <SectionCard title="My Adoptions">
        <AdoptionsEmptyState onNavigate={onNavigate} />
      </SectionCard>
    );
  }
  return (
    <SectionCard title="My Adoptions">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
        {adoptions.map((app, i) => (
          <div key={app._id || app.id || i} style={{ padding: 14, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-alt)" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{app.adoption?.animalName || app.adoption?.animalType || "Animal"}</div>
            <StatusBadge status={app.status} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function ActivitySection({ config, onView }) {
  const rescues = config?.widgets?.rescues?.find(w => w.type === "RescueList")?.data
    || config?.widgets?.overview?.find(w => w.type === "RescueList")?.data
    || [];
  return (
    <SectionCard title="Activity Log">
      <ActivityFeed rescues={rescues} onView={onView} />
    </SectionCard>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function UserDashboard() {
  const { T } = useT();
  const vp = useViewport();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: config, isLoading, error } = useDashboardData();
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState({ open: false, type: null, data: null });

  if (isLoading) return <DashboardPage><LoadingState message="Loading dashboard..." minHeight="80vh" /></DashboardPage>;
  if (error) return <DashboardPage><ErrorState message="Failed to load dashboard data." minHeight="80vh" /></DashboardPage>;
  if (!config) return <DashboardPage><ErrorState message="Dashboard configuration missing." minHeight="80vh" /></DashboardPage>;

  const handleAction = (actionType, payload) => {
    switch (actionType) {
      case "navigate":
        if (payload?.path) navigate(payload.path);
        break;
      case "section":
        setSection(payload);
        break;
      case "view_rescue":
        setModal({ open: true, type: "rescue", data: payload });
        break;
      case "view_scan":
        setModal({ open: true, type: "scan", data: payload });
        break;
      default:
        console.log("Unhandled action:", actionType, payload);
    }
  };

  const handleNavigate = (path) => navigate(path);
  const closeModal = () => setModal({ open: false, type: null, data: null });

  // Derive stats from config
  const stats = config.stats;

  const sectionTabList = SECTIONS.map(s => ({ id: s.id, label: s.label }));

  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        {/* Personalized Header */}
        <UserHeader user={user} onEmergency={() => navigate("/rescue")} />

        {/* Stats */}
        <UserStats stats={stats} />

        {/* Layout: sidebar + content */}
        <div style={{
          display: "flex", gap: 18, alignItems: "flex-start",
        }}>
          {/* Sidebar (desktop only) */}
          {vp.desktop && (
            <UserSidebar activeSection={section} onSection={setSection} />
          )}

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Mobile section tabs */}
            {!vp.desktop && (
              <DashboardSectionTabs sections={sectionTabList} activeSection={section} onSection={setSection} />
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {section === "overview" && (
                  <OverviewSection config={config} onAction={handleAction} onNavigate={handleNavigate} />
                )}
                {section === "rescues" && (
                  <RescuesSection config={config} onView={r => setModal({ open: true, type: "rescue", data: r })} />
                )}
                {section === "scans" && (
                  <ScansSection config={config} onView={s => setModal({ open: true, type: "scan", data: s })} onNavigate={handleNavigate} />
                )}
                {section === "adoptions" && (
                  <AdoptionsSection config={config} onNavigate={handleNavigate} />
                )}
                {section === "activity" && (
                  <ActivitySection config={config} onView={r => setModal({ open: true, type: "rescue", data: r })} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Rescue detail modal */}
        <DashboardModal
          isOpen={modal.open && modal.type === "rescue"}
          title={`Rescue Report${modal.data?.id ? ` — ${modal.data.id}` : ""}`}
          onClose={closeModal}
        >
          {modal.data && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <SeverityBadge level={modal.data.severity} size="lg" />
                <StatusBadge status={modal.data.status} />
              </div>
              {modal.data.images && modal.data.images.length > 0 && (
                <div>
                  <img
                    src={getImageUrl(modal.data.images[0]) || ""}
                    alt="rescue"
                    style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 10 }}
                  />
                </div>
              )}
              {modal.data.status === "pending" && (
                <div style={{
                  padding: 12, borderRadius: 8,
                  background: `${T.warning}20`, border: `1px solid ${T.warning}40`,
                  color: T.warning, fontSize: "0.82rem", fontWeight: 600,
                  display: "flex", gap: 8, alignItems: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Awaiting response — nearest NGO is being notified.
                </div>
              )}
              {modal.data.status === "accepted" && modal.data.volunteer && (
                <div style={{
                  padding: 12, borderRadius: 8,
                  background: `${T.success}20`, border: `1px solid ${T.success}40`,
                  color: T.success, fontSize: "0.82rem", fontWeight: 600,
                  display: "flex", gap: 8, alignItems: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Help is on the way — {modal.data.volunteer} has been assigned.
                </div>
              )}
              {[
                ["Animal", modal.data.animal || modal.data.animalType],
                ["Location", modal.data.location],
                ["AI Score", modal.data.aiScore != null ? `${modal.data.aiScore}/100` : null],
                ["Assigned NGO", modal.data.assignedTo],
                ["Volunteer", modal.data.volunteer],
                ["Notes", modal.data.notes],
              ].filter(([, v]) => v != null && v !== "").map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 90, fontSize: "0.72rem", color: T.textMuted, fontWeight: 700, flexShrink: 0, paddingTop: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {k}
                  </div>
                  <div style={{ flex: 1, fontSize: "0.82rem", color: T.text, letterSpacing: "-0.01em", lineHeight: 1.4 }}>
                    {v}
                  </div>
                </div>
              ))}
              {(modal.data.rescueTimeline || modal.data.timeline) && (
                <div style={{ marginTop: 8, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
                    Rescue Timeline
                  </div>
                  <DashboardTimeline events={modal.data.rescueTimeline || modal.data.timeline || []} />
                </div>
              )}
            </div>
          )}
        </DashboardModal>

        {/* AI Scan modal */}
        {modal.open && modal.type === "scan" && (
          <AnalysisReportModal scanData={modal.data} onClose={closeModal} />
        )}
      </DashboardErrorBoundary>
    </DashboardPage>
  );
}
