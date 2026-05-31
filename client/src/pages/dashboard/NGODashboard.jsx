import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import DashboardPage from "../../components/dashboard/DashboardPage";
import DashboardSectionTabs from "../../components/dashboard/DashboardSectionTabs";
import { getImageUrl } from "../../utils/imageUrl";
import {
  DashboardHeader, DashboardStats,
  DashboardModal, DashboardErrorBoundary,
  SeverityBadge, StatusBadge, DashboardSidebar,
} from "../../components/dashboard/DashboardShared";
import { useRescue } from "../../context/RescueContext";
import { fetchVolunteers } from "../../services/userService";
import { reviewApplication } from "../../services/adoptionService";
import { extractCityFromAddress } from "../../utils/geo";
import LoadingState from "../../components/system/LoadingState";
import ErrorState from "../../components/system/ErrorState";
import useDashboardData from "../../hooks/useDashboardData";
import DashboardWidget from "../../components/dashboard/DashboardWidget";
import useViewport from "../../hooks/useViewport";
import CreateListingModal from "../../components/ngo/CreateListingModal";

// ── Inline helpers ────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function severityOrder(s) {
  const map = { critical: 0, high: 1, medium: 2, moderate: 3, low: 4 };
  return map[(s || "").toLowerCase()] ?? 5;
}

// ── Sub-panels ────────────────────────────────────────────────────────────────

function PanelHeader({ children, action, onAction, T }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 16px 10px",
      borderBottom: `1px solid ${T.border}`,
    }}>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {children}
      </span>
      {action && (
        <button onClick={onAction} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.72rem", color: T.accent, fontWeight: 700, fontFamily: "inherit" }}>
          {action}
        </button>
      )}
    </div>
  );
}

