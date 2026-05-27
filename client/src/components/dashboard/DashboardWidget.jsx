import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import { getImageUrl } from "../../utils/imageUrl";
import {
  DashboardQuickActions,
  DashboardTimeline,
  DashboardDonutChart,
  RescueCaseRow,
  Card,
  SectionLabel,
  SeverityBadge,
  StatusBadge,
} from "./DashboardShared";
import EmptyState from "../system/EmptyState";
import { SystemHealthPanel } from "./admin/AdminShared"; // Adjust import later if needed
import AdminNGOVerification from "./admin/AdminNGOVerification";
import RescueMap from "../maps/RescueMap";
import MissionMap from "../maps/MissionMap";

export default function DashboardWidget({ widget, onAction }) {
  const { T } = useT();
  const { id, type, data, title, emptyMessage, emptyIcon, emptyTitle } = widget;

  // Render a section label if title exists
  const wrapWithCard = (content, pad = true) => (
    <Card style={pad ? {} : { padding: 0, overflow: "hidden" }}>
      {title && <div style={{ padding: pad ? "0 0 10px" : "14px 16px", borderBottom: pad ? "none" : `1px solid ${T.border}` }}><SectionLabel>{title}</SectionLabel></div>}
      <div style={pad ? {} : { padding: "12px 14px" }}>
        {content}
      </div>
    </Card>
  );

  switch (type) {
    case "QuickActions":
      return (
        <div>
          {title && <SectionLabel>{title}</SectionLabel>}
          <DashboardQuickActions actions={data.map(a => ({ ...a, onClick: () => onAction(a.actionType || "navigate", a) }))} />
        </div>
      );

    case "EmptyState":
      return wrapWithCard(<EmptyState icon={emptyIcon || widget.icon} title={emptyTitle || widget.title} message={emptyMessage || widget.message} minHeight="150px" />);

    case "Timeline":
      return wrapWithCard(<DashboardTimeline events={data} />);

    case "RescueCard":
      return wrapWithCard(<RescueCaseRow rescue={data} onView={() => onAction("view_rescue", data)} />);

    case "RescueList":
      if (!data || data.length === 0) return wrapWithCard(<EmptyState icon={emptyIcon} title={emptyTitle || "No Rescues"} message={emptyMessage || "No rescues available right now."} minHeight="150px" />);
      return wrapWithCard(
        <div style={{ display: "flex", flexDirection: "column", overflowX: "auto" }}>
          {data.map(r => (
            <RescueCaseRow key={r.id} rescue={r} onView={() => onAction("view_rescue", r)} showAssign onAssign={(d) => onAction("assign_rescue", d)} />
          ))}
        </div>,
        false
      );

    case "DonutChart":
      return wrapWithCard(<DashboardDonutChart segments={data} size={100} />);

    case "StatsOverview":
      return wrapWithCard(
        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {Object.entries(data).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", color: T.textMuted, fontSize: "0.85rem" }}>
              <span>{k}</span><strong style={{ color: T.text }}>{v}</strong>
            </div>
          ))}
        </div>
      );

    case "SystemHealthPanel":
      return <SystemHealthPanel />;

    case "AdminNGOVerification":
      return <AdminNGOVerification />;

    case "RescueMap":
      if (!data) return wrapWithCard(<div style={{ padding: 20, color: T.textMuted }}>No rescue location available.</div>);
      if (Array.isArray(data)) return <MissionMap missions={data} />;
      return wrapWithCard(<RescueMap rescue={data} />, false);

    case "MissionCard":
      return <MissionCardWidget mission={data} onAction={onAction} T={T} />;

    case "MissionCardList":
      if (!data || data.length === 0) return wrapWithCard(<EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} minHeight="150px" />);
      return (
        <div style={{ display: "grid", gap: 16 }}>
          {data.map(m => <MissionCardWidget key={m.id} mission={m} onAction={onAction} T={T} />)}
        </div>
      );

    case "AvailableMissionList":
      if (!data || data.length === 0) return wrapWithCard(<EmptyState icon={emptyIcon || "🗺️"} title={emptyTitle || "No Missions"} message={emptyMessage || "No missions available in your area."} minHeight="150px" />);
      return wrapWithCard(
        <div style={{ display: "flex", flexDirection: "column", overflowX: "auto" }}>
          {data.map(m => <AvailableMissionRow key={m.id} rescue={m} T={T} onAccept={() => onAction("accept_mission", m)} />)}
        </div>,
        false
      );

    case "VolunteerList":
      if (!data || data.length === 0) return wrapWithCard(<EmptyState icon={emptyIcon || "👥"} title={emptyTitle || "No Volunteers"} message={emptyMessage || "No active volunteers right now."} minHeight="150px" />);
      return wrapWithCard(
        <div style={{ overflowX: "auto" }}>
          {data.map(vol => <VolunteerRow key={vol._id || vol.id} vol={vol} T={T} onView={() => onAction("view_volunteer", vol)} onAssign={() => onAction("assign_volunteer", vol)} />)}
        </div>,
        false
      );

    case "ApplicationList":
      if (!data || data.length === 0) return wrapWithCard(<EmptyState title={emptyTitle || "No Applications"} message={emptyMessage || "No adoption applications pending."} minHeight="150px" />);
      return wrapWithCard(
        <div style={{ overflowX: "auto" }}>
          {data.map(app => <AdoptionApplicationRow key={app._id || app.id} app={app} T={T} onAction={onAction} />)}
        </div>,
        false
      );

    case "AdoptionList":
      if (!data || data.length === 0) return wrapWithCard(<EmptyState title={emptyTitle || "No Adoptions"} message={emptyMessage || "No animals listed for adoption."} minHeight="150px" />);
      return wrapWithCard(
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {data.map(app => (
            <Card key={app._id || app.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 750, color: T.text }}>{app.adoption?.animalName || app.adoption?.animalType || "Animal"}</div>
                  <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 1 }}>{app.adoption?.location || "Unknown"}</div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            </Card>
          ))}
        </div>
      );

    default:
      return wrapWithCard(<div style={{ padding: 20, color: T.danger }}>Unknown widget type: {type}</div>);
  }
}

