/**
 * ResQNet — Admin Dashboard
 * Platform operations center. Route: /dashboard/admin (admin role only)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, BadgeCheck, Megaphone, FileBarChart, AlertTriangle, ListX,
} from "lucide-react";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { useAuth } from "../../context/AuthContext";
import DashboardPage from "../../components/dashboard/DashboardPage";
import DashboardSectionTabs from "../../components/dashboard/DashboardSectionTabs";
import { getImageUrl } from "../../utils/imageUrl";
import RescueMap from "../../components/maps/RescueMap";
import {
  DashboardHeader, DashboardStats, DashboardActivityFeed,
  DashboardModal, DashboardBarChart, DashboardDonutChart,
  DashboardErrorBoundary, RescueCaseRow, SectionLabel, Card, StatusBadge, DashboardSidebar,
} from "../../components/dashboard/DashboardShared";
import { useRescue } from "../../context/RescueContext";
import { useAdoption } from "../../context/AdoptionContext";
import {
  ActionBtn, EmergencyAlertCard, SystemHealthPanel, AdminInsights, SettingToggle,
} from "../../components/dashboard/admin/AdminShared";
import {
  ADMIN_PROFILE, ADMIN_SECTIONS,
} from "../../data/dashboardData";
import {
  buildActivityFromRescues,
  buildCriticalAlerts,
} from "../../utils/operationalData";

const QUICK_ICONS = {
  add_admin: UserPlus,
  verify_ngo: BadgeCheck,
  broadcast: Megaphone,
  report: FileBarChart,
  emergency: AlertTriangle,
  clear_queue: ListX,
};

function NGOVerificationCard({ ngo, onApprove, onReject, onView, T }) {
  return (
    <Card style={{ marginBottom: 10, borderLeft: "3px solid #D97706" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: T.text }}>{ngo.name}</div>
          <div style={{ fontSize: "0.7rem", color: T.textMuted, marginTop: 2 }}>{ngo.city}, {ngo.state}</div>
        </div>
        <StatusBadge status="pending" />
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 12 }}>
        <ActionBtn label="Approve" color="#16A34A" onClick={() => onApprove(ngo)} />
        <ActionBtn label="Reject" color="#DC2626" onClick={() => onReject(ngo)} outline />
        <ActionBtn label="View" color={T.accent} onClick={() => onView(ngo)} outline />
      </div>
    </Card>
  );
}

function UserRow({ user, onView, onSuspend, T }) {
  const statusColor = { active: "#16A34A", suspended: "#DC2626" };
  const color = statusColor[user.status] || T.textMuted;
  return (
    <motion.div
      whileHover={{ background: T.bgCardHov }}
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
        borderBottom: `1px solid ${T.border}`, flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "1 1 160px", minWidth: 0 }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.text }}>{user.name}</div>
        <div style={{ fontSize: "0.67rem", color: T.textMuted }}>{user.email}</div>
      </div>
      <span style={{ padding: "2px 8px", borderRadius: 20, background: `${color}15`, color, fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase" }}>
        {user.status}
      </span>
      <div style={{ display: "flex", gap: 6 }}>
        <ActionBtn label="View" color={T.accent} onClick={() => onView(user)} outline />
        {user.status === "active" && user.role !== "admin" && (
          <ActionBtn label="Suspend" color="#DC2626" onClick={() => onSuspend(user)} outline />
        )}
      </div>
    </motion.div>
  );
}

function AdminDashboard() {
  const { T } = useT();
  const vp = useViewport();
  const { user } = useAuth();
  const { rescues, criticalRescues, stats, loading, error, autoAssignNgo } = useRescue();
  const { stats: adoptionStats } = useAdoption();
  const activityFeed = buildActivityFromRescues(rescues);
  const [section, setSection] = useState("overview");
  const [alerts, setAlerts] = useState(() => buildCriticalAlerts(criticalRescues));
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [toast, setToast] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const unackedAlerts = alerts.filter((a) => !a.acknowledged).length;

  const statsArr = [
    { label: "Total Rescues", value: stats?.total || rescues.length, icon: "◉", sub: `${stats?.pending || 0} pending`, highlight: true, trend: "up" },
    { label: "Active Emergencies", value: (stats?.total || rescues.length) - (stats?.completed || 0), icon: "🚨", sub: `${stats?.critical || 0} critical`, trend: "up" },
    { label: "Completed", value: stats?.completed || 0, icon: "✅", sub: `${stats?.pending || 0} pending` },
    { label: "Critical Cases", value: stats?.critical || 0, icon: "🔥", sub: "Severity alerts" },
  ];

  const donutData = [
    { label: "Critical", value: stats?.bySeverity?.critical || 0, color: "#DC2626" },
    { label: "High", value: stats?.bySeverity?.high || 0, color: "#EA580C" },
    { label: "Medium", value: stats?.bySeverity?.medium || 0, color: "#D97706" },
    { label: "Low", value: stats?.bySeverity?.low || 0, color: "#16A34A" },
  ];

  const statusSegments = [
    { label: "Pending", value: stats?.byStatus?.pending || 0, color: "#9333EA" },
    { label: "Accepted", value: stats?.byStatus?.accepted || 0, color: "#2563EB" },
    { label: "In Progress", value: stats?.byStatus?.in_progress || 0, color: "#0EA5E9" },
    { label: "Rescued", value: stats?.byStatus?.rescued || 0, color: "#16A34A" },
    { label: "Completed", value: stats?.byStatus?.completed || 0, color: "#10B981" },
    { label: "Cancelled", value: stats?.byStatus?.cancelled || 0, color: "#EF4444" },
  ];

  const insights = [
    unackedAlerts > 0 && `${unackedAlerts} emergency alert${unackedAlerts > 1 ? "s" : ""} need acknowledgment.`,
    "Platform operation metrics refresh with live rescue counts.",
    `Active cases: ${((stats?.total || rescues.length) - (stats?.completed || 0))} currently open.`,
  ].filter(Boolean);

  const showToast = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  };

  const ackAlert = (id) => setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));

  const handleAutoAssign = async (rescueId) => {
    setAssignLoading(true);
    const result = await autoAssignNgo(rescueId);
    setAssignLoading(false);
    if (result.success) {
      showToast("Auto-assigned successfully");
      setModal(m => ({ ...m, data: result.data }));
    } else {
      showToast(result.message || "Failed to auto-assign");
    }
  };

  const handleQuickAction = (action) => {
    // Quick actions disabled in production build until API is ready
    showToast("Action temporarily disabled in live environment.");
  };

  const renderSection = () => {
    switch (section) {
      // NGO and Users sections removed as they require backend integration
      case "ngos":
      case "users":
        return (
          <div>
            <SectionLabel>Coming Soon</SectionLabel>
            <Card>
              <div style={{ padding: 20, color: T.textMuted, textAlign: "center" }}>
                This section is currently under development and will be connected to live data soon.
              </div>
            </Card>
          </div>
        );

      case "rescues":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <SectionLabel>Rescue Operations Map</SectionLabel>
              <div style={{ padding: "0 1rem 1rem" }}>
                {rescues.length > 0 ? <RescueMap rescue={rescues[0]} /> : <div style={{ padding: 20, color: T.textMuted }}>No rescue location available to display.</div>}
              </div>
            </Card>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <SectionLabel>Active Rescue Network</SectionLabel>
              {rescues.length === 0 && (
                <div style={{ padding: 20, color: T.textMuted, textAlign: "center" }}>No rescue operations found yet.</div>
              )}
              {rescues.map((r) => (
                <RescueCaseRow key={r._id || r.id} rescue={r} onView={() => setModal({ open: true, type: "rescue", data: r })} />
              ))}
            </Card>
          </div>
        );



      case "ai":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <SystemHealthPanel />
            <Card>
              <SectionLabel>AI Platform Metrics</SectionLabel>
              {[["Model Confidence", "92%"], ["Inference Uptime", "99.8%"], ["Avg Severity Score", "78"], ["Scans Today", "24"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: "0.75rem", color: T.textSub }}>{l}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: T.text }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        );

      case "analytics":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <Card><SectionLabel>Status Distribution</SectionLabel><DashboardDonutChart segments={statusSegments} size={110} /></Card>
            <Card><SectionLabel>Severity Distribution</SectionLabel><DashboardDonutChart segments={donutData} size={110} /></Card>
            <Card>
              <SectionLabel>Rescue Overview</SectionLabel>
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: T.textMuted }}><span>Total rescues</span><strong>{stats?.total || rescues.length}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: T.textMuted }}><span>Pending</span><strong>{stats?.pending || 0}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: T.textMuted }}><span>Completed</span><strong>{stats?.completed || 0}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: T.textMuted }}><span>Critical</span><strong>{stats?.critical || 0}</strong></div>
              </div>
            </Card>
            <Card>
              <SectionLabel>Adoption Overview</SectionLabel>
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: T.textMuted }}><span>Available Animals</span><strong>{adoptionStats?.available || 0}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: T.textMuted }}><span>Pending Review</span><strong>{adoptionStats?.pendingReview || 0}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: T.textMuted }}><span>Adopted</span><strong style={{ color: T.accent }}>{adoptionStats?.adopted || 0}</strong></div>
              </div>
            </Card>
          </div>
        );

      case "alerts":
        return (
          <div>
            <SectionLabel>{`System Alerts (${unackedAlerts} open)`}</SectionLabel>
            {alerts.map((a) => <EmergencyAlertCard key={a.id} alert={a} onAck={ackAlert} />)}
          </div>
        );

      case "settings":
        return (
          <Card style={{ maxWidth: 480 }}>
            <SectionLabel>Platform Settings</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SettingToggle label="Auto-approve low-risk NGOs" defaultOn />
              <SettingToggle label="AI emergency auto-escalation" defaultOn />
              <SettingToggle label="Volunteer SMS notifications" />
              <SettingToggle label="Weekly digest emails" defaultOn />
            </div>
          </Card>
        );

      default:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}><SectionLabel>Emergency Alerts</SectionLabel></div>
                <div style={{ padding: "12px 14px" }}>
                  {alerts.slice(0, 3).map((a) => <EmergencyAlertCard key={a.id} alert={a} onAck={ackAlert} />)}
                </div>
              </Card>
              <SystemHealthPanel />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
              <Card><SectionLabel>Rescue Status Breakdown</SectionLabel><DashboardDonutChart segments={statusSegments} size={100} /></Card>
              <Card><SectionLabel>Severity Distribution</SectionLabel><DashboardDonutChart segments={donutData} size={100} /></Card>
            </div>
            <Card style={{ padding: "6px 0" }}>
              <div style={{ padding: "0 14px 10px" }}><SectionLabel>Live Activity</SectionLabel></div>
              <DashboardActivityFeed items={activityFeed} limit={5} />
            </Card>
          </div>
        );
    }
  };

  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        <div style={{ position: "relative" }}>
          <DashboardHeader
            role="admin"
            userName={user?.fullName || user?.name || user?.email || ADMIN_PROFILE.name.split(" ")[0]}
          />
      </div>

      {toast && (
        <div style={{ padding: "10px 14px", borderRadius: 9, marginBottom: 14, background: T.accentPale, border: `1px solid ${T.accent}30`, fontSize: "0.76rem", fontWeight: 600, color: T.accent }}>
          {toast}
        </div>
      )}

      <DashboardStats stats={statsArr} />
      <AdminInsights tips={insights} />



      <div className="rq-dashboard-content-grid">
        <div className="dashboard-sidebar-slot">
          <DashboardSidebar role="admin" activeSection={section} onSection={setSection} />
        </div>
        <div className="dashboard-main">
          {!vp.desktop && (
            <DashboardSectionTabs sections={ADMIN_SECTIONS} activeSection={section} onSection={setSection} />
          )}
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <DashboardModal isOpen={modal.open && modal.type === "ngo"} title={modal.data?.name || "NGO"} onClose={() => setModal({ open: false, type: null, data: null })}>
        {modal.data && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["City", modal.data.city], ["Email", modal.data.email], ["Phone", modal.data.phone], ["Status", modal.data.status], ["Rescues", modal.data.activeRescues], ["Volunteers", modal.data.volunteers]].map(([k, v]) => (
              <div key={k} style={{ background: T.bgAlt, borderRadius: 8, padding: "9px 11px" }}>
                <div style={{ fontSize: "0.58rem", color: T.textMuted, textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.text, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </DashboardModal>

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
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.text, marginTop: 2 }}>{v}</div>
              </div>
            ))}
            {modal.data.rejectedBy?.length > 0 && (
              <div style={{ gridColumn: "1 / -1", background: T.bgAlt, borderRadius: 8, padding: "9px 11px", borderLeft: "3px solid #DC2626" }}>
                <div style={{ fontSize: "0.58rem", color: T.textMuted, textTransform: "uppercase" }}>Rejections</div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#DC2626", marginTop: 2 }}>Rejected by {modal.data.rejectedBy.length} NGO(s)</div>
              </div>
            )}
            {["pending", "rejected"].includes(modal.data.status) && (
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  disabled={assignLoading}
                  onClick={() => handleAutoAssign(modal.data.id)}
                  style={{ flex: 1, padding: "10px", borderRadius: 8, background: T.accent, border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                >
                  {assignLoading ? "Assigning..." : "Auto-Assign NGO"}
                </button>
              </div>
            )}
          </div>
        )}
      </DashboardModal>

      <DashboardModal isOpen={modal.open && modal.type === "user"} title={modal.data?.name || "User"} onClose={() => setModal({ open: false, type: null, data: null })}>
        {modal.data && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["Email", modal.data.email], ["Role", modal.data.role], ["City", modal.data.city], ["Status", modal.data.status], ["Rescues", modal.data.rescues], ["Scans", modal.data.scans]].map(([k, v]) => (
              <div key={k} style={{ background: T.bgAlt, borderRadius: 8, padding: "9px 11px" }}>
                <div style={{ fontSize: "0.58rem", color: T.textMuted, textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.text, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </DashboardModal>
    </DashboardErrorBoundary>
    </DashboardPage>
  );
}

export default AdminDashboard;