function PriorityInbox({ rescues, onViewRescue, onAssignRescue, T }) {
  const sorted = [...(rescues || [])].sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity));

  if (!sorted.length) {
    return (
      <div style={{ padding: "28px 16px", textAlign: "center", color: T.textMuted, fontSize: "0.82rem" }}>
        No active rescue requests
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      {sorted.map((r, i) => {
        const sev = (r.severity || "").toLowerCase();
        const dotColor = sev === "critical" ? T.danger : sev === "high" ? T.warning : T.info;
        return (
          <motion.div
            key={r._id || r.id || i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 16px",
              borderBottom: i < sorted.length - 1 ? `1px solid ${T.border}` : "none",
              flexWrap: "wrap",
            }}
          >
            {/* Severity dot */}
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: dotColor, flexShrink: 0,
              boxShadow: `0 0 0 3px ${dotColor}22`,
            }} />

            {/* Animal + location */}
            <div style={{ flex: "1 1 140px", minWidth: 0 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {r.animalType || r.animal || "Unknown animal"}
              </div>
              <div style={{ fontSize: "0.68rem", color: T.textMuted, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {r.address || r.location || "Location unknown"}
              </div>
            </div>

            {/* Badges */}
            <SeverityBadge level={r.severity} />
            <StatusBadge status={r.status} />

            {/* Time */}
            <span style={{ fontSize: "0.67rem", color: T.textMuted, flexShrink: 0, minWidth: 46, textAlign: "right" }}>
              {timeAgo(r.createdAt || r.reportedAt)}
            </span>

            {/* Actions */}
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => onViewRescue(r)}
                style={{
                  padding: "5px 10px", borderRadius: 7,
                  border: `1px solid ${T.border}`, background: T.bgAlt,
                  color: T.text, fontSize: "0.7rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                View
              </button>
              <button
                onClick={() => onAssignRescue(r)}
                style={{
                  padding: "5px 10px", borderRadius: 7,
                  border: "none", background: T.accent,
                  color: T.textOnAccent, fontSize: "0.7rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Assign Volunteer
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function VolunteerRoster({ volunteers, onAssign, onView, T }) {
  if (!volunteers || !volunteers.length) {
    return (
      <div style={{ padding: "28px 16px", textAlign: "center", color: T.textMuted, fontSize: "0.82rem" }}>
        No volunteers found
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {["Volunteer", "Skills", "Status", ""].map((h) => (
              <th key={h} style={{
                padding: "8px 14px", textAlign: "left",
                fontSize: "0.65rem", fontWeight: 700, color: T.textMuted,
                letterSpacing: "0.07em", textTransform: "uppercase",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {volunteers.map((vol, i) => (
            <motion.tr
              key={vol._id || vol.id || i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              style={{ borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}
              onClick={() => onView(vol)}
            >
              <td style={{ padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: T.accentPale,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.78rem", fontWeight: 800, color: T.accent, flexShrink: 0,
                  }}>
                    {(vol.fullName || vol.name || "V").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: T.text }}>{vol.fullName || vol.name || "Volunteer"}</div>
                    <div style={{ fontSize: "0.65rem", color: T.textMuted }}>{vol.city || ""}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: "10px 14px" }}>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {(vol.skills || []).slice(0, 3).map((sk, si) => (
                    <span key={si} style={{
                      fontSize: "0.62rem", padding: "2px 6px", borderRadius: 4,
                      background: T.bgAlt, border: `1px solid ${T.border}`,
                      color: T.textSub, fontWeight: 600,
                    }}>{sk}</span>
                  ))}
                  {!vol.skills?.length && <span style={{ color: T.textMuted, fontSize: "0.7rem" }}>—</span>}
                </div>
              </td>
              <td style={{ padding: "10px 14px" }}>
                <StatusBadge status={vol.availability || "active"} />
              </td>
              <td style={{ padding: "10px 14px" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); onAssign(vol); }}
                  style={{
                    padding: "5px 10px", borderRadius: 7,
                    border: "none", background: T.accent,
                    color: T.textOnAccent, fontSize: "0.7rem", fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Assign
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdoptionQueue({ applications, onAction, T }) {
  if (!applications || !applications.length) {
    return (
      <div style={{ padding: "28px 16px", textAlign: "center", color: T.textMuted, fontSize: "0.82rem" }}>
        No applications pending
      </div>
    );
  }

  return (
    <div>
      {applications.map((app, i) => {
        const name = app.applicant?.fullName || app.applicant?.email || "Applicant";
        const animal = app.adoption?.animalName || app.adoption?.animalType || "Unknown animal";
        const canReview = ["pending", "interview_scheduled"].includes(app.status);
        return (
          <motion.div
            key={app._id || app.id || i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{
              padding: "12px 16px",
              borderBottom: i < applications.length - 1 ? `1px solid ${T.border}` : "none",
              display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: T.text }}>{animal}</div>
              <div style={{ fontSize: "0.7rem", color: T.textMuted, marginTop: 1 }}>{name}</div>
            </div>
            <StatusBadge status={app.status || "pending"} />
            {canReview && (
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => onAction("approve_app", app._id || app.id)}
                  style={{
                    padding: "5px 12px", borderRadius: 7,
                    border: "none", background: T.success,
                    color: "#fff", fontSize: "0.7rem", fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => onAction("reject_app", app._id || app.id)}
                  style={{
                    padding: "5px 12px", borderRadius: 7,
                    border: `1px solid ${T.dangerBorder}`,
                    background: T.dangerPale, color: T.danger,
                    fontSize: "0.7rem", fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function OpsCard({ children, style = {} }) {
  const { T } = useT();
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: 14, overflow: "hidden",
      boxShadow: T.shadowCard, ...style,
    }}>
      {children}
    </div>
  );
}

// ── Verification gate ─────────────────────────────────────────────────────────

function VerificationView({ ngoProfile, T, navigate }) {
  const states = {
    __missing__: {
      icon: null,
      color: T.accent,
      title: "Complete Your Registration",
      body: "Welcome to ResQNet! To access the operational dashboard and start receiving rescue alerts, you need to complete your NGO profile.",
      cta: { label: "Complete NGO Profile", path: "/ngo-register" },
    },
    pending: {
      iconPath: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
      color: T.accent,
      title: "Application Submitted",
      body: (name) => `Your application for ${name} has been received. Our team will begin reviewing your documents shortly.`,
    },
    under_review: {
      iconPath: <><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>,
      color: T.info,
      title: "Under Review",
      body: (name) => `An admin is currently reviewing your registration documents for ${name}. You will be notified of the decision soon.`,
    },
    rejected: {
      iconPath: <><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></>,
      color: T.danger,
      title: "Application Rejected",
      body: (name) => `Unfortunately, your application for ${name} was not approved.`,
      cta: { label: "Submit New Application", path: "/ngo-register" },
    },
    suspended: {
      iconPath: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
      color: T.warning,
      title: "Account Suspended",
      body: (name) => `Your operational access for ${name} has been suspended. Please contact support.`,
    },
  };

  const key = !ngoProfile ? "__missing__" : (ngoProfile.verificationStatus || "pending");
  const cfg = states[key] || states.__missing__;
  const body = typeof cfg.body === "function" ? cfg.body(ngoProfile?.organizationName || "your organization") : cfg.body;

  return (
    <div style={{ maxWidth: 560, margin: "3rem auto", textAlign: "center", padding: "0 16px" }}>
      {cfg.iconPath && (
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: `${cfg.color}14`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem", color: cfg.color,
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {cfg.iconPath}
          </svg>
        </div>
      )}
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: T.text, marginBottom: "0.75rem" }}>{cfg.title}</h2>
      <p style={{ color: T.textSub, lineHeight: 1.6, marginBottom: "1.5rem", fontSize: "0.9rem" }}>{body}</p>
      {cfg.cta && (
        <button onClick={() => navigate(cfg.cta.path)} className="rq-btn rq-btn-primary">
          {cfg.cta.label}
        </button>
      )}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function NGODashboard() {
  const { T } = useT();
  const vp = useViewport();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: config, isLoading, error, refetch } = useDashboardData();
  const { updateRescueStatus, assignVolunteer, acceptMission, rejectMission } = useRescue();

  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const { addToast } = useToast();

  const [volunteerDirectory, setVolunteerDirectory] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [listingInitialData, setListingInitialData] = useState(null);
  const [statusNote, setStatusNote] = useState("");

  if (isLoading) return <DashboardPage><LoadingState message="Loading command center..." minHeight="80vh" /></DashboardPage>;
  if (error) return <DashboardPage><ErrorState message="Failed to load dashboard data." minHeight="80vh" /></DashboardPage>;
  if (!config) return <DashboardPage><ErrorState message="Dashboard configuration missing." minHeight="80vh" /></DashboardPage>;

  const showToast = (message) => addToast(message);

  // ── Verification gate ────────────────────────────────────────────────────────
  if (config.requiresVerification) {
    return (
      <DashboardPage>
        <DashboardHeader role="ngo" userName={user?.fullName || user?.name || user?.email || "NGO"} />
        <VerificationView ngoProfile={config.profile} T={T} navigate={navigate} />
      </DashboardPage>
    );
  }

  // ── Data extraction ──────────────────────────────────────────────────────────
  const profile = config.profile || {};
  const orgName = profile.organizationName || user?.fullName || user?.name || "Your Organization";
  const isVerified = profile.verificationStatus === "verified";

  // Pull live rescue/volunteer/application data from widget payloads
  const allWidgets = Object.values(config.widgets || {}).flat();
  const rescueWidget = allWidgets.find((w) => w.type === "RescueList");
  const volunteerWidget = allWidgets.find((w) => w.type === "VolunteerList");
  const appWidget = allWidgets.find((w) => w.type === "ApplicationList");

  const activeRescues = rescueWidget?.data || [];
  const rosterVolunteers = volunteerWidget?.data || [];
  const adoptionApps = appWidget?.data || [];

  const NAV_SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "rescues", label: "Active Rescues" },
    { id: "volunteers", label: "Volunteers" },
    { id: "adoptions", label: "Adoption Queue" },
    { id: "analytics", label: "Analytics" },
  ];

  // ── Actions ──────────────────────────────────────────────────────────────────
  const loadVolunteers = async (rescue) => {
    const city = extractCityFromAddress(rescue?.address || rescue?.location || "");
    const result = await fetchVolunteers({ city });
    if (result.success) setVolunteerDirectory(result.data.volunteers || []);
    else { setVolunteerDirectory([]); showToast(result.message || "Could not load volunteers"); }
  };

  const handleAction = async (actionType, payload) => {
    switch (actionType) {
      case "navigate":
        if (payload?.path) navigate(payload.path);
        break;
      case "section":
        if (payload?.payload) setSection(payload.payload);
        break;
      case "modal":
        if (payload?.payload === "listing") setListingModalOpen(true);
        break;
      case "view_rescue":
        setModal({ open: true, type: "rescue", data: payload });
        setStatusNote("");
        break;
      case "assign_rescue":
        setModal({ open: true, type: "assign", data: payload });
        loadVolunteers(payload);
        break;
      case "view_volunteer":
        setModal({ open: true, type: "volunteer", data: payload });
        break;
      case "assign_volunteer":
        handleAssignVolunteerToRescue(payload.id || payload._id);
        break;
      case "approve_app":
        await handleReviewApplication(payload, "approved");
        break;
      case "reject_app":
        await handleReviewApplication(payload, "rejected");
        break;
      default:
        console.log("Unhandled action:", actionType, payload);
    }
  };

  const handleAssignVolunteerToRescue = async (volunteerId) => {
    if (!modal.data?.id && !modal.data?._id) return;
    setAssignLoading(true);
    const result = await assignVolunteer(modal.data._id || modal.data.id, volunteerId);
    setAssignLoading(false);
    if (result.success) {
      setModal({ open: false, type: null, data: null });
      showToast("Volunteer assigned");
      refetch();
    } else showToast(result.message || "Assignment failed");
  };

  const handleAcceptRescue = async () => {
    if (!modal.data) return;
    setAssignLoading(true);
    const result = await acceptMission(modal.data._id || modal.data.id);
    setAssignLoading(false);
    if (result.success) { showToast("Mission accepted"); setModal((m) => ({ ...m, data: result.data })); refetch(); }
    else showToast(result.message || "Could not accept");
  };

  const handleRejectRescue = async () => {
    if (!modal.data) return;
    setAssignLoading(true);
    const result = await rejectMission(modal.data._id || modal.data.id);
    setAssignLoading(false);
    if (result.success) { showToast("Mission rejected"); setModal({ open: false, type: null, data: null }); refetch(); }
    else showToast(result.message || "Could not reject");
  };

  const handleUpdateStatus = async (status) => {
    if (!modal.data) return;
    setStatusLoading(true);
    const result = await updateRescueStatus(
      modal.data._id || modal.data.id,
      status,
      statusNote || `Updated by ${user?.role}`
    );
    setStatusLoading(false);
    if (result.success) {
      setModal({ open: false, type: null, data: null });
      setStatusNote("");
      showToast(`Rescue ${status.replace("_", " ")}`);
      refetch();
    } else showToast(result.message || "Unable to update");
  };

  const handleReviewApplication = async (applicationId, status) => {
    if (!applicationId) return;
    try {
      const result = await reviewApplication(
        applicationId,
        status,
        `Reviewed by ${user?.fullName || user?.name || user?.email || "NGO"}`
      );
      if (result.success) { showToast(`Application ${status}`); refetch(); }
      else throw new Error(result.message || "Unable to update");
    } catch (err) { showToast(err.message || "Unable to update"); }
  };

  const handleListingSuccess = () => {
    showToast("Listing created successfully");
    setListingModalOpen(false);
    refetch();
  };

  // ── Overview panels ─────────────────────────────────────────────────────────
  const renderOverview = () => (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Priority Inbox */}
      <OpsCard>
        <PanelHeader action="View all" onAction={() => setSection("rescues")} T={T}>
          Priority Inbox
          {activeRescues.filter((r) => ["critical", "high"].includes((r.severity || "").toLowerCase())).length > 0 && (
            <span style={{
              marginLeft: 8, padding: "1px 7px", borderRadius: 10,
              background: T.dangerPale, color: T.danger,
              fontSize: "0.62rem", fontWeight: 700,
            }}>
              {activeRescues.filter((r) => ["critical", "high"].includes((r.severity || "").toLowerCase())).length} urgent
            </span>
          )}
        </PanelHeader>
        <PriorityInbox
          rescues={activeRescues.slice(0, 5)}
          onViewRescue={(r) => handleAction("view_rescue", r)}
          onAssignRescue={(r) => handleAction("assign_rescue", r)}
          T={T}
        />
      </OpsCard>

      {/* Bottom row: volunteers + adoptions */}
      <div style={{ display: "grid", gridTemplateColumns: vp.desktop ? "1fr 1fr" : "1fr", gap: 16 }}>
        <OpsCard>
          <PanelHeader action="Full roster" onAction={() => setSection("volunteers")} T={T}>
            Volunteer Roster
          </PanelHeader>
          <VolunteerRoster
            volunteers={rosterVolunteers.slice(0, 4)}
            onAssign={(vol) => handleAction("view_volunteer", vol)}
            onView={(vol) => handleAction("view_volunteer", vol)}
            T={T}
          />
        </OpsCard>
        <OpsCard>
          <PanelHeader action="Full queue" onAction={() => setSection("adoptions")} T={T}>
            Adoption Queue
          </PanelHeader>
          <AdoptionQueue
            applications={adoptionApps.slice(0, 4)}
            onAction={handleAction}
            T={T}
          />
        </OpsCard>
      </div>
    </div>
  );

  // ── Section renderer ─────────────────────────────────────────────────────────
  const renderSection = () => {
    switch (section) {
      case "overview":
        return renderOverview();

      case "rescues":
        return (
          <OpsCard>
            <PanelHeader T={T}>All Active Rescues ({activeRescues.length})</PanelHeader>
            <PriorityInbox
              rescues={activeRescues}
              onViewRescue={(r) => handleAction("view_rescue", r)}
              onAssignRescue={(r) => handleAction("assign_rescue", r)}
              T={T}
            />
          </OpsCard>
        );

      case "volunteers":
        return (
          <OpsCard>
            <PanelHeader T={T}>Volunteer Roster ({rosterVolunteers.length})</PanelHeader>
            <VolunteerRoster
              volunteers={rosterVolunteers}
              onAssign={(vol) => handleAction("view_volunteer", vol)}
              onView={(vol) => handleAction("view_volunteer", vol)}
              T={T}
            />
          </OpsCard>
        );

      case "adoptions":
        return (
          <OpsCard>
            <PanelHeader T={T}>Adoption Queue ({adoptionApps.length})</PanelHeader>
            <AdoptionQueue applications={adoptionApps} onAction={handleAction} T={T} />
          </OpsCard>
        );

      default: {
        // Fall back to widget-driven view for analytics / other sections
        const sectionWidgets = config?.widgets?.[section] || [];
        if (!sectionWidgets.length) {
          return (
            <div style={{ padding: "40px 0", textAlign: "center", color: T.textMuted, fontSize: "0.85rem" }}>
              No content for this section.
            </div>
          );
        }
        return (
          <div style={{ display: "grid", gap: 16 }}>
            {sectionWidgets.map((widget) => (
              <DashboardWidget key={widget.id} widget={widget} onAction={handleAction} />
            ))}
          </div>
        );
      }
    }
  };

  // ── Custom header (org name + verification badge + Create Listing) ────────────
  const renderCommandHeader = () => (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      flexWrap: "wrap", gap: 12,
      padding: "0 0 20px",
    }}>
      {/* Left: identity */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{
            fontSize: "0.62rem", fontWeight: 700, color: T.success,
            background: T.successPale, border: `1px solid ${T.successBorder}`,
            borderRadius: 6, padding: "2px 8px", letterSpacing: "0.07em", textTransform: "uppercase",
          }}>
            NGO Command Center
          </div>
          {isVerified && (
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: "0.62rem", fontWeight: 700, color: T.success,
              background: T.successPale, border: `1px solid ${T.successBorder}`,
              borderRadius: 6, padding: "2px 8px",
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Verified
            </div>
          )}
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 800, color: T.textHeading || T.text, letterSpacing: "-0.03em" }}>
          {orgName}
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: T.textSub }}>
          Manage rescue operations, volunteers, and adoption listings
        </p>
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        <button
          onClick={() => navigate("/rescue")}
          style={{
            padding: "8px 14px", borderRadius: 9,
            border: `1px solid ${T.border}`, background: T.bgAlt,
            color: T.text, fontSize: "0.78rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          New Rescue
        </button>
        <button
          onClick={() => { setListingInitialData(null); setListingModalOpen(true); }}
          style={{
            padding: "8px 16px", borderRadius: 9,
            border: "none", background: T.accent,
            color: T.textOnAccent, fontSize: "0.78rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Listing
        </button>
      </div>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        {/* Command header */}
        {renderCommandHeader()}

        {/* Stats row */}
        {config.stats && <DashboardStats stats={config.stats} />}

        {/* Layout: sidebar + main */}
        <div className="rq-dashboard-content-grid" style={{ marginTop: 20 }}>
          {/* Sidebar — desktop only */}
          {vp.desktop && (
            <div className="dashboard-sidebar-slot">
              <DashboardSidebar
                role="ngo"
                activeSection={section}
                onSection={setSection}
                sections={NAV_SECTIONS}
              />
            </div>
          )}

          {/* Main content */}
          <div className="dashboard-main">
            {/* Mobile tabs */}
            {!vp.desktop && (
              <DashboardSectionTabs
                sections={NAV_SECTIONS}
                activeSection={section}
                onSection={setSection}
              />
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Rescue Detail Modal ── */}
        <DashboardModal
          isOpen={modal.open && modal.type === "rescue"}
          title={`Rescue ${modal.data?.id || modal.data?._id || ""}`}
          onClose={() => setModal({ open: false, type: null, data: null })}
        >
          {modal.data && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <SeverityBadge level={modal.data.severity} size="lg" />
                <StatusBadge status={modal.data.status} />
              </div>
              {modal.data.images?.length > 0 && (
                <img
                  src={getImageUrl(modal.data.images[0]) || ""}
                  alt="rescue"
                  style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 10 }}
                />
              )}
              {[
                ["Animal", modal.data.animalType || modal.data.animal || modal.data.condition],
                ["Location", modal.data.address || modal.data.location],
                ["Volunteer", modal.data.assignedVolunteer?.fullName || modal.data.assignedVolunteer?.email || "Unassigned"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 80, fontSize: "0.7rem", color: T.textMuted, fontWeight: 600, flexShrink: 0, paddingTop: 1 }}>{k}</div>
                  <div style={{ flex: 1, fontSize: "0.82rem", color: T.text, lineHeight: 1.5 }}>{v || "N/A"}</div>
                </div>
              ))}

              <div style={{ marginTop: 6 }}>
                <input
                  type="text"
                  placeholder="Optional note for status update..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px", borderRadius: 8,
                    border: `1px solid ${T.border}`, background: T.bgAlt,
                    color: T.text, fontSize: "0.82rem", fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 2 }}>
                {["accepted", "in_progress", "rescued", "completed", "cancelled"]
                  .filter((s) => s !== modal.data.status)
                  .map((status) => (
                    <button
                      key={status}
                      disabled={statusLoading}
                      onClick={() => handleUpdateStatus(status)}
                      style={{
                        padding: "7px 12px", borderRadius: 8,
                        background: T.bgAlt, border: `1px solid ${T.border}`,
                        cursor: statusLoading ? "not-allowed" : "pointer",
                        color: T.text, fontWeight: 700, fontSize: "0.75rem",
                        fontFamily: "inherit",
                      }}
                    >
                      {status.replace(/_/g, " ")}
                    </button>
                  ))}
              </div>

              {modal.data.status === "completed" && (
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={() => {
                      setListingInitialData({
                        sourceRescue: modal.data._id || modal.data.id,
                        animalType: modal.data.animalType || modal.data.animal || "",
                        condition: modal.data.condition || "",
                        description: `Rescue from ${modal.data.address || modal.data.location}`,
                      });
                      setModal({ open: false, type: null, data: null });
                      setListingModalOpen(true);
                    }}
                    className="rq-btn rq-btn-primary"
                    style={{ width: "100%" }}
                  >
                    List for Adoption
                  </button>
                </div>
              )}
            </div>
          )}
        </DashboardModal>

        {/* ── Assign Volunteer Modal ── */}
        <DashboardModal
          isOpen={modal.open && modal.type === "assign"}
          title={modal.data?.status === "assigned" ? "Mission Assignment" : "Assign Volunteer"}
          onClose={() => setModal({ open: false, type: null, data: null })}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {modal.data && ["accepted", "volunteer_assigned"].includes(modal.data.status) &&
              volunteerDirectory.map((vol) => (
                <button
                  key={vol.id || vol._id}
                  type="button"
                  disabled={assignLoading}
                  onClick={() => handleAssignVolunteerToRescue(vol.id || vol._id)}
                  style={{
                    padding: "9px 12px", borderRadius: 8,
                    border: `1px solid ${T.border}`, background: T.bgAlt,
                    textAlign: "left", cursor: assignLoading ? "not-allowed" : "pointer",
                    width: "100%", fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontWeight: 700, color: T.text, fontSize: "0.82rem" }}>
                    {vol.fullName || vol.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: T.textMuted }}>{vol.city}</div>
                </button>
              ))}
            {modal.data?.status === "assigned" && (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  disabled={assignLoading}
                  onClick={handleAcceptRescue}
                  className="rq-btn rq-btn-primary"
                  style={{ flex: 1 }}
                >
                  {assignLoading ? "Working..." : "Accept Mission"}
                </button>
                <button
                  type="button"
                  disabled={assignLoading}
                  onClick={handleRejectRescue}
                  className="rq-btn rq-btn-outline"
                  style={{ flex: 1 }}
                >
                  {assignLoading ? "Working..." : "Reject Mission"}
                </button>
              </div>
            )}
          </div>
        </DashboardModal>

        {/* ── Volunteer Detail Modal ── */}
        <DashboardModal
          isOpen={modal.open && modal.type === "volunteer"}
          title="Volunteer Details"
          onClose={() => setModal({ open: false, type: null, data: null })}
        >
          {modal.data && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: T.accentPale,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem", fontWeight: 800, color: T.accent, flexShrink: 0,
                }}>
                  {(modal.data.fullName || modal.data.name || "V").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: T.text, fontSize: "1rem" }}>
                    {modal.data.fullName || modal.data.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: T.textMuted }}>
                    {modal.data.city} {modal.data.email ? `· ${modal.data.email}` : ""}
                  </div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <StatusBadge status={modal.data.availability || "active"} />
                </div>
              </div>

              {modal.data.skills?.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>
                    Skills
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {modal.data.skills.map((sk, i) => (
                      <span key={i} style={{
                        fontSize: "0.72rem", padding: "3px 8px", borderRadius: 6,
                        background: T.accentPale, color: T.accent,
                        border: `1px solid ${T.accentGlow || T.border}`,
                        fontWeight: 600,
                      }}>{sk}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DashboardModal>

        {/* ── Create Listing Modal ── */}
        <CreateListingModal
          isOpen={listingModalOpen}
          onClose={() => setListingModalOpen(false)}
          initialData={listingInitialData}
          onSuccess={handleListingSuccess}
        />
      </DashboardErrorBoundary>
    </DashboardPage>
  );
}
