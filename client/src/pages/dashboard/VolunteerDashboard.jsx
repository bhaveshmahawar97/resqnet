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
  DashboardModal, DashboardErrorBoundary,
  SeverityBadge, DashboardSidebar, StatusBadge
} from "../../components/dashboard/DashboardShared";
import { useRescue } from "../../context/RescueContext";
import LoadingState from "../../components/system/LoadingState";
import ErrorState from "../../components/system/ErrorState";
import useDashboardData from "../../hooks/useDashboardData";
import DashboardWidget from "../../components/dashboard/DashboardWidget";

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function VolunteerDashboard() {
  const { T } = useT();
  const vp = useViewport();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: config, isLoading, error, refetch } = useDashboardData();
  const { acceptMission, updateMissionStatus } = useRescue();
  
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [reportText, setReportText] = useState("");

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
      case "accept_mission":
        setModal({ open: true, type: "accept", data: payload });
        break;
      case "report_mission":
        setModal({ open: true, type: "report", data: payload });
        break;
      case "update_mission":
        setModal({ open: true, type: "report", data: payload }); // Reusing report modal for now
        break;
      case "modal":
        if (payload?.payload === "report") setModal({ open: true, type: "report", data: null });
        break;
      default:
        console.log("Unhandled action:", actionType, payload);
    }
  };

  const handleAcceptMission = async (rescue) => {
    const result = await acceptMission(rescue._id || rescue.id);
    if (result.success) {
      setModal({ open: false, type: null, data: null });
      refetch();
    }
  };

  const submitReport = async () => {
    if (modal.data && reportText) {
      await updateMissionStatus(modal.data.id, "in_progress", reportText);
    }
    setReportText("");
    setModal({ open: false, type: null, data: null });
    refetch();
  };

  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        <div style={{ position: "relative" }}>
          <DashboardHeader role="volunteer" userName={user?.fullName || user?.name || user?.email || "Volunteer"} />
        </div>

        {config.stats && <DashboardStats stats={config.stats} />}

        <div className="rq-dashboard-content-grid">
          <div className="dashboard-sidebar-slot">
            <DashboardSidebar role="volunteer" activeSection={section} onSection={setSection} sections={config.sections} />
          </div>
          <div className="dashboard-main">
            {!vp.desktop && (
              <DashboardSectionTabs sections={config.sections} activeSection={section} onSection={setSection} />
            )}
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} style={{ display: "grid", gap: 16 }}>
                {config.widgets[section]?.map(widget => (
                  <DashboardWidget key={widget.id} widget={widget} onAction={handleAction} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Modals */}
        <DashboardModal isOpen={modal.open && modal.type === "accept"} title="Accept Mission" onClose={() => setModal({ open: false, type: null, data: null })}>
          {modal.data && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: "0.84rem", color: T.textSub, lineHeight: 1.6 }}>
                Accept mission <strong>{modal.data.id}</strong> — {modal.data.animal} in {modal.data.location}?
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <SeverityBadge level={modal.data.severity} />
                <span style={{ fontSize: "0.75rem", color: T.textMuted, alignSelf: "center" }}>AI Score: {modal.data.aiScore}/100</span>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <button
                  onClick={() => handleAcceptMission(modal.data)}
                  className="rq-btn rq-btn-primary"
                  style={{ flex: 1, padding: "10px" }}
                >
                  Accept Mission
                </button>
                <button
                  onClick={() => setModal({ open: false, type: null, data: null })}
                  className="rq-btn rq-btn-outline"
                  style={{ flex: 1, padding: "10px" }}
                >
                  Decline
                </button>
              </div>
            </div>
          )}
        </DashboardModal>

        <DashboardModal isOpen={modal.open && modal.type === "report"} title="Field Report" onClose={() => setModal({ open: false, type: null, data: null })}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: "0.78rem", color: T.textSub }}>
              Reporting for mission: <strong>{modal.data?.id} — {modal.data?.animal}</strong>
            </div>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Describe current situation, animal condition, actions taken, and any issues…"
              rows={5}
              className="rq-textarea"
              style={{ width: "100%", marginBottom: "12px" }}
            />
            <button
              onClick={submitReport}
              className="rq-btn rq-btn-primary"
              style={{ width: "100%", padding: "10px" }}
            >
              Submit Report
            </button>
          </div>
        </DashboardModal>

        <DashboardModal
          isOpen={modal.open && modal.type === "rescue"}
          title={`Mission ${modal.data?.id}`}
          onClose={() => setModal({ open: false, type: null, data: null })}
        >
          {modal.data && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <SeverityBadge level={modal.data.severity} />
                <StatusBadge status={modal.data.status} />
              </div>
              {modal.data.images && modal.data.images.length > 0 && (
                <div>
                  <img src={getImageUrl(modal.data.images[0]) || ""} alt="rescue" style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 10 }} />
                </div>
              )}
              {[["Animal", modal.data.animal], ["Location", modal.data.location], ["NGO", modal.data.assignedTo], ["Notes", modal.data.notes]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 90, fontSize: "0.74rem", color: T.textMuted, fontWeight: 600, flexShrink: 0 }}>{k}</div>
                  <div style={{ flex: 1, fontSize: "0.82rem", color: T.text, lineHeight: 1.4 }}>{v || "N/A"}</div>
                </div>
              ))}
            </div>
          )}
        </DashboardModal>

      </DashboardErrorBoundary>
    </DashboardPage>
  );
}
