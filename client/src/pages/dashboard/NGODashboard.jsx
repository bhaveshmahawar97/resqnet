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
import {
  DashboardHeader,
  DashboardStats,
  DashboardActivityFeed,
  DashboardQuickActions,
  DashboardModal,
  DashboardDonutChart,
  DashboardErrorBoundary,
  RescueCaseRow,
  SectionLabel,
  Card,
  SeverityBadge,
  StatusBadge,
  DashboardSidebar,
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
} from "../../utils/operationalData";
import { extractCityFromAddress } from "../../utils/geo";

/* ─── Inline Sub-components ─── */

function VolunteerRow({ vol, onAssign, onView, T }) {
  return (
    <div
      onClick={() => onView(vol)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 14px", borderBottom: `1px solid ${T.border}`,
        cursor: "pointer", transition: "background 0.14s",
        flexWrap: "wrap",
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: T.accentPale, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.8rem", fontWeight: 800, color: T.accent,
      }}>
        {vol.name.charAt(0)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 650, color: T.text }}>{vol.name}</div>
        <div style={{ fontSize: "0.67rem", color: T.textMuted }}>{vol.city} · {vol.missionsCompleted} missions</div>
      </div>
      <StatusBadge status={vol.availability} />
      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: T.accent }}>★ {vol.rating}</div>
      {vol.availability === "available" && (
        <button
          onClick={(e) => { e.stopPropagation(); onAssign(vol); }}
          style={{
            padding: "4px 10px", borderRadius: 6,
            background: T.accent, border: "none", color: "#fff",
            fontSize: "0.7rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Assign
        </button>
      )}
    </div>
  );
}

