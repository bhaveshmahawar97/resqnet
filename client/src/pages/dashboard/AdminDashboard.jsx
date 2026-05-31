import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardPage from "../../components/dashboard/DashboardPage";
import DashboardSectionTabs from "../../components/dashboard/DashboardSectionTabs";
import { getImageUrl } from "../../utils/imageUrl";
import {
  DashboardHeader, DashboardStats,
  DashboardModal, DashboardErrorBoundary,
  DashboardSidebar,
} from "../../components/dashboard/DashboardShared";
import { useRescue } from "../../context/RescueContext";
import LoadingState from "../../components/system/LoadingState";
import ErrorState from "../../components/system/ErrorState";
import useDashboardData from "../../hooks/useDashboardData";
import DashboardWidget from "../../components/dashboard/DashboardWidget";

// ─── Inline SVG Sparkline ────────────────────────────────────────────────────
function Sparkline({ data = [], color, width = 80, height = 28 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline
        points={pts.join(" ")}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.85"
      />
      <polyline
        points={`0,${height} ${pts.join(" ")} ${width},${height}`}
        fill={color}
        opacity="0.10"
        stroke="none"
      />
    </svg>
  );
}

// ─── Metric Card with sparkline ───────────────────────────────────────────────
function MetricCard({ label, value, trend, trendLabel, sparkData, color, icon }) {
  const { T } = useT();
  const isUp = trend === "up";
  const isDown = trend === "down";
  const trendColor = isUp ? T.success : isDown ? T.danger : T.textMuted;
  const trendArrow = isUp ? "↑" : isDown ? "↓" : "–";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: T.shadowMd }}
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: "16px 18px",
        boxShadow: T.shadowCard,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* Top row: label + icon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize: "0.67rem",
          fontWeight: 700,
          color: T.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          {label}
        </span>
        <span style={{
          fontSize: "1rem",
          color: color || T.accent,
          opacity: 0.75,
          lineHeight: 1,
        }}>
          {icon}
        </span>
      </div>

      {/* Value */}
      <div style={{
        fontSize: "clamp(1.5rem, 3vw, 2rem)",
        fontWeight: 800,
        color: T.textHeading || T.text,
        lineHeight: 1,
        letterSpacing: "-0.03em",
      }}>
        {value}
      </div>

      {/* Bottom: trend + sparkline */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 4 }}>
        {trendLabel && (
          <span style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: trendColor,
          }}>
            {trendArrow} {trendLabel}
          </span>
        )}
        {sparkData && (
          <Sparkline data={sparkData} color={color || T.accent} width={72} height={24} />
        )}
      </div>

      {/* Accent left border strip */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        borderRadius: "12px 0 0 12px",
        background: color || T.accent,
        opacity: 0.6,
      }} />
    </motion.div>
  );
}

// ─── Stats row that overrides base DashboardStats with sparklines ──────────
function AdminMetricsRow({ stats = [] }) {
  const { T } = useT();

  // Default sparkline mock data per metric (ascending, variant)
  const defaultSparks = {
    "Total Rescues": [12, 19, 14, 22, 18, 27, 24, 31],
    "Active NGOs": [8, 9, 8, 10, 11, 10, 12, 12],
    "Volunteers": [34, 38, 35, 40, 42, 39, 44, 47],
    "AI Scans": [5, 9, 7, 14, 11, 18, 15, 22],
  };

  const colorMap = [T.accent, T.success, T.warning, T.info];
  const iconMap = [
    // Rescue
    <svg key="r" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    // NGO
    <svg key="n" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
    // Volunteers
    <svg key="v" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    // AI
    <svg key="ai" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
  ];

  const safeStats = Array.isArray(stats) ? stats : [];

  // If the API provides stats, use them; otherwise render 4 defaults
  const items = safeStats.length > 0 ? safeStats.slice(0, 4) : [
    { label: "Total Rescues", value: "–", sub: "Loading...", trend: "up" },
    { label: "Active NGOs", value: "–", sub: "Loading...", trend: "up" },
    { label: "Volunteers", value: "–", sub: "Loading...", trend: "up" },
    { label: "AI Scans", value: "–", sub: "Loading...", trend: "up" },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: 12,
      marginBottom: 20,
    }}>
      {items.map((stat, i) => (
        <MetricCard
          key={stat.label || i}
          label={stat.label}
          value={stat.value}
          trend={stat.trend}
          trendLabel={stat.sub}
          sparkData={defaultSparks[stat.label] || defaultSparks["Total Rescues"]}
          color={colorMap[i % colorMap.length]}
          icon={iconMap[i % iconMap.length]}
        />
      ))}
    </div>
  );
}

