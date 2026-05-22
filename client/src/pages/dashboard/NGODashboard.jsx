/**
 * ResQNet — NGO Dashboard
 * Operational rescue control center: active cases, emergency queue,
 * volunteer coordination, rescue status management, analytics.
 *
 * Route: /dashboard/ngo
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import DashboardPage from "../../components/dashboard/DashboardPage";
import DashboardSectionTabs from "../../components/dashboard/DashboardSectionTabs";
import { getImageUrl } from "../../utils/imageUrl";
import RescueMap from "../../components/maps/RescueMap";
import {
  DashboardHeader,
  DashboardStats,
  DashboardActivityFeed,
  DashboardQuickActions,
  DashboardModal,
  DashboardNotifications,
  DashboardDonutChart,
  DashboardErrorBoundary,
  RescueCaseRow,
  SectionLabel,
  Card,
  SeverityBadge,
  StatusBadge,
} from "../../components/dashboard/DashboardShared";
import { useRescue } from "../../context/RescueContext";
import { SEVERITY_COLOR } from "../../constants/ui";
import { fetchVolunteers } from "../../services/userService";
import {
  fetchNgoApplications,
  reviewApplication,
  createAdoptionListing,
} from "../../services/adoptionService";
import { uploadToCloudinary } from "../../services/aiService";
import {
  buildActivityFromRescues,
  buildCriticalAlerts,
  buildNotificationsFromRescues,
} from "../../utils/operationalData";
import { extractCityFromAddress } from "../../utils/geo";

const STATUS_ACTIONS = [
  { value: "accepted", label: "Accept" },
  { value: "in_progress", label: "In Progress" },
  { value: "rescued", label: "Rescued" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancel" },
];

function EmergencyAlertCard({ alert, onAck, T }) {
  const color = SEVERITY_COLOR[alert.type] || T.accent;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        padding: "12px 14px", borderRadius: 10,
        background: `${color}0E`, border: `1px solid ${color}35`,
        display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8,
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, marginTop: 5, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.79rem", fontWeight: 700, color: T.text, letterSpacing: "-0.02em", marginBottom: 2 }}>{alert.title}</div>
        <div style={{ fontSize: "0.72rem", color: T.textSub, lineHeight: 1.4 }}>{alert.body}</div>
        <div style={{ fontSize: "0.63rem", color: T.textMuted, marginTop: 4 }}>{alert.time}</div>
      </div>
      {!alert.acknowledged && (
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
          onClick={() => onAck(alert.id)}
          style={{
            padding: "4px 10px", borderRadius: 6,
            border: `1px solid ${color}50`, background: "transparent",
            color, fontSize: "0.68rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
          }}
        >
          Acknowledge
        </motion.button>
      )}
    </motion.div>
  );
}

function VolunteerRow({ vol, onAssign, onView, T }) {
  return (
    <motion.div
      whileHover={{ background: T.bgCardHov }}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "11px 14px", borderBottom: `1px solid ${T.border}`,
        cursor: "pointer", transition: "background 0.14s",
        flexWrap: "wrap",
      }}
      onClick={() => onView(vol)}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: T.accentPale, border: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.85rem", fontWeight: 800, color: T.accent,
      }}>
        {vol.name.charAt(0)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 650, color: T.text, letterSpacing: "-0.02em" }}>{vol.name}</div>
        <div style={{ fontSize: "0.67rem", color: T.textMuted, marginTop: 1 }}>{vol.city} · {vol.missionsCompleted} missions</div>
      </div>
      <StatusBadge status={vol.availability} />
      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.accent, letterSpacing: "-0.02em" }}>★ {vol.rating}</div>
      {vol.availability === "available" && (
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
          onClick={(e) => { e.stopPropagation(); onAssign(vol); }}
          style={{
            padding: "5px 12px", borderRadius: 7,
            background: T.accent, border: "none", color: "#fff",
            fontSize: "0.72rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Assign
        </motion.button>
      )}
    </motion.div>
  );
}

function StatusUpdateControls({ rescue, onUpdate, loading, userRole, T }) {
  const transitions = {
    pending: ["accepted", "cancelled"],
    accepted: ["in_progress", "cancelled"],
    in_progress: ["rescued", "cancelled"],
    rescued: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };
  const available = transitions[rescue.status] || [];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginTop: 18 }}>
      {available.length === 0 ? (
        <div style={{ color: T.textMuted, fontSize: "0.86rem" }}>No further status actions available for this rescue.</div>
      ) : (
        available.map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={() => onUpdate(status)}
            style={{
              padding: "10px 12px", borderRadius: 10,
              background: T.bgAlt, border: `1px solid ${T.border}`,
              cursor: loading ? "not-allowed" : "pointer",
              color: T.text, fontWeight: 700, fontFamily: "inherit",
            }}
          >
            {status.replace("_", " ")}
          </motion.button>
        ))
      )}
    </div>
  );
}

export default function NGODashboard() {
  const { T } = useT();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    rescues,
    criticalRescues,
    stats,
    loading,
    error,
    updateRescueStatus,
    assignVolunteer,
    acceptMission,
  } = useRescue();
  const [volunteerDirectory, setVolunteerDirectory] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [notifOpen, setNotifOpen] = useState(false);
  const activityFeed = buildActivityFromRescues(rescues);
  const [notifications, setNotifications] = useState(() => buildNotificationsFromRescues(rescues));
  const [alerts, setAlerts] = useState(() => buildCriticalAlerts(criticalRescues));
  const [statusLoading, setStatusLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState("");
  const [reviewLoading, setReviewLoading] = useState("");
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [createListingLoading, setCreateListingLoading] = useState(false);
  const [listingImagePreview, setListingImagePreview] = useState(null);
  const [listingFile, setListingFile] = useState(null);
  const [listingErrors, setListingErrors] = useState({});
  const [listingForm, setListingForm] = useState({
    animalName: "",
    animalType: "",
    age: "",
    condition: "",
    description: "",
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeRescues = rescues.filter((r) => r.status !== "completed" && r.status !== "cancelled");
  const pendingCount = rescues.filter((r) => r.status === "pending").length;
  const assignedCount = rescues.filter((r) => r.assignedNgo || r.assignedVolunteer).length;

  const assignedVolunteers = Array.from(
    new Map(
      rescues
        .filter((r) => r.assignedVolunteer)
        .map((rescue) => {
          const vol = rescue.assignedVolunteer;
          const key = vol?.id?.toString?.() || vol?.email || vol?.fullName || vol?.name || rescue.id;
          return [key, vol];
        })
    ).values()
  );

  const statsArr = [
    { label: "Active Rescues", value: activeRescues.length, icon: "🚑", sub: `${pendingCount} pending`, highlight: true },
    { label: "Critical Emergencies", value: criticalRescues.length, icon: "🔥", sub: "Live alerts" },
    { label: "Assigned Cases", value: assignedCount, icon: "👥", sub: "NGO-managed missions" },
    { label: "Total Rescues", value: stats?.total || rescues.length, icon: "📊", sub: `${stats?.completed || 0} completed` },
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

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const validateListingForm = () => {
    const errors = {};
    if (!listingForm.animalName.trim()) errors.animalName = "Enter the animal name";
    if (!listingForm.animalType.trim()) errors.animalType = "Enter the species";
    if (!listingForm.age.trim()) errors.age = "Enter the age";
    if (!listingForm.condition.trim()) errors.condition = "Describe the condition";
    if (!listingForm.description.trim()) errors.description = "Add a listing description";
    if (!listingFile) errors.image = "Upload one image";
    setListingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetListingForm = () => {
    setListingForm({ animalName: "", animalType: "", age: "", condition: "", description: "" });
    setListingFile(null);
    setListingImagePreview(null);
    setListingErrors({});
  };

  const handleListingImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setListingErrors((prev) => ({ ...prev, image: "Only PNG, JPG, JPEG, and WEBP files are allowed." }));
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setListingErrors((prev) => ({ ...prev, image: "Image must be smaller than 8MB." }));
      return;
    }

    setListingFile(file);
    setListingImagePreview(URL.createObjectURL(file));
    setListingErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleCreateListing = async () => {
    if (!validateListingForm()) return;
    setCreateListingLoading(true);

    try {
      const imageUrl = await uploadToCloudinary(listingFile);
      const payload = {
        animalName: listingForm.animalName.trim(),
        animalType: listingForm.animalType.trim(),
        description: listingForm.description.trim(),
        images: [imageUrl],
        metadata: {
          age: listingForm.age.trim(),
          condition: listingForm.condition.trim(),
        },
      };

      const result = await createAdoptionListing(payload);
      if (!result.success) {
        throw new Error(result.message || "Failed to create adoption listing");
      }

      showToast("Adoption listing created successfully");
      resetListingForm();
      setListingModalOpen(false);
      if (section === "adoptions") {
        loadApplications();
      }
    } catch (err) {
      showToast(err.message || "Unable to create listing");
    } finally {
      setCreateListingLoading(false);
    }
  };

  const loadApplications = async () => {
    setAppsError("");
    setAppsLoading(true);
    try {
      const result = await fetchNgoApplications();
      if (!result.success) {
        throw new Error(result.message || "Failed to load applications");
      }
      setApplications(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setAppsError(err.message || "Unable to load adoption applications");
      setApplications([]);
    } finally {
      setAppsLoading(false);
    }
  };

  const handleReviewApplication = async (applicationId, status) => {
    if (!applicationId) return;
    setReviewLoading(applicationId);
    try {
      const result = await reviewApplication(
        applicationId,
        status,
        `Reviewed by ${user?.fullName || user?.name || user?.email || "NGO"}`
      );
      if (result.success) {
        showToast(`Application ${status}`);
        await loadApplications();
      } else {
        throw new Error(result.message || "Unable to update application");
      }
    } catch (err) {
      showToast(err.message || "Unable to update application");
    } finally {
      setReviewLoading("");
    }
  };

  useEffect(() => {
    if (section === "adoptions") {
      loadApplications();
    }
  }, [section]);

  const ackAlert = (id) => setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));

  const loadVolunteers = async (rescue) => {
    const city = extractCityFromAddress(rescue?.address || rescue?.location || "");
    const result = await fetchVolunteers({ city });
    if (result.success) {
      setVolunteerDirectory(result.data.volunteers || []);
    } else {
      setVolunteerDirectory([]);
      showToast(result.message || "Could not load volunteers");
    }
  };

  const handleAssignVolunteerToRescue = async (volunteerId) => {
    if (!modal.data?.id && !modal.data?._id) return;
    setAssignLoading(true);
    const rescueId = modal.data._id || modal.data.id;
    const result = await assignVolunteer(rescueId, volunteerId);
    setAssignLoading(false);
    if (result.success) {
      setModal({ open: false, type: null, data: null });
      showToast("Volunteer assigned to mission");
    } else {
      showToast(result.message || "Assignment failed");
    }
  };

  const handleAcceptRescue = async () => {
    if (!modal.data) return;
    setAssignLoading(true);
    const rescueId = modal.data._id || modal.data.id;
    const result = await acceptMission(rescueId);
    setAssignLoading(false);
    if (result.success) {
      showToast("Mission accepted");
      setModal((m) => ({ ...m, data: result.data }));
    } else {
      showToast(result.message || "Could not accept mission");
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!modal.data) return;
    setStatusLoading(true);
    const rescueId = modal.data._id || modal.data.id;
    const result = await updateRescueStatus(rescueId, status, `Updated by ${user?.role}`);
    setStatusLoading(false);
    if (result.success) {
      setModal({ open: false, type: null, data: null });
      showToast(`Rescue ${status.replace("_", " ")} successfully`);
    } else {
      showToast(result.message || "Unable to update status");
    }
  };

  const quickActions = [
    { icon: "🚨", label: "Emergency Dispatch", sub: "Manual NGO dispatch", primary: true, danger: true, onClick: () => setModal({ open: true, type: "dispatch", data: null }) },
    { icon: "📸", label: "AI Scanner", sub: "Analyze animal", onClick: () => navigate("/scanner") },
    { icon: "🏠", label: "Create Listing", sub: "Add adoption-ready animal", onClick: () => setListingModalOpen(true) },
    { icon: "👤", label: "Assign Volunteer", sub: "To active case", onClick: () => setSection("volunteers") },
    { icon: "📊", label: "View Analytics", sub: "Operational metrics", onClick: () => setSection("analytics") },
  ];

  const renderSection = () => {
    switch (section) {
      case "rescues":
        return (
          <div>
            <SectionLabel action="Request rescue" onAction={() => navigate("/rescue")}>Active Rescue Queue</SectionLabel>
            {loading && <div style={{ padding: 16, color: T.textMuted }}>Loading rescues…</div>}
            {error && <div style={{ padding: 16, color: T.error }}>{error}</div>}
            <Card style={{ padding: "6px 0" }}>
              {rescues.length === 0 && !loading && <div style={{ padding: 16, color: T.textMuted }}>No active rescues.</div>}
              {rescues.map((r) => (
                <RescueCaseRow
                  key={r._id || r.id}
                  rescue={r}
                  onView={() => setModal({ open: true, type: "rescue", data: r })}
                  onAssign={(rescue) => {
                    setModal({ open: true, type: "assign", data: rescue });
                    loadVolunteers(rescue);
                  }}
                  showAssign={r.status === "pending" || !r.assignedVolunteer}
                />
              ))}
            </Card>
          </div>
        );

      case "volunteers":
        return (
          <div>
            <SectionLabel>Volunteer Coordination</SectionLabel>
            <Card style={{ padding: "6px 0" }}>
              {assignedVolunteers.length === 0 ? (
                <div style={{ padding: 16, color: T.textMuted }}>
                  No volunteers have been assigned yet. Create or open a rescue case to assign field responders.
                </div>
              ) : (
                assignedVolunteers.map((vol) => (
                  <VolunteerRow
                    key={vol?.id || vol?.email || vol?.fullName}
                    vol={{
                      ...vol,
                      name: vol.fullName || vol.name || vol.email || "Volunteer",
                      city: vol.city || "Unknown",
                      missionsCompleted: vol.missionsCompleted ?? 0,
                      rating: vol.rating ?? 0,
                      availability: vol.availability || "active",
                    }}
                    T={T}
                    onView={(d) => setModal({ open: true, type: "volunteer", data: d })}
                    onAssign={(d) => setModal({ open: true, type: "assign_vol", data: d })}
                  />
                ))
              )}
            </Card>
          </div>
        );

      case "adoptions":
        return (
          <div>
            <SectionLabel action="Create listing" onAction={() => setListingModalOpen(true)}>Adoption Review</SectionLabel>
            <Card style={{ padding: "6px 0" }}>
              {appsLoading && <div style={{ padding: 16, color: T.textMuted }}>Loading adoption applications…</div>}
              {appsError && !appsLoading && <div style={{ padding: 16, color: T.error }}>{appsError}</div>}
              {!appsLoading && !appsError && applications.length === 0 && (
                <div style={{ padding: 16, color: T.textMuted }}>
                  No adoption applications are pending review at the moment.
                </div>
              )}
              {!appsLoading && !appsError && applications.map((app) => {
                const applicantName = app.applicant?.fullName || app.applicant?.email || "Applicant";
                const applicantContact = app.applicant?.phone || app.applicant?.email || "No contact";
                const animalName = app.adoption?.animalName || app.adoption?.animalType || "Unknown animal";
                const animalLocation = app.adoption?.location || "Unknown location";
                const submittedAt = app.createdAt ? new Date(app.createdAt).toLocaleString() : "";
                const isWorking = reviewLoading === (app._id || app.id);
                return (
                  <div key={app._id || app.id} style={{ padding: 18, borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: "0.92rem", fontWeight: 700, color: T.text }}>{animalName}</div>
                        <div style={{ fontSize: "0.76rem", color: T.textMuted, marginTop: 4 }}>{animalLocation}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <StatusBadge status={app.status || "pending"} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: "0.72rem", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Applicant</div>
                          <div style={{ fontSize: "0.86rem", fontWeight: 700, color: T.text }}>{applicantName}</div>
                          <div style={{ fontSize: "0.75rem", color: T.textMuted, marginTop: 2 }}>{applicantContact}</div>
                        </div>
                        <div style={{ textAlign: "right", color: T.textMuted, fontSize: "0.72rem" }}>{submittedAt}</div>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: T.text, lineHeight: 1.5 }}>
                        {app.message || "No additional application details provided."}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() => handleReviewApplication(app._id || app.id, "approved")}
                        style={{
                          padding: "10px 14px", borderRadius: 10,
                          border: "1px solid transparent", background: T.accent,
                          color: "#fff", cursor: isWorking ? "not-allowed" : "pointer",
                          fontWeight: 700, fontFamily: "inherit",
                        }}
                      >
                        {isWorking ? "Processing…" : "Approve"}
                      </button>
                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() => handleReviewApplication(app._id || app.id, "rejected")}
                        style={{
                          padding: "10px 14px", borderRadius: 10,
                          border: `1px solid ${T.border}`, background: T.bgAlt,
                          color: T.text, cursor: isWorking ? "not-allowed" : "pointer",
                          fontWeight: 700, fontFamily: "inherit",
                        }}
                      >
                        {isWorking ? "Processing…" : "Reject"}
                      </button>
                    </div>
                  </div>
                );
              })}
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
          </div>
        );

      default:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {alerts.filter((a) => !a.acknowledged).length > 0 && (
              <div>
                <SectionLabel>Emergency Alerts</SectionLabel>
                {alerts.map((a) => <EmergencyAlertCard key={a.id} alert={a} onAck={ackAlert} T={T} />)}
              </div>
            )}
            <div>
              <SectionLabel>Operations</SectionLabel>
              <DashboardQuickActions actions={quickActions} />
            </div>
            {criticalRescues.length > 0 && (
              <Card>
                <SectionLabel>Critical Emergencies</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {criticalRescues.slice(0, 3).map((r) => (
                    <RescueCaseRow key={r.id} rescue={r} onView={() => setModal({ open: true, type: "rescue", data: r })} />
                  ))}
                </div>
              </Card>
            )}
            {activeRescues.length > 0 && (
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <SectionLabel>Rescue Operations Map</SectionLabel>
                <div style={{ padding: "0 1rem 1rem" }}>
                  <RescueMap rescue={activeRescues[0]} />
                </div>
              </Card>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              <Card style={{ padding: "6px 0" }}>
                <div style={{ padding: "0 14px 10px" }}><SectionLabel action="View all" onAction={() => setSection("rescues")}>Active Rescues</SectionLabel></div>
                {activeRescues.slice(0, 3).map((r) => (
                  <RescueCaseRow key={r._id || r.id} rescue={r} onView={() => setModal({ open: true, type: "rescue", data: r })} showAssign onAssign={(d) => setModal({ open: true, type: "assign", data: d })} />
                ))}
              </Card>
              <Card>
                <SectionLabel>Severity Distribution</SectionLabel>
                <DashboardDonutChart segments={donutData} size={100} />
              </Card>
            </div>
            <Card style={{ padding: "6px 0" }}>
              <div style={{ padding: "0 14px 10px" }}><SectionLabel>Activity Log</SectionLabel></div>
              <DashboardActivityFeed items={activityFeed} limit={4} />
            </Card>
          </div>
        );
    }
  };

  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        <div style={{ position: "relative" }}>
          <DashboardHeader role="ngo" userName={user?.fullName || user?.name || user?.email || "NGO"} onNotifClick={() => setNotifOpen((p) => !p)} notifCount={unreadCount} />
          <AnimatePresence>
          {notifOpen && (
            <div style={{ position: "absolute", top: 0, right: 0, zIndex: 200 }}>
              <DashboardNotifications items={notifications} onClose={() => setNotifOpen(false)} onMarkAll={() => setNotifications((p) => p.map((n) => ({ ...n, read: true })))} />
            </div>
          )}
        </AnimatePresence>
      </div>

      <DashboardStats stats={statsArr} />

      <div className="dashboard-layout">
        <DashboardSectionTabs sections={[
          { id: "overview", label: "Overview" },
          { id: "rescues", label: "Active Rescues" },
          { id: "volunteers", label: "Volunteers" },
          { id: "adoptions", label: "Adoption Queue" },
          { id: "analytics", label: "Analytics" },
        ]} activeSection={section} onSection={setSection} />

        <div style={{ flex: 1 }}>
          {renderSection()}
        </div>
      </div>

      <DashboardModal isOpen={modal.open && modal.type === "rescue"} title={`Rescue ${modal.data?._id || modal.data?.id}`} onClose={() => setModal({ open: false, type: null, data: null })}>
        {modal.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <SeverityBadge level={modal.data.severity} size="lg" />
              <StatusBadge status={modal.data.status} />
            </div>
            {/* Image preview */}
            {modal.data.images && modal.data.images.length > 0 && (
              <div>
                <img
                  src={getImageUrl(modal.data.images[0]) || ""}
                  alt="rescue"
                  style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 10 }}
                />
              </div>
            )}
            {[
              ["Animal", modal.data.animalType || modal.data.animal || modal.data.condition],
              ["Condition", modal.data.condition],
              ["Location", modal.data.address || modal.data.location],
              ["Status", modal.data.status],
              ["NGO", modal.data.assignedNgo?.fullName || modal.data.assignedNgo?.email || "Unassigned"],
              ["Volunteer", modal.data.assignedVolunteer?.fullName || modal.data.assignedVolunteer?.email || "Unassigned"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 90, fontSize: "0.75rem", color: T.textMuted, fontWeight: 600, flexShrink: 0, paddingTop: 1 }}>{k}</div>
                <div style={{ flex: 1, fontSize: "0.82rem", color: T.text, letterSpacing: "-0.01em", lineHeight: 1.4 }}>{v}</div>
              </div>
            ))}
            {user?.role && ["ngo", "admin"].includes(user.role) && (
              <StatusUpdateControls rescue={modal.data} onUpdate={handleUpdateStatus} loading={statusLoading} userRole={user.role} T={T} />
            )}
          </div>
        )}
      </DashboardModal>

      <DashboardModal isOpen={modal.open && modal.type === "assign"} title="Assign Volunteer" onClose={() => setModal({ open: false, type: null, data: null })}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {modal.data && volunteerDirectory.map((vol) => (
            <motion.button key={vol.id} type="button" disabled={assignLoading} onClick={() => handleAssignVolunteerToRescue(vol.id)}
              style={{ padding: "10px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgAlt, textAlign: "left", cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
              <div style={{ fontWeight: 700, color: T.text }}>{vol.name}</div>
              <div style={{ fontSize: "0.75rem", color: T.textMuted }}>{vol.city} · {vol.availability}</div>
            </motion.button>
          ))}
          {modal.data?.status === "pending" && (
            <motion.button type="button" disabled={assignLoading} onClick={handleAcceptRescue}
              style={{ padding: "10px", borderRadius: 8, background: T.accent, border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {assignLoading ? "Working…" : "Accept mission as NGO"}
            </motion.button>
          )}
        </div>
      </DashboardModal>

      <DashboardModal isOpen={listingModalOpen} title="Create Adoption Listing" onClose={() => { setListingModalOpen(false); resetListingForm(); }}>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: T.textMuted }}>Animal Name</label>
            <input
              value={listingForm.animalName}
              onChange={(e) => setListingForm((p) => ({ ...p, animalName: e.target.value }))}
              disabled={createListingLoading}
              placeholder="e.g. Luna"
              style={{
                width: "100%", padding: "0.85rem 1rem", borderRadius: 10,
                border: `1px solid ${listingErrors.animalName ? "#EF4444" : T.border}`,
                background: T.bgCard, color: T.text, fontFamily: "inherit",
              }}
            />
            {listingErrors.animalName && <div style={{ color: "#EF4444", fontSize: "0.75rem" }}>{listingErrors.animalName}</div>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: T.textMuted }}>Species</label>
              <input
                value={listingForm.animalType}
                onChange={(e) => setListingForm((p) => ({ ...p, animalType: e.target.value }))}
                disabled={createListingLoading}
                placeholder="Dog, Cat, etc."
                style={{
                  width: "100%", padding: "0.85rem 1rem", borderRadius: 10,
                  border: `1px solid ${listingErrors.animalType ? "#EF4444" : T.border}`,
                  background: T.bgCard, color: T.text, fontFamily: "inherit",
                }}
              />
              {listingErrors.animalType && <div style={{ color: "#EF4444", fontSize: "0.75rem" }}>{listingErrors.animalType}</div>}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: T.textMuted }}>Age</label>
              <input
                value={listingForm.age}
                onChange={(e) => setListingForm((p) => ({ ...p, age: e.target.value }))}
                disabled={createListingLoading}
                placeholder="e.g. 2 years"
                style={{
                  width: "100%", padding: "0.85rem 1rem", borderRadius: 10,
                  border: `1px solid ${listingErrors.age ? "#EF4444" : T.border}`,
                  background: T.bgCard, color: T.text, fontFamily: "inherit",
                }}
              />
              {listingErrors.age && <div style={{ color: "#EF4444", fontSize: "0.75rem" }}>{listingErrors.age}</div>}
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: T.textMuted }}>Condition</label>
            <input
              value={listingForm.condition}
              onChange={(e) => setListingForm((p) => ({ ...p, condition: e.target.value }))}
              disabled={createListingLoading}
              placeholder="Describe the animal's condition"
              style={{
                width: "100%", padding: "0.85rem 1rem", borderRadius: 10,
                border: `1px solid ${listingErrors.condition ? "#EF4444" : T.border}`,
                background: T.bgCard, color: T.text, fontFamily: "inherit",
              }}
            />
            {listingErrors.condition && <div style={{ color: "#EF4444", fontSize: "0.75rem" }}>{listingErrors.condition}</div>}
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: T.textMuted }}>Description</label>
            <textarea
              value={listingForm.description}
              onChange={(e) => setListingForm((p) => ({ ...p, description: e.target.value }))}
              disabled={createListingLoading}
              placeholder="Add background or care notes for the adopters"
              rows={5}
              style={{
                width: "100%", padding: "0.95rem 1rem", borderRadius: 10,
                border: `1px solid ${listingErrors.description ? "#EF4444" : T.border}`,
                background: T.bgCard, color: T.text, fontFamily: "inherit",
                minHeight: 128, resize: "vertical",
              }}
            />
            {listingErrors.description && <div style={{ color: "#EF4444", fontSize: "0.75rem" }}>{listingErrors.description}</div>}
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: T.textMuted }}>Image</label>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <label
                htmlFor="listing-image"
                style={{
                  padding: "10px 16px", borderRadius: 10,
                  border: `1px solid ${listingErrors.image ? "#EF4444" : T.border}`,
                  background: T.bgAlt, color: T.text, cursor: createListingLoading ? "not-allowed" : "pointer", fontWeight: 700,
                }}
              >
                {listingFile ? "Change image" : "Upload image"}
              </label>
              <span style={{ color: T.textMuted, fontSize: "0.78rem" }}>
                PNG, JPG, JPEG, WEBP
              </span>
            </div>
            <input
              id="listing-image"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleListingImageChange}
              disabled={createListingLoading}
              style={{ display: "none" }}
            />
            {listingErrors.image && <div style={{ color: "#EF4444", fontSize: "0.75rem" }}>{listingErrors.image}</div>}
            {listingImagePreview && (
              <div style={{ width: "100%", maxWidth: 320, borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}` }}>
                <img src={listingImagePreview} alt="Preview" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              disabled={createListingLoading}
              onClick={() => { setListingModalOpen(false); resetListingForm(); }}
              style={{ padding: "10px 16px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.bgAlt, color: T.text, cursor: createListingLoading ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 700 }}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={createListingLoading}
              onClick={handleCreateListing}
              style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: T.accent, color: "#fff", cursor: createListingLoading ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 700 }}
            >
              {createListingLoading ? "Creating…" : "Create Listing"}
            </button>
          </div>
        </div>
      </DashboardModal>
      </DashboardErrorBoundary>
    </DashboardPage>
  );
}
