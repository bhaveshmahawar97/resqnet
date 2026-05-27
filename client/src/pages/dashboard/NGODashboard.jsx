import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
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
import { reviewApplication, createAdoptionListing } from "../../services/adoptionService";
import { uploadToCloudinary } from "../../services/aiService";
import { extractCityFromAddress } from "../../utils/geo";
import LoadingState from "../../components/system/LoadingState";
import ErrorState from "../../components/system/ErrorState";
import useDashboardData from "../../hooks/useDashboardData";
import DashboardWidget from "../../components/dashboard/DashboardWidget";
import useViewport from "../../hooks/useViewport";
import CreateListingModal from "../../components/ngo/CreateListingModal";

/* ─── Form field helper ─── */
function Field({ label, error, children }) {
  const { T } = useT();
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: "0.76rem", fontWeight: 700, color: T.textMuted }}>{label}</label>
      {children}
      {error && <div style={{ color: T.danger, fontSize: "0.72rem" }}>{error}</div>}
    </div>
  );
}

export default function NGODashboard() {
  const { T } = useT();
  const vp = useViewport();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: config, isLoading, error, refetch } = useDashboardData();
  const { updateRescueStatus, assignVolunteer, acceptMission, rejectMission } = useRescue();

  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [toast, setToast] = useState("");

  const [volunteerDirectory, setVolunteerDirectory] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  // Adoption state
  const [reviewLoading, setReviewLoading] = useState("");
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [listingInitialData, setListingInitialData] = useState(null);

  if (isLoading) return <DashboardPage><LoadingState message="Loading dashboard..." minHeight="80vh" /></DashboardPage>;
  if (error) return <DashboardPage><ErrorState message="Failed to load dashboard data." minHeight="80vh" /></DashboardPage>;
  if (!config) return <DashboardPage><ErrorState message="Dashboard configuration missing." minHeight="80vh" /></DashboardPage>;

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  // ── Registration/Verification Views ──
  if (config.requiresVerification) {
    const ngoProfile = config.profile;
    const renderVerificationState = () => {
      if (!ngoProfile) {
        return (
          <div style={{ maxWidth: 600, margin: "3rem auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.text, marginBottom: "1rem" }}>Complete Your Registration</h2>
            <p style={{ color: T.textSub, marginBottom: "2rem", lineHeight: 1.6 }}>Welcome to ResQNet! To access the operational dashboard and start receiving rescue alerts, you need to complete your NGO profile.</p>
            <button onClick={() => navigate("/ngo-register")} className="rq-btn rq-btn-primary">Complete NGO Profile</button>
          </div>
        );
      }
      if (ngoProfile.verificationStatus === "pending") {
        return (
          <div style={{ maxWidth: 600, margin: "3rem auto", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: T.accentPale, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem" }}>⏳</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.text, marginBottom: "1rem" }}>Application Submitted</h2>
            <p style={{ color: T.textSub, marginBottom: "2rem", lineHeight: 1.6 }}>Your application for <strong>{ngoProfile.organizationName}</strong> has been received. Our team will begin reviewing your documents shortly.</p>
          </div>
        );
      }
      if (ngoProfile.verificationStatus === "under_review") {
        return (
          <div style={{ maxWidth: 600, margin: "3rem auto", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: T.infoPale, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem" }}>🔍</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.text, marginBottom: "1rem" }}>Under Review</h2>
            <p style={{ color: T.textSub, marginBottom: "2rem", lineHeight: 1.6 }}>An admin is currently reviewing your registration documents for <strong>{ngoProfile.organizationName}</strong>. You will be notified of the decision soon.</p>
          </div>
        );
      }
      if (ngoProfile.verificationStatus === "rejected") {
        return (
          <div style={{ maxWidth: 600, margin: "3rem auto", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: T.dangerPale, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem" }}>❌</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.text, marginBottom: "1rem" }}>Application Rejected</h2>
            <p style={{ color: T.textSub, marginBottom: "1.5rem", lineHeight: 1.6 }}>Unfortunately, your application for <strong>{ngoProfile.organizationName}</strong> was not approved.</p>
            <button onClick={() => navigate("/ngo-register")} className="rq-btn rq-btn-primary">Submit New Application</button>
          </div>
        );
      }
      if (ngoProfile.verificationStatus === "suspended") {
        return (
          <div style={{ maxWidth: 600, margin: "3rem auto", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: T.warningPale, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem" }}>⚠️</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.text, marginBottom: "1rem" }}>Account Suspended</h2>
            <p style={{ color: T.textSub, marginBottom: "2rem", lineHeight: 1.6 }}>Your operational access for <strong>{ngoProfile.organizationName}</strong> has been suspended. Please contact support.</p>
          </div>
        );
      }
      return null;
    };

    return (
      <DashboardPage>
        <DashboardHeader role="ngo" userName={user?.fullName || user?.name || user?.email || "NGO"} />
        {renderVerificationState()}
      </DashboardPage>
    );
  }

  // ── Main Dashboard Actions ──

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
    if (result.success) { setModal({ open: false, type: null, data: null }); showToast("Volunteer assigned"); refetch(); }
    else showToast(result.message || "Assignment failed");
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
    const result = await updateRescueStatus(modal.data._id || modal.data.id, status, `Updated by ${user?.role}`);
    setStatusLoading(false);
    if (result.success) { setModal({ open: false, type: null, data: null }); showToast(`Rescue ${status.replace("_", " ")}`); refetch(); }
    else showToast(result.message || "Unable to update");
  };

  const handleReviewApplication = async (applicationId, status) => {
    if (!applicationId) return;
    setReviewLoading(applicationId);
    try {
      const result = await reviewApplication(applicationId, status, `Reviewed by ${user?.fullName || user?.name || user?.email || "NGO"}`);
      if (result.success) { showToast(`Application ${status}`); refetch(); }
      else throw new Error(result.message || "Unable to update");
    } catch (err) { showToast(err.message || "Unable to update"); }
    finally { setReviewLoading(""); }
  };

  // ── Listing Form ──
  const handleListingSuccess = () => {
    showToast("Listing created successfully");
    setListingModalOpen(false);
    refetch();
  };

  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        <div style={{ position: "relative" }}>
          <DashboardHeader role="ngo" userName={user?.fullName || user?.name || user?.email || "NGO"} />
        </div>

        {config.stats && <DashboardStats stats={config.stats} />}

        <div className="rq-dashboard-content-grid">
          <div className="dashboard-sidebar-slot">
            <DashboardSidebar role="ngo" activeSection={section} onSection={setSection} sections={config.sections} />
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
                ["Location", modal.data.address || modal.data.location],
                ["Volunteer", modal.data.assignedVolunteer?.fullName || modal.data.assignedVolunteer?.email || "Unassigned"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 80, fontSize: "0.72rem", color: T.textMuted, fontWeight: 600, flexShrink: 0 }}>{k}</div>
                  <div style={{ flex: 1, fontSize: "0.82rem", color: T.text, lineHeight: 1.4 }}>{v || "N/A"}</div>
                </div>
              ))}
              
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                {["accepted", "in_progress", "rescued", "completed", "cancelled"].filter(s => s !== modal.data.status).map(status => (
                  <button key={status} disabled={statusLoading} onClick={() => handleUpdateStatus(status)} style={{ padding: "8px 14px", borderRadius: 8, background: T.bgAlt, border: `1px solid ${T.border}`, cursor: statusLoading ? "not-allowed" : "pointer", color: T.text, fontWeight: 700, fontSize: "0.78rem" }}>
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>

              {modal.data.status === "completed" && (
                <div style={{ marginTop: 14 }}>
                  <button onClick={() => {
                    setListingInitialData({
                      sourceRescue: modal.data._id || modal.data.id,
                      animalType: modal.data.animalType || modal.data.animal || "",
                      condition: modal.data.condition || "",
                      description: `Rescue from ${modal.data.address || modal.data.location}`
                    });
                    setModal({ open: false, type: null, data: null });
                    setListingModalOpen(true);
                  }} className="rq-btn rq-btn-primary" style={{ width: "100%" }}>List for Adoption</button>
                </div>
              )}
            </div>
          )}
        </DashboardModal>

        <DashboardModal isOpen={modal.open && modal.type === "assign"} title={modal.data?.status === "assigned" ? "Mission Assignment" : "Assign Volunteer"} onClose={() => setModal({ open: false, type: null, data: null })}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {modal.data && ["accepted", "volunteer_assigned"].includes(modal.data.status) && volunteerDirectory.map((vol) => (
              <button key={vol.id} type="button" disabled={assignLoading} onClick={() => handleAssignVolunteerToRescue(vol.id)}
                style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgAlt, textAlign: "left", cursor: "pointer", width: "100%" }}>
                <div style={{ fontWeight: 700, color: T.text, fontSize: "0.82rem" }}>{vol.fullName || vol.name}</div>
                <div style={{ fontSize: "0.72rem", color: T.textMuted }}>{vol.city}</div>
              </button>
            ))}
            {modal.data?.status === "assigned" && (
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" disabled={assignLoading} onClick={handleAcceptRescue} className="rq-btn rq-btn-primary" style={{ flex: 1 }}>{assignLoading ? "Working…" : "Accept Mission"}</button>
                <button type="button" disabled={assignLoading} onClick={handleRejectRescue} className="rq-btn rq-btn-outline" style={{ flex: 1 }}>{assignLoading ? "Working…" : "Reject Mission"}</button>
              </div>
            )}
          </div>
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
