/**
 * ResQNet — Volunteer Dashboard
 * Field rescue operations workspace: active missions, task checklist,
 * rescue timeline, NGO coordination, field reports.
 *
 * Route: /dashboard/volunteer
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useViewport from "../../hooks/useViewport";
import DashboardPage from "../../components/dashboard/DashboardPage";
import DashboardSectionTabs from "../../components/dashboard/DashboardSectionTabs";
import { getImageUrl } from "../../utils/imageUrl";
import MissionMap from "../../components/maps/MissionMap";
import {
  DashboardHeader, DashboardStats, DashboardActivityFeed,
  DashboardQuickActions, DashboardModal, DashboardTimeline,
  DashboardErrorBoundary, RescueCaseRow,
  SectionLabel, Card, SeverityBadge, DashboardSidebar,
} from "../../components/dashboard/DashboardShared";
import { useRescue } from "../../context/RescueContext";
import { timeAgo, buildActivityFromRescues } from "../../utils/operationalData";

// ─── MISSION CARD ─────────────────────────────────────────────────────────────
function MissionCard({ mission, onReport, T }) {
  const safeTasks = Array.isArray(mission.tasks) ? mission.tasks : [];
  const completed = safeTasks.filter((t) => t.done).length;
  const total = safeTasks.length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  const scoreColor = mission.aiScore >= 70 ? "#DC2626" : mission.aiScore >= 40 ? "#D97706" : "#16A34A";

  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: "0.66rem", color: T.textMuted, fontFamily: "monospace" }}>{mission.id}</span>
            <SeverityBadge level={mission.severity} />
          </div>
          <div style={{ fontSize: "0.95rem", fontWeight: 750, color: T.text, letterSpacing: "-0.03em" }}>{mission.animal}</div>
          <div style={{ fontSize: "0.71rem", color: T.textMuted, marginTop: 2 }}>📍 {mission.location}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 900, color: scoreColor, letterSpacing: "-0.05em", lineHeight: 1 }}>{mission.aiScore}</div>
          <div style={{ fontSize: "0.58rem", color: T.textMuted }}>AI SEVERITY</div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <div style={{ fontSize: "0.67rem", color: T.textMuted, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Mission Progress</div>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: T.accent }}>{progress}%</div>
        </div>
        <div style={{ height: 6, borderRadius: 6, background: T.bgAlt, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", borderRadius: 6, background: T.accent }}
          />
        </div>
        <div style={{ fontSize: "0.67rem", color: T.textMuted, marginTop: 3 }}>{completed} of {total} tasks complete</div>
      </div>

      {/* Tasks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {safeTasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "7px 10px", borderRadius: 8,
              border: `1px solid ${task.done ? `${T.accent}35` : T.border}`,
              background: task.done ? T.accentPale : "transparent",
              cursor: "default", fontFamily: "inherit", textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0,
              border: `2px solid ${task.done ? T.accent : T.border}`,
              background: task.done ? T.accent : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {task.done && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span style={{
              fontSize: "0.78rem", fontWeight: 500,
              color: task.done ? T.textMuted : T.text,
              textDecoration: task.done ? "line-through" : "none",
              letterSpacing: "-0.01em",
            }}>
              {task.label}
            </span>
          </div>
        ))}
      </div>

      {/* NGO info */}
      <div style={{
        padding: "9px 11px", borderRadius: 9,
        background: T.bgAlt, border: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: "0.66rem", color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>NGO Coordinator</div>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, color: T.text, marginTop: 1 }}>{mission.ngo}</div>
        </div>
        <a
          href={`tel:${mission.ngoContact}`}
          style={{
            padding: "5px 12px", borderRadius: 7,
            background: T.accent, color: "#fff",
            fontSize: "0.72rem", fontWeight: 700,
            textDecoration: "none", letterSpacing: "-0.01em",
          }}
        >
          Call
        </a>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onReport(mission)}
          className="rq-btn rq-btn-outline"
          style={{ flex: 1, padding: "9px" }}
        >
          Field Report
        </button>
        <button
          onClick={() => onReport(mission)}
          className="rq-btn rq-btn-primary"
          style={{ flex: 1, padding: "9px" }}
        >
          Update Status
        </button>
      </div>
    </Card>
  );
}

