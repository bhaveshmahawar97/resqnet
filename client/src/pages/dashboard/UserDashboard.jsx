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
  DashboardHeader, DashboardStats,
  DashboardModal, DashboardErrorBoundary, DashboardSidebar,
  SeverityBadge, StatusBadge, DashboardTimeline
} from "../../components/dashboard/DashboardShared";
import LoadingState from "../../components/system/LoadingState";
import ErrorState from "../../components/system/ErrorState";
import useDashboardData from "../../hooks/useDashboardData";
import DashboardWidget from "../../components/dashboard/DashboardWidget";
import AnalysisReportModal from "../../components/scanner/AnalysisReportModal";

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

  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        {/* Header */}
        <div style={{ position: "relative" }}>
          <DashboardHeader role="user" userName={user?.fullName || user?.name || user?.email || "Rescuer"} />
        </div>

        {/* Stats */}
        {config.stats && <DashboardStats stats={config.stats} />}

        {/* Layout: sidebar + content */}
        <div className="rq-dashboard-content-grid">
          <div className="dashboard-sidebar-slot">
            <DashboardSidebar role="user" activeSection={section} onSection={setSection} sections={config.sections} />
          </div>

          <div className="dashboard-main">
            {!vp.desktop && (
              <DashboardSectionTabs sections={config?.sections || []} activeSection={section} onSection={setSection} />
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "grid", gap: 16 }}
              >
                {config?.widgets?.[section]?.map(widget => (
                  <DashboardWidget key={widget.id} widget={widget} onAction={handleAction} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Modals */}
        <DashboardModal
          isOpen={modal.open && modal.type === "rescue"}
          title={`Rescue ${modal.data?.id}`}
          onClose={() => setModal({ open: false, type: null, data: null })}
        >
          {modal.data && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <SeverityBadge level={modal.data.severity} size="lg" />
                <StatusBadge status={modal.data.status} />
              </div>
              {modal.data.images && modal.data.images.length > 0 && (
                <div>
                  <img src={getImageUrl(modal.data.images[0]) || ""} alt="rescue" style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 10 }} />
                </div>
              )}
              {modal.data.status === 'pending' && (
                <div style={{ padding: 12, borderRadius: 8, background: `${T.warning}20`, border: `1px solid ${T.warning}40`, color: T.warning, fontSize: "0.85rem", fontWeight: 600, display: "flex", gap: 8, alignItems: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Wait until help arrives. Nearest NGO is being notified.
                </div>
              )}
              {modal.data.status === 'accepted' && modal.data.volunteer && (
                <div style={{ padding: 12, borderRadius: 8, background: `${T.success}20`, border: `1px solid ${T.success}40`, color: T.success, fontSize: "0.85rem", fontWeight: 600, display: "flex", gap: 8, alignItems: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Help is on the way! Volunteer {modal.data.volunteer} has been assigned.
                </div>
              )}
              {[
                ["Animal", modal.data.animal],
                ["Location", modal.data.location],
                ["AI Score", `${modal.data.aiScore}/100`],
                ["Assigned NGO", modal.data.assignedTo],
                ["Volunteer", modal.data.volunteer],
                ["Notes", modal.data.notes],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 90, fontSize: "0.75rem", color: T.textMuted, fontWeight: 600, flexShrink: 0, paddingTop: 1 }}>{k}</div>
                  <div style={{ flex: 1, fontSize: "0.82rem", color: T.text, letterSpacing: "-0.01em", lineHeight: 1.4 }}>{v || "N/A"}</div>
                </div>
              ))}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: T.textHeading, marginBottom: 12 }}>Rescue Timeline</div>
                <DashboardTimeline events={modal.data.rescueTimeline || []} />
              </div>
            </div>
          )}
        </DashboardModal>

        {modal.open && modal.type === "scan" && (
          <AnalysisReportModal scanData={modal.data} onClose={() => setModal({ open: false, type: null, data: null })} />
        )}

      </DashboardErrorBoundary>
    </DashboardPage>
  );
}