function StatusUpdateControls({ rescue, onUpdate, loading, T }) {
  const transitions = {
    pending: ["accepted", "cancelled"],
    accepted: ["in_progress", "cancelled"],
    in_progress: ["rescued", "cancelled"],
    rescued: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };
  const available = transitions[rescue.status] || [];
  if (available.length === 0) {
    return <div style={{ color: T.textMuted, fontSize: "0.82rem", marginTop: 12 }}>No further status actions.</div>;
  }
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
      {available.map((status) => (
        <button
          key={status}
          disabled={loading}
          onClick={() => onUpdate(status)}
          style={{
            padding: "8px 14px", borderRadius: 8,
            background: T.bgAlt, border: `1px solid ${T.border}`,
            cursor: loading ? "not-allowed" : "pointer",
            color: T.text, fontWeight: 700, fontFamily: "inherit", fontSize: "0.78rem",
          }}
        >
          {status.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}

/* ─── Main Component ─── */

export default function NGODashboard() {
  const { T } = useT();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    rescues, criticalRescues, stats, loading, error,
    updateRescueStatus, assignVolunteer, acceptMission,
  } = useRescue();

  const [volunteerDirectory, setVolunteerDirectory] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const activityFeed = buildActivityFromRescues(rescues);
  const [statusLoading, setStatusLoading] = useState(false);
  const [toast, setToast] = useState("");

  // Adoption state
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
    animalName: "", animalType: "", age: "", condition: "", description: "",
  });

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
    { label: "Critical", value: criticalRescues.length, icon: "🔥", sub: "Live alerts" },
    { label: "Assigned", value: assignedCount, icon: "👥", sub: "NGO-managed" },
    { label: "Total", value: stats?.total || rescues.length, icon: "📊", sub: `${stats?.completed || 0} completed` },
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

  // ── Listing form helpers ──
  const validateListingForm = () => {
    const errs = {};
    if (!listingForm.animalName.trim()) errs.animalName = "Enter name";
    if (!listingForm.animalType.trim()) errs.animalType = "Enter species";
    if (!listingForm.age.trim()) errs.age = "Enter age";
    if (!listingForm.condition.trim()) errs.condition = "Describe condition";
    if (!listingForm.description.trim()) errs.description = "Add description";
    if (!listingFile) errs.image = "Upload image";
    setListingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetListingForm = () => {
    setListingForm({ animalName: "", animalType: "", age: "", condition: "", description: "" });
    setListingFile(null); setListingImagePreview(null); setListingErrors({});
  };

  const handleListingImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) { setListingErrors((p) => ({ ...p, image: "PNG, JPG, WEBP only." })); return; }
    if (file.size > 8 * 1024 * 1024) { setListingErrors((p) => ({ ...p, image: "Max 8MB." })); return; }
    setListingFile(file);
    setListingImagePreview(URL.createObjectURL(file));
    setListingErrors((p) => ({ ...p, image: undefined }));
  };

  const handleCreateListing = async () => {
    if (!validateListingForm()) return;
    setCreateListingLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(listingFile);
      const result = await createAdoptionListing({
        animalName: listingForm.animalName.trim(), animalType: listingForm.animalType.trim(),
        description: listingForm.description.trim(), images: [imageUrl],
        metadata: { age: listingForm.age.trim(), condition: listingForm.condition.trim() },
      });
      if (!result.success) throw new Error(result.message || "Failed");
      showToast("Listing created"); resetListingForm(); setListingModalOpen(false);
      if (section === "adoptions") loadApplications();
    } catch (err) { showToast(err.message || "Unable to create listing"); }
    finally { setCreateListingLoading(false); }
  };

  // ── Application helpers ──
  const loadApplications = async () => {
    setAppsError(""); setAppsLoading(true);
    try {
      const result = await fetchNgoApplications();
      if (!result.success) throw new Error(result.message || "Failed");
      setApplications(Array.isArray(result.data) ? result.data : []);
    } catch (err) { setAppsError(err.message || "Unable to load"); setApplications([]); }
    finally { setAppsLoading(false); }
  };

  const handleReviewApplication = async (applicationId, status) => {
    if (!applicationId) return;
    setReviewLoading(applicationId);
    try {
      const result = await reviewApplication(applicationId, status, `Reviewed by ${user?.fullName || user?.name || user?.email || "NGO"}`);
      if (result.success) { showToast(`Application ${status}`); await loadApplications(); }
      else throw new Error(result.message || "Unable to update");
    } catch (err) { showToast(err.message || "Unable to update"); }
    finally { setReviewLoading(""); }
  };

  useEffect(() => { if (section === "adoptions") loadApplications(); }, [section]);

  // ── Volunteer/rescue helpers ──
  const loadVolunteers = async (rescue) => {
    const city = extractCityFromAddress(rescue?.address || rescue?.location || "");
    const result = await fetchVolunteers({ city });
    if (result.success) setVolunteerDirectory(result.data.volunteers || []);
    else { setVolunteerDirectory([]); showToast(result.message || "Could not load volunteers"); }
  };

  const handleAssignVolunteerToRescue = async (volunteerId) => {
    if (!modal.data?.id && !modal.data?._id) return;
    setAssignLoading(true);
    const result = await assignVolunteer(modal.data._id || modal.data.id, volunteerId);
    setAssignLoading(false);
    if (result.success) { setModal({ open: false, type: null, data: null }); showToast("Volunteer assigned"); }
    else showToast(result.message || "Assignment failed");
  };

  const handleAcceptRescue = async () => {
    if (!modal.data) return;
    setAssignLoading(true);
    const result = await acceptMission(modal.data._id || modal.data.id);
    setAssignLoading(false);
    if (result.success) { showToast("Mission accepted"); setModal((m) => ({ ...m, data: result.data })); }
    else showToast(result.message || "Could not accept");
  };

  const handleUpdateStatus = async (status) => {
    if (!modal.data) return;
    setStatusLoading(true);
    const result = await updateRescueStatus(modal.data._id || modal.data.id, status, `Updated by ${user?.role}`);
    setStatusLoading(false);
    if (result.success) { setModal({ open: false, type: null, data: null }); showToast(`Rescue ${status.replace("_", " ")}`); }
    else showToast(result.message || "Unable to update");
  };

  const quickActions = [
    { icon: "🚨", label: "Emergency Dispatch", sub: "Manual NGO dispatch", primary: true, danger: true, onClick: () => setModal({ open: true, type: "dispatch", data: null }) },
    { icon: "📸", label: "AI Scanner", sub: "Analyze animal", onClick: () => navigate("/scanner") },
    { icon: "🏠", label: "Create Listing", sub: "Adoption-ready animal", onClick: () => setListingModalOpen(true) },
    { icon: "👤", label: "Volunteers", sub: "Assign to cases", onClick: () => setSection("volunteers") },
    { icon: "📊", label: "Analytics", sub: "Operational metrics", onClick: () => setSection("analytics") },
  ];

  /* ─── Section Renderers ─── */

  const renderSection = () => {
    switch (section) {
      case "rescues":
        return (
          <div>
            <SectionLabel action="Request rescue" onAction={() => navigate("/rescue")}>Active Rescue Queue</SectionLabel>
            {loading && <div style={{ padding: 14, color: T.textMuted }}>Loading…</div>}
            {error && <div style={{ padding: 14, color: T.error }}>{error}</div>}
            <Card style={{ padding: "4px 0" }}>
              {rescues.length === 0 && !loading && <div style={{ padding: 14, color: T.textMuted }}>No active rescues.</div>}
              {rescues.map((r) => (
                <RescueCaseRow
                  key={r._id || r.id} rescue={r}
                  onView={() => setModal({ open: true, type: "rescue", data: r })}
                  onAssign={(rescue) => { setModal({ open: true, type: "assign", data: rescue }); loadVolunteers(rescue); }}
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
            <Card style={{ padding: "4px 0" }}>
              {assignedVolunteers.length === 0 ? (
                <div style={{ padding: 14, color: T.textMuted }}>No volunteers assigned yet.</div>
              ) : (
                assignedVolunteers.map((vol) => (
                  <VolunteerRow
                    key={vol?.id || vol?.email || vol?.fullName}
                    vol={{ ...vol, name: vol.fullName || vol.name || vol.email || "Volunteer", city: vol.city || "Unknown", missionsCompleted: vol.missionsCompleted ?? 0, rating: vol.rating ?? 0, availability: vol.availability || "active" }}
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
            <Card style={{ padding: "4px 0" }}>
              {appsLoading && <div style={{ padding: 14, color: T.textMuted }}>Loading…</div>}
              {appsError && !appsLoading && <div style={{ padding: 14, color: T.error }}>{appsError}</div>}
              {!appsLoading && !appsError && applications.length === 0 && (
                <div style={{ padding: 14, color: T.textMuted }}>No applications pending review.</div>
              )}
              {!appsLoading && !appsError && applications.map((app) => {
                const name = app.applicant?.fullName || app.applicant?.email || "Applicant";
                const contact = app.applicant?.phone || app.applicant?.email || "No contact";
                const animal = app.adoption?.animalName || app.adoption?.animalType || "Unknown";
                const loc = app.adoption?.location || "Unknown location";
                const date = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "";
                const busy = reviewLoading === (app._id || app.id);
                return (
                  <div key={app._id || app.id} style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: "0.86rem", fontWeight: 700, color: T.text }}>{animal}</div>
                        <div style={{ fontSize: "0.72rem", color: T.textMuted }}>{loc} · {date}</div>
                      </div>
                      <StatusBadge status={app.status || "pending"} />
                    </div>
                    <div style={{ fontSize: "0.78rem", color: T.textSub, marginBottom: 8 }}>
                      <strong>{name}</strong> · {contact}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: T.textMuted, lineHeight: 1.5, marginBottom: 10 }}>
                      {app.message || "No details provided."}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button disabled={busy} onClick={() => handleReviewApplication(app._id || app.id, "approved")}
                        style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", cursor: busy ? "not-allowed" : "pointer", fontWeight: 700, fontFamily: "inherit", fontSize: "0.76rem" }}>
                        {busy ? "…" : "Approve"}
                      </button>
                      <button disabled={busy} onClick={() => handleReviewApplication(app._id || app.id, "rejected")}
                        style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgAlt, color: T.text, cursor: busy ? "not-allowed" : "pointer", fontWeight: 700, fontFamily: "inherit", fontSize: "0.76rem" }}>
                        {busy ? "…" : "Reject"}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            <Card><SectionLabel>Status Distribution</SectionLabel><DashboardDonutChart segments={statusSegments} size={100} /></Card>
            <Card><SectionLabel>Severity Distribution</SectionLabel><DashboardDonutChart segments={donutData} size={100} /></Card>
            <Card>
              <SectionLabel>Overview</SectionLabel>
              <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                {[["Total", stats?.total || rescues.length], ["Pending", stats?.pending || 0], ["Completed", stats?.completed || 0], ["Critical", stats?.critical || 0]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: T.textMuted }}>
                    <span>{k}</span><strong style={{ color: T.text }}>{v}</strong>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      default: // overview
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Quick Actions */}
            <div>
              <SectionLabel>Quick Actions</SectionLabel>
              <DashboardQuickActions actions={quickActions} />
            </div>

            {/* Active Rescues (compact, max 5) */}
            <Card style={{ padding: "4px 0" }}>
              <div style={{ padding: "0 14px 8px" }}>
                <SectionLabel action="View all" onAction={() => setSection("rescues")}>Active Rescues</SectionLabel>
              </div>
              {activeRescues.length === 0 && !loading && (
                <div style={{ padding: "8px 16px 14px", color: T.textMuted, fontSize: "0.82rem" }}>No active rescues.</div>
              )}
              {activeRescues.slice(0, 5).map((r) => (
                <RescueCaseRow key={r._id || r.id} rescue={r}
                  onView={() => setModal({ open: true, type: "rescue", data: r })}
                  showAssign onAssign={(d) => { setModal({ open: true, type: "assign", data: d }); loadVolunteers(d); }}
                />
              ))}
            </Card>

            {/* Activity Feed */}
            <Card style={{ padding: "4px 0" }}>
              <div style={{ padding: "0 14px 8px" }}><SectionLabel>Recent Activity</SectionLabel></div>
              <DashboardActivityFeed items={activityFeed} limit={5} />
            </Card>
          </div>
        );
    }
  };

  /* ─── Form field helper ─── */
  const Field = ({ label, error, children }) => (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: "0.76rem", fontWeight: 700, color: T.textMuted }}>{label}</label>
      {children}
      {error && <div style={{ color: "#EF4444", fontSize: "0.72rem" }}>{error}</div>}
    </div>
  );


  /* ─── Render ─── */
  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        <div style={{ position: "relative" }}>
          <DashboardHeader role="ngo" userName={user?.fullName || user?.name || user?.email || "NGO"} />
        </div>

        <DashboardStats stats={statsArr} />

        <div className="rq-dashboard-content-grid">
          <div className="dashboard-sidebar-slot">
            <DashboardSidebar role="ngo" activeSection={section} onSection={setSection} />
          </div>
          <div className="dashboard-main">{renderSection()}</div>
        </div>

        {/* ── Rescue Detail Modal ── */}
        <DashboardModal isOpen={modal.open && modal.type === "rescue"} title={`Rescue ${modal.data?._id || modal.data?.id}`} onClose={() => setModal({ open: false, type: null, data: null })}>
          {modal.data && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <SeverityBadge level={modal.data.severity} size="lg" />
                <StatusBadge status={modal.data.status} />
              </div>
              {modal.data.images?.length > 0 && (
                <img src={getImageUrl(modal.data.images[0]) || ""} alt="rescue" style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 10 }} />
              )}
              {[
                ["Animal", modal.data.animalType || modal.data.animal || modal.data.condition],
                ["Condition", modal.data.condition],
                ["Location", modal.data.address || modal.data.location],
                ["NGO", modal.data.assignedNgo?.fullName || modal.data.assignedNgo?.email || "Unassigned"],
                ["Volunteer", modal.data.assignedVolunteer?.fullName || modal.data.assignedVolunteer?.email || "Unassigned"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 80, fontSize: "0.72rem", color: T.textMuted, fontWeight: 600, flexShrink: 0 }}>{k}</div>
                  <div style={{ flex: 1, fontSize: "0.82rem", color: T.text, lineHeight: 1.4 }}>{v}</div>
                </div>
              ))}
              {user?.role && ["ngo", "admin"].includes(user.role) && (
                <StatusUpdateControls rescue={modal.data} onUpdate={handleUpdateStatus} loading={statusLoading} T={T} />
              )}
            </div>
          )}
        </DashboardModal>

        {/* ── Assign Volunteer Modal ── */}
        <DashboardModal isOpen={modal.open && modal.type === "assign"} title="Assign Volunteer" onClose={() => setModal({ open: false, type: null, data: null })}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {modal.data && volunteerDirectory.map((vol) => (
              <button key={vol.id} type="button" disabled={assignLoading} onClick={() => handleAssignVolunteerToRescue(vol.id)}
                style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgAlt, textAlign: "left", cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
                <div style={{ fontWeight: 700, color: T.text, fontSize: "0.82rem" }}>{vol.name}</div>
                <div style={{ fontSize: "0.72rem", color: T.textMuted }}>{vol.city} · {vol.availability}</div>
              </button>
            ))}
            {modal.data?.status === "pending" && (
              <button type="button" disabled={assignLoading} onClick={handleAcceptRescue}
                style={{ padding: "9px", borderRadius: 8, background: T.accent, border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {assignLoading ? "Working…" : "Accept mission as NGO"}
              </button>
            )}
          </div>
        </DashboardModal>

        {/* ── Create Listing Modal ── */}
        <DashboardModal isOpen={listingModalOpen} title="Create Adoption Listing" onClose={() => { setListingModalOpen(false); resetListingForm(); }}>
          <div style={{ display: "grid", gap: 14 }}>
            <Field label="Animal Name" error={listingErrors.animalName}>
              <input value={listingForm.animalName} onChange={(e) => setListingForm((p) => ({ ...p, animalName: e.target.value }))} disabled={createListingLoading} placeholder="e.g. Luna" className="rq-input" style={{ borderColor: listingErrors.animalName ? "#EF4444" : undefined }} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Species" error={listingErrors.animalType}>
                <input value={listingForm.animalType} onChange={(e) => setListingForm((p) => ({ ...p, animalType: e.target.value }))} disabled={createListingLoading} placeholder="Dog, Cat…" className="rq-input" style={{ borderColor: listingErrors.animalType ? "#EF4444" : undefined }} />
              </Field>
              <Field label="Age" error={listingErrors.age}>
                <input value={listingForm.age} onChange={(e) => setListingForm((p) => ({ ...p, age: e.target.value }))} disabled={createListingLoading} placeholder="2 years" className="rq-input" style={{ borderColor: listingErrors.age ? "#EF4444" : undefined }} />
              </Field>
            </div>
            <Field label="Condition" error={listingErrors.condition}>
              <input value={listingForm.condition} onChange={(e) => setListingForm((p) => ({ ...p, condition: e.target.value }))} disabled={createListingLoading} placeholder="Describe condition" className="rq-input" style={{ borderColor: listingErrors.condition ? "#EF4444" : undefined }} />
            </Field>
            <Field label="Description" error={listingErrors.description}>
              <textarea value={listingForm.description} onChange={(e) => setListingForm((p) => ({ ...p, description: e.target.value }))} disabled={createListingLoading} placeholder="Background or care notes" className="rq-textarea" style={{ borderColor: listingErrors.description ? "#EF4444" : undefined }} />
            </Field>
            <Field label="Image" error={listingErrors.image}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label htmlFor="listing-image" style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${listingErrors.image ? "#EF4444" : T.border}`, background: T.bgAlt, color: T.text, cursor: createListingLoading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "0.8rem" }}>
                  {listingFile ? "Change" : "Upload"}
                </label>
                <span style={{ color: T.textMuted, fontSize: "0.72rem" }}>PNG, JPG, WEBP</span>
              </div>
              <input id="listing-image" type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleListingImageChange} disabled={createListingLoading} style={{ display: "none" }} />
              {listingImagePreview && (
                <div style={{ width: "100%", maxWidth: 280, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}`, marginTop: 6 }}>
                  <img src={listingImagePreview} alt="Preview" style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
              )}
            </Field>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" disabled={createListingLoading} onClick={() => { setListingModalOpen(false); resetListingForm(); }}
                style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgAlt, color: T.text, cursor: createListingLoading ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "0.82rem" }}>
                Cancel
              </button>
              <button type="button" disabled={createListingLoading} onClick={handleCreateListing}
                style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", cursor: createListingLoading ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: "0.82rem" }}>
                {createListingLoading ? "Creating…" : "Create Listing"}
              </button>
            </div>
          </div>
        </DashboardModal>
      </DashboardErrorBoundary>
    </DashboardPage>
  );
}
