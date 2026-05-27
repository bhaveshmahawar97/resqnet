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
import { AdminInsights } from "../../components/dashboard/admin/AdminShared";
import LoadingState from "../../components/system/LoadingState";
import ErrorState from "../../components/system/ErrorState";
import useDashboardData from "../../hooks/useDashboardData";
import DashboardWidget from "../../components/dashboard/DashboardWidget";

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

  if (isLoading) return <DashboardPage><LoadingState message="Loading dashboard..." minHeight="80vh" /></DashboardPage>;
  if (error) return <DashboardPage><ErrorState message="Failed to load dashboard data." minHeight="80vh" /></DashboardPage>;
  if (!config) return <DashboardPage><ErrorState message="Dashboard configuration missing." minHeight="80vh" /></DashboardPage>;

  const showToast = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  };

  const handleAutoAssign = async (rescueId) => {
    setAssignLoading(true);
    const result = await autoAssignNgo(rescueId);
    setAssignLoading(false);
    if (result.success) {
      showToast("Auto-assigned successfully");
      setModal(m => ({ ...m, data: result.data }));
      refetch();
    } else {
      showToast(result.message || "Failed to auto-assign");
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
      default:
        console.log("Unhandled action:", actionType, payload);
    }
  };

  const insights = [
    "Platform operation metrics refresh with live rescue counts.",
    config.stats ? `Active cases: ${config.stats.find(s => s.id === "active")?.value || 0} currently open.` : ""
  ].filter(Boolean);

  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        <div style={{ position: "relative" }}>
          <DashboardHeader
            role="admin"
            userName={user?.fullName || user?.name || user?.email || "Admin"}
          />
        </div>

        {toast && (
          <div style={{ padding: "10px 14px", borderRadius: 9, marginBottom: 14, background: T.accentPale, border: `1px solid ${T.accent}30`, fontSize: "0.76rem", fontWeight: 600, color: T.accent }}>
            {toast}
          </div>
        )}

        {config.stats && <DashboardStats stats={config.stats} />}
        <AdminInsights tips={insights} />

        <div className="rq-dashboard-content-grid">
          <div className="dashboard-sidebar-slot">
            <DashboardSidebar role="admin" activeSection={section} onSection={setSection} sections={config.sections} />
          </div>
          <div className="dashboard-main">
            {!vp.desktop && (
              <DashboardSectionTabs sections={config?.sections || []} activeSection={section} onSection={setSection} />
            )}
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} style={{ display: "grid", gap: 16 }}>
                {config?.widgets?.[section]?.map(widget => (
                  <DashboardWidget key={widget.id} widget={widget} onAction={handleAction} />
                ))}
              </motion.div>

            </AnimatePresence>
          </div>
        </div>

        {/* ── Modals ── */}
        <DashboardModal isOpen={modal.open && modal.type === "rescue"} title={`Rescue ${modal.data?.id}`} onClose={() => setModal({ open: false, type: null, data: null })}>
          {modal.data && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {modal.data.images && modal.data.images.length > 0 && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <img src={getImageUrl(modal.data.images[0]) || ""} alt="rescue" style={{ width: "100%", maxHeight: 340, objectFit: "cover", borderRadius: 10 }} />
                </div>
              )}
              {[["Animal", modal.data.animal], ["Location", modal.data.location], ["Status", modal.data.status], ["NGO", modal.data.assignedTo], ["Volunteer", modal.data.volunteer], ["AI Score", modal.data.aiScore]].map(([k, v]) => (
                <div key={k} style={{ background: T.bgAlt, borderRadius: 8, padding: "9px 11px" }}>
                  <div style={{ fontSize: "0.58rem", color: T.textMuted, textTransform: "uppercase" }}>{k}</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.text, marginTop: 2 }}>{v || "N/A"}</div>
                </div>
              ))}
              {modal.data.rejectedBy?.length > 0 && (
                <div style={{ gridColumn: "1 / -1", background: T.bgAlt, borderRadius: 8, padding: "9px 11px", borderLeft: `3px solid ${T.danger}` }}>
                  <div style={{ fontSize: "0.58rem", color: T.textMuted, textTransform: "uppercase" }}>Rejections</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.danger, marginTop: 2 }}>Rejected by {modal.data.rejectedBy.length} NGO(s)</div>
                </div>
              )}
              {["pending", "rejected"].includes(modal.data.status) && (
                <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    disabled={assignLoading}
                    onClick={() => handleAutoAssign(modal.data.id)}
                    style={{ flex: 1, padding: "10px", borderRadius: 8, background: T.accent, border: "none", color: T.textOnAccent, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    {assignLoading ? "Assigning..." : "Auto-Assign NGO"}
                  </button>
                </div>
              )}
            </div>
          )}
        </DashboardModal>

      </DashboardErrorBoundary>
    </DashboardPage>
  );
}