// ─── AVAILABLE MISSION ROW ────────────────────────────────────────────────────
function AvailableMissionRow({ rescue, onAccept, T }) {
  return (
    <motion.div
      whileHover={{ background: T.bgCardHov }}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "11px 14px", borderBottom: `1px solid ${T.border}`,
        flexWrap: "wrap", transition: "background 0.14s",
      }}
    >
      <div style={{ flex: "1 1 160px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
          <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: T.textMuted }}>{rescue.id}</span>
          <SeverityBadge level={rescue.severity} />
        </div>
        <div style={{ fontSize: "0.82rem", fontWeight: 650, color: T.text, letterSpacing: "-0.02em" }}>{rescue.animal}</div>
        <div style={{ fontSize: "0.68rem", color: T.textMuted, marginTop: 1 }}>📍 {rescue.location}</div>
      </div>
      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: rescue.aiScore >= 70 ? "#DC2626" : "#D97706", letterSpacing: "-0.02em" }}>
        Score: {rescue.aiScore}
      </div>
      <div style={{ fontSize: "0.71rem", color: T.textMuted }}>ETA: {rescue.eta || "TBD"}</div>
      <button
        onClick={() => onAccept(rescue)}
        className="rq-btn rq-btn-primary rq-btn-sm"
      >
        Accept Mission
      </button>
    </motion.div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function VolunteerDashboard() {
  const { T } = useT();
  const vp = useViewport();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { myRescues, assignedRescues, loading, error, updateRescueStatus, acceptMission } = useRescue();
  const missionList = assignedRescues.length > 0 ? assignedRescues : myRescues;
  const activityFeed = buildActivityFromRescues(missionList);
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [reportText, setReportText] = useState("");
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const missions = myRescues.filter((r) => r.status !== "completed" && r.status !== "cancelled");
  const pendingAssignments = myRescues.filter((r) => r.status === "pending");
  const completedCount = myRescues.filter((r) => r.status === "completed").length;

  const stats = [
    { label: "Active Missions", value: missions.length, icon: "🗺️", highlight: true, sub: "Assigned missions" },
    { label: "Completed", value: completedCount, icon: "✓", sub: "Finished missions", trend: "up" },
    { label: "Ready to Accept", value: pendingAssignments.length, icon: "🚑", sub: "Assigned but pending" },
    { label: "In Progress", value: myRescues.filter((r) => r.status === "in_progress").length, icon: "⏳", sub: "Field response" },
  ];

  const quickActions = [
    { icon: "🚨", label: "Emergency Alert", sub: "Report critical case", primary: true, danger: true, onClick: () => navigate("/rescue") },
    { icon: "📸", label: "AI Scan", sub: "Analyze on-site", onClick: () => navigate("/scanner") },
    { icon: "📋", label: "Field Report", sub: "Submit update", onClick: () => setModal({ open: true, type: "report", data: missions[0] || null }) },
    { icon: "🗺", label: "Find NGO", sub: "Nearby support", onClick: () => navigate("/ngos") },
  ];

  const missionTimeline = missions[0] && Array.isArray(missions[0].rescueTimeline)
    ? missions[0].rescueTimeline.map((event) => ({
      label: event.status,
      done: true,
      time: timeAgo(event.createdAt),
      type: event.status === "completed" ? "success" : event.status === "cancelled" ? "error" : "info",
    }))
    : [];

  const buildMissionTasks = (rescue) => [
    { id: "t1", label: "Report received", done: rescue.status !== "pending" },
    { id: "t2", label: "Assignment accepted", done: rescue.status === "accepted" || rescue.status === "in_progress" || rescue.status === "rescued" || rescue.status === "completed" },
    { id: "t3", label: "Field response", done: rescue.status === "in_progress" || rescue.status === "rescued" || rescue.status === "completed" },
    { id: "t4", label: "Rescue completed", done: rescue.status === "completed" },
  ];

  const handleAcceptMission = async (rescue) => {
    setStatusUpdateLoading(true);
    const result = await acceptMission(rescue._id || rescue.id);
    setStatusUpdateLoading(false);
    if (result.success) {
      setModal({ open: false, type: null, data: null });
    }
  };

  const submitReport = () => {
    setReportText("");
    setModal({ open: false, type: null, data: null });
  };

  const renderSection = () => {
    switch (section) {
      case "missions":
        return (
          <div>
            <SectionLabel>Active Missions</SectionLabel>
            {missions.length === 0
              ? <Card><div style={{ textAlign: "center", padding: "24px 0", fontSize: "0.84rem", color: T.textMuted }}>No active missions. Await new assignments from your NGO command channel.</div></Card>
              : <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {missions.map((m) => (
                  <MissionCard
                    key={m._id || m.id}
                    mission={{
                      ...m,
                      tasks: buildMissionTasks(m),
                      ngo: m.assignedNgo?.fullName || m.assignedNgo?.email || "Unassigned",
                      ngoContact: m.assignedNgo?.email || "N/A",
                      aiScore: m.aiScore ?? 74,
                    }}
                    
                    onReport={(d) => setModal({ open: true, type: "report", data: d })}
                    T={T}
                  />
                ))}
              </div>
            }
          </div>
        );

      case "tasks":
        return (
          <div>
            <SectionLabel>Assigned Cases Awaiting Acceptance</SectionLabel>
            <Card style={{ padding: "6px 0" }}>
              {pendingAssignments.map((r) => (
                <AvailableMissionRow key={r.id} rescue={r} T={T} onAccept={(d) => setModal({ open: true, type: "accept", data: d })} />
              ))}
              {pendingAssignments.length === 0 && <div style={{ textAlign: "center", padding: "20px", fontSize: "0.82rem", color: T.textMuted }}>No pending assignments right now.</div>}
            </Card>
          </div>
        );

      case "history":
        return (
          <div>
            <SectionLabel>Mission History</SectionLabel>
            <Card style={{ padding: "6px 0" }}>
              {myRescues.filter((r) => ["completed", "cancelled"].includes(r.status)).map((r) => (
                <RescueCaseRow key={r._id || r.id} rescue={r} onView={() => setModal({ open: true, type: "rescue", data: r })} />
              ))}
              {myRescues.filter((r) => ["completed", "cancelled"].includes(r.status)).length === 0 && (
                <div style={{ textAlign: "center", padding: "20px", fontSize: "0.82rem", color: T.textMuted }}>No completed or cancelled missions yet.</div>
              )}
            </Card>
          </div>
        );

      default:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <SectionLabel>Field Operations</SectionLabel>
              <DashboardQuickActions actions={quickActions} />
            </div>

            {missions.length > 0 && (
              <>
                <MissionMap missions={missions.slice(0, 3)} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  <MissionCard
                    mission={{
                      ...missions[0],
                      tasks: buildMissionTasks(missions[0]),
                      ngo: missions[0].assignedNgo?.fullName || missions[0].assignedNgo?.email || "Unassigned",
                      ngoContact: missions[0].assignedNgo?.email || "N/A",
                      aiScore: missions[0].aiScore ?? 74,
                    }}
                    onReport={(d) => setModal({ open: true, type: "report", data: d })}
                    T={T}
                  />
                  <Card>
                    <SectionLabel>Mission Timeline</SectionLabel>
                    <DashboardTimeline events={missionTimeline} />
                  </Card>
                </div>
              </>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              <Card style={{ padding: "6px 0" }}>
                <div style={{ padding: "0 14px 10px" }}><SectionLabel action="View all" onAction={() => setSection("tasks")}>Assigned Cases Awaiting Acceptance</SectionLabel></div>
                {pendingAssignments.slice(0, 2).map((r) => (
                  <AvailableMissionRow key={r.id} rescue={r} T={T} onAccept={(d) => setModal({ open: true, type: "accept", data: d })} />
                ))}
              </Card>
              <Card style={{ padding: "6px 0" }}>
                <div style={{ padding: "0 14px 10px" }}><SectionLabel>Activity</SectionLabel></div>
                <DashboardActivityFeed items={activityFeed} limit={4} />
              </Card>
            </div>
          </div>
        );
    }
  };

  const volunteerSections = [
    { id: "overview", label: "Overview" },
    { id: "missions", label: "Missions" },
    { id: "tasks", label: "Pending Assignments" },
    { id: "history", label: "History" },
  ];

  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        <div style={{ position: "relative" }}>
          <DashboardHeader role="volunteer" userName={user?.fullName || user?.name || user?.email || "Volunteer"} />
        </div>

        <DashboardStats stats={stats} />

        <div className="rq-dashboard-content-grid">
          <div className="dashboard-sidebar-slot">
            <DashboardSidebar role="volunteer" activeSection={section} onSection={setSection} />
          </div>
          <div className="dashboard-main">
            {!vp.desktop && (
              <DashboardSectionTabs sections={volunteerSections} activeSection={section} onSection={setSection} />
            )}
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      {/* Accept mission modal */}
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

      {/* Field report modal */}
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

      {/* Resolved rescue detail */}
      <DashboardModal
        isOpen={modal.open && modal.type === "rescue"}
        title={`Mission ${modal.data?.id}`}
        onClose={() => setModal({ open: false, type: null, data: null })}
      >
        {modal.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <SeverityBadge level={modal.data.severity} />
            </div>
            {modal.data.images && modal.data.images.length > 0 && (
              <div>
                <img src={getImageUrl(modal.data.images[0]) || ""} alt="rescue" style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 10 }} />
              </div>
            )}
            {[["Animal", modal.data.animal], ["Location", modal.data.location], ["NGO", modal.data.assignedTo], ["Notes", modal.data.notes]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 90, fontSize: "0.74rem", color: T.textMuted, fontWeight: 600, flexShrink: 0 }}>{k}</div>
                <div style={{ flex: 1, fontSize: "0.82rem", color: T.text, lineHeight: 1.4 }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </DashboardModal>
      </DashboardErrorBoundary>
    </DashboardPage>
  );
}