// ─── Top Header Bar ──────────────────────────────────────────────────────────
function AdminTopBar({ userName, onVerifyNGOs, onSystemHealth, T }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "14px 0 18px",
      flexWrap: "wrap",
    }}>
      {/* Left: role badge + greeting */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          borderRadius: 20,
          background: `${T.danger}12`,
          border: `1px solid ${T.danger}30`,
          fontSize: "0.67rem",
          fontWeight: 800,
          color: T.danger,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          flexShrink: 0,
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: T.danger,
            display: "inline-block",
          }} />
          Admin
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: "1rem",
            fontWeight: 800,
            color: T.textHeading || T.text,
            letterSpacing: "-0.025em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {userName ? `Welcome, ${userName.split(" ")[0]}` : "Platform Control"}
          </div>
          <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 1 }}>
            ResQNet Operations Center
          </div>
        </div>
      </div>

      {/* Right: quick action buttons */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onVerifyNGOs}
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: 8,
            background: `${T.success}12`,
            border: `1px solid ${T.success}30`,
            color: T.success,
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "-0.01em",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          Verify NGOs
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSystemHealth}
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: 8,
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            color: T.textSub,
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "-0.01em",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          System Health
        </motion.button>
      </div>
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, T }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          style={{
            position: "fixed",
            top: 80,
            right: 20,
            zIndex: 9999,
            padding: "10px 16px",
            borderRadius: 10,
            background: T.bgCard,
            border: `1px solid ${T.success}30`,
            boxShadow: T.shadowMd,
            fontSize: "0.8rem",
            fontWeight: 700,
            color: T.success,
            display: "flex",
            alignItems: "center",
            gap: 8,
            maxWidth: 320,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Rescue Detail Modal Content ──────────────────────────────────────────────
function RescueDetailContent({ data, vp, T, assignLoading, onAutoAssign }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {data.images && data.images.length > 0 && (
        <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
          <img
            src={getImageUrl(data.images[0]) || ""}
            alt="rescue"
            style={{ width: "100%", maxHeight: 280, objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr",
        gap: 8,
      }}>
        {[
          ["Animal Type", data.animal],
          ["Location", data.location],
          ["Status", data.status],
          ["Assigned NGO", data.assignedTo],
          ["Volunteer", data.volunteer],
          ["AI Score", data.aiScore != null ? `${data.aiScore}/100` : "N/A"],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              background: T.bgAlt,
              borderRadius: 8,
              padding: "10px 12px",
              border: `1px solid ${T.borderLight || T.border}`,
            }}
          >
            <div style={{
              fontSize: "0.63rem",
              color: T.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 700,
              marginBottom: 4,
            }}>
              {label}
            </div>
            <div style={{ fontSize: "0.83rem", fontWeight: 700, color: T.text }}>
              {value || "N/A"}
            </div>
          </div>
        ))}
      </div>

      {data.rejectedBy?.length > 0 && (
        <div style={{
          background: `${T.danger}08`,
          border: `1px solid ${T.dangerBorder || T.danger}`,
          borderLeft: `3px solid ${T.danger}`,
          borderRadius: 8,
          padding: "10px 14px",
        }}>
          <div style={{ fontSize: "0.63rem", color: T.danger, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 800, marginBottom: 3 }}>
            Rejections
          </div>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: T.danger }}>
            Rejected by {data.rejectedBy.length} NGO{data.rejectedBy.length > 1 ? "s" : ""}
          </div>
        </div>
      )}

      {["pending", "rejected"].includes(data.status) && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          disabled={assignLoading}
          onClick={() => onAutoAssign(data.id)}
          style={{
            padding: "10px",
            borderRadius: 8,
            background: assignLoading ? T.bgAlt : T.accent,
            border: "none",
            color: assignLoading ? T.textMuted : T.textOnAccent,
            fontWeight: 700,
            fontSize: "0.83rem",
            cursor: assignLoading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: assignLoading ? 0.6 : 1,
            transition: "all 0.15s",
          }}
        >
          {assignLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%" }}
              />
              Assigning NGO...
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Auto-Assign Rescue Partner
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { T } = useT();
  const vp = useViewport();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: config, isLoading, error, refetch } = useDashboardData();
  const { autoAssignNgo } = useRescue();

  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [toast, setToast] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  if (isLoading) return <DashboardPage><LoadingState message="Loading operations center..." minHeight="80vh" /></DashboardPage>;
  if (error) return <DashboardPage><ErrorState message="Failed to load platform data." minHeight="80vh" /></DashboardPage>;
  if (!config) return <DashboardPage><ErrorState message="Platform configuration missing." minHeight="80vh" /></DashboardPage>;

  const showToast = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2800);
  };

  const handleAutoAssign = async (rescueId) => {
    setAssignLoading(true);
    const result = await autoAssignNgo(rescueId);
    setAssignLoading(false);
    if (result.success) {
      showToast("NGO auto-assigned successfully");
      setModal(m => ({ ...m, data: result.data }));
      refetch();
    } else {
      showToast(result.message || "Auto-assignment failed");
    }
  };

  const handleAction = (actionType, payload) => {
    switch (actionType) {
      case "navigate":
        if (payload?.path) navigate(payload.path);
        break;
      case "view_rescue":
        setModal({ open: true, type: "rescue", data: payload });
        break;
      case "view_user":
        setModal({ open: true, type: "user", data: payload });
        break;
      case "assign_rescue":
        if (payload?.id) handleAutoAssign(payload.id);
        break;
      default:
        console.log("Unhandled action:", actionType, payload);
    }
  };

  const userName = user?.fullName || user?.name || user?.email || "Administrator";

  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        {/* Fixed toast */}
        <Toast message={toast} T={T} />

        {/* Top admin header bar */}
        <AdminTopBar
          userName={userName}
          onVerifyNGOs={() => setSection("ngos")}
          onSystemHealth={() => setSection("alerts")}
          T={T}
        />

        {/* Divider */}
        <div style={{ height: 1, background: T.border, marginBottom: 20 }} />

        {/* Metric cards with sparklines */}
        <AdminMetricsRow stats={config.stats} />

        {/* Main layout: sidebar + content */}
        <div className="rq-dashboard-content-grid">
          {/* Sidebar — desktop only, sticky */}
          <div className="dashboard-sidebar-slot">
            <DashboardSidebar
              role="admin"
              activeSection={section}
              onSection={setSection}
              sections={config.sections}
            />
          </div>

          {/* Main content */}
          <div className="dashboard-main">
            {/* Mobile section tabs */}
            {!vp.desktop && (
              <DashboardSectionTabs
                sections={config?.sections || []}
                activeSection={section}
                onSection={setSection}
              />
            )}

            {/* Section header strip */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
              gap: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 3,
                  height: 18,
                  borderRadius: 2,
                  background: T.accent,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: "-0.02em",
                  textTransform: "capitalize",
                }}>
                  {section === "ngos" ? "NGO Management"
                    : section === "ai" ? "AI Monitor"
                    : section === "rescues" ? "Rescue Operations"
                    : section === "users" ? "User Management"
                    : section === "alerts" ? "System Alerts"
                    : section.charAt(0).toUpperCase() + section.slice(1)}
                </span>
              </div>
              <button
                onClick={() => refetch()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  borderRadius: 7,
                  border: `1px solid ${T.border}`,
                  background: T.bgCard,
                  color: T.textMuted,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Refresh
              </button>
            </div>

            {/* Animated section content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "grid", gap: 14 }}
              >
                {config?.widgets?.[section]?.map(widget => (
                  <DashboardWidget
                    key={widget.id}
                    widget={widget}
                    onAction={handleAction}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Rescue Detail Modal */}
        <DashboardModal
          isOpen={modal.open && modal.type === "rescue"}
          title={`Rescue Case ${modal.data?.id || ""}`}
          onClose={() => setModal({ open: false, type: null, data: null })}
        >
          {modal.data && (
            <RescueDetailContent
              data={modal.data}
              vp={vp}
              T={T}
              assignLoading={assignLoading}
              onAutoAssign={handleAutoAssign}
            />
          )}
        </DashboardModal>

      </DashboardErrorBoundary>
    </DashboardPage>
  );
}