// ---- Sub Components ----

function MissionCardWidget({ mission, onAction, T }) {
  const safeTasks = Array.isArray(mission.tasks) ? mission.tasks : [];
  const completed = safeTasks.filter((t) => t.done).length;
  const total = safeTasks.length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  const scoreColor = mission.aiScore >= 70 ? "#DC2626" : mission.aiScore >= 40 ? "#D97706" : "#16A34A";

  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: "0.66rem", color: T.textMuted, fontFamily: "monospace" }}>{mission.id}</span>
            <SeverityBadge level={mission.severity} />
          </div>
          <div style={{ fontSize: "0.95rem", fontWeight: 750, color: T.text }}>{mission.animal}</div>
          <div style={{ fontSize: "0.71rem", color: T.textMuted, marginTop: 2 }}>{mission.location}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{mission.aiScore}</div>
          <div style={{ fontSize: "0.58rem", color: T.textMuted }}>AI SEVERITY</div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <div style={{ fontSize: "0.67rem", color: T.textMuted, fontWeight: 700, textTransform: "uppercase" }}>Mission Progress</div>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: T.accent }}>{progress}%</div>
        </div>
        <div style={{ height: 6, borderRadius: 6, background: T.bgAlt, overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} style={{ height: "100%", borderRadius: 6, background: T.accent }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onAction("report_mission", mission)} className="rq-btn rq-btn-outline" style={{ flex: 1, padding: "9px" }}>Field Report</button>
        <button onClick={() => onAction("update_mission", mission)} className="rq-btn rq-btn-primary" style={{ flex: 1, padding: "9px" }}>Update Status</button>
      </div>
    </Card>
  );
}

function AvailableMissionRow({ rescue, onAccept, T }) {
  return (
    <motion.div whileHover={{ background: T.bgCardHov }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: `1px solid ${T.border}`, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 160px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
          <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: T.textMuted }}>{rescue.id}</span>
          <SeverityBadge level={rescue.severity} />
        </div>
        <div style={{ fontSize: "0.82rem", fontWeight: 650, color: T.text }}>{rescue.animal}</div>
      </div>
      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: rescue.aiScore >= 70 ? "#DC2626" : "#D97706" }}>Score: {rescue.aiScore}</div>
      <button onClick={() => onAccept(rescue)} className="rq-btn rq-btn-primary rq-btn-sm">Accept Mission</button>
    </motion.div>
  );
}

function VolunteerRow({ vol, onAssign, onView, T }) {
  return (
    <div onClick={() => onView(vol)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: `1px solid ${T.border}`, cursor: "pointer", flexWrap: "wrap" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: T.accentPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: T.accent }}>
        {vol.fullName ? vol.fullName.charAt(0) : "V"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 650, color: T.text }}>{vol.fullName}</div>
        <div style={{ fontSize: "0.67rem", color: T.textMuted }}>{vol.city}</div>
      </div>
      <StatusBadge status={vol.availability || "active"} />
      <button onClick={(e) => { e.stopPropagation(); onAssign(vol); }} style={{ padding: "4px 10px", borderRadius: 6, background: T.accent, border: "none", color: T.textOnAccent, fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" }}>
        Assign
      </button>
    </div>
  );
}

function AdoptionApplicationRow({ app, onAction, T }) {
  const name = app.applicant?.fullName || app.applicant?.email || "Applicant";
  const animal = app.adoption?.animalName || app.adoption?.animalType || "Unknown";
  return (
    <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "0.86rem", fontWeight: 700, color: T.text }}>{animal}</div>
          <div style={{ fontSize: "0.78rem", color: T.textSub }}>{name}</div>
        </div>
        <StatusBadge status={app.status || "pending"} />
      </div>
      {["pending", "interview_scheduled"].includes(app.status) && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => onAction("approve_app", app.id)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: T.accent, color: T.textOnAccent, cursor: "pointer", fontWeight: 700, fontSize: "0.76rem" }}>Approve</button>
          <button onClick={() => onAction("reject_app", app.id)} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgAlt, color: T.text, cursor: "pointer", fontWeight: 700, fontSize: "0.76rem" }}>Reject</button>
        </div>
      )}
    </div>
  );
}
