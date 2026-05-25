import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../../context/ThemeContext";
import { getPendingNGOs, verifyNGO } from "../../../services/ngoService";
import { Card, SectionLabel, StatusBadge } from "../DashboardShared";
import EmptyState from "../../system/EmptyState";
import LoadingState from "../../system/LoadingState";

export default function AdminNGOVerification() {
  const { T } = useT();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [actionType, setActionType] = useState(null); // 'reject' or 'review' or 'approve'
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    const result = await getPendingNGOs();
    if (result.success && result.data?.ngos) {
      setNgos(result.data.ngos);
    } else {
      setError(result.message || "Failed to load NGO queue");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async () => {
    if (!selectedNgo || !actionType) return;
    if (actionType === "rejected" && !reason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setActionLoading(true);
    const result = await verifyNGO(selectedNgo._id || selectedNgo.id, {
      status: actionType,
      notes: reason.trim()
    });

    setActionLoading(false);

    if (result.success) {
      setSelectedNgo(null);
      setActionType(null);
      setReason("");
      fetchQueue();
    } else {
      alert(result.message || "Failed to update NGO status");
    }
  };

  const getDocUrl = (ngo) => {
    return ngo.documents?.registrationCertificate?.url || "";
  };

  if (loading) return <LoadingState message="Loading verification queue..." minHeight="300px" />;
  if (error) return <div style={{ color: T.danger, padding: 20 }}>{error}</div>;

  return (
    <div>
      <SectionLabel>NGO Verification Queue</SectionLabel>
      
      {ngos.length === 0 ? (
        <EmptyState icon="📋" title="Queue Empty" message="There are no pending NGO applications to review." minHeight="200px" />
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {ngos.map(ngo => (
            <Card key={ngo._id} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: T.text, display: "flex", alignItems: "center", gap: 8 }}>
                    {ngo.organizationName}
                    <StatusBadge status={ngo.verificationStatus === "under_review" ? "in_progress" : "pending"} />
                  </div>
                  <div style={{ fontSize: "0.85rem", color: T.textSub, marginTop: 4 }}>
                    {ngo.city}, {ngo.state} • {ngo.ngoType.join(", ")}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: T.textSub, marginTop: 4 }}>
                    Reg: {ngo.registrationNumber || "N/A"} • Email: {ngo.email}
                  </div>
                </div>
                
                {getDocUrl(ngo) ? (
                  <a href={getDocUrl(ngo)} target="_blank" rel="noreferrer" style={{
                    padding: "0.6rem 1rem", background: T.bgAlt, border: `1px solid ${T.border}`,
                    borderRadius: 8, fontSize: "0.85rem", fontWeight: 700, color: T.accent, textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 6
                  }}>
                    📄 View Document
                  </a>
                ) : (
                  <span style={{ fontSize: "0.8rem", color: T.danger, fontWeight: 600, background: T.dangerPale, padding: "4px 8px", borderRadius: 4 }}>
                    No Document Attached
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
                <button
                  onClick={() => { setSelectedNgo(ngo); setActionType("approved"); }}
                  style={{ padding: "0.6rem 1.2rem", background: "#16A34A", color: T.textOnAccent, border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Approve
                </button>
                
                {ngo.verificationStatus === "pending" && (
                  <button
                    onClick={() => { setSelectedNgo(ngo); setActionType("under_review"); handleAction(); }}
                    style={{ padding: "0.6rem 1.2rem", background: T.bgAlt, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Mark Under Review
                  </button>
                )}

                <button
                  onClick={() => { setSelectedNgo(ngo); setActionType("rejected"); }}
                  style={{ padding: "0.6rem 1.2rem", background: "transparent", color: T.danger, border: "1px solid #DC2626", borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Reject...
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Action Modal */}
      <AnimatePresence>
        {selectedNgo && (actionType === "rejected" || actionType === "approved") && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }} onClick={() => setSelectedNgo(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{
              position: "relative", width: "100%", maxWidth: 450, background: T.bgCard, borderRadius: 16, padding: "2rem", boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: T.text, margin: "0 0 0.5rem" }}>
                {actionType === "approved" ? "Approve Application" : "Reject Application"}
              </h3>
              <p style={{ fontSize: "0.9rem", color: T.textSub, marginBottom: "1.5rem" }}>
                {actionType === "approved" ? `Are you sure you want to approve ${selectedNgo.organizationName}? They will gain full operational access.` : `Provide a reason for rejecting ${selectedNgo.organizationName}.`}
              </p>

              {actionType === "rejected" && (
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Document is blurry, Registration number invalid..."
                  rows={4}
                  style={{
                    width: "100%", padding: "0.8rem", border: `1px solid ${T.border}`, borderRadius: 8,
                    background: T.bg, color: T.text, fontSize: "0.9rem", marginBottom: "1.5rem", fontFamily: "inherit",
                    resize: "none", outline: "none", boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#DC2626"}
                  onBlur={(e) => e.target.style.borderColor = T.border}
                />
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem" }}>
                <button onClick={() => setSelectedNgo(null)} style={{ padding: "0.7rem 1.2rem", background: "transparent", color: T.textSub, border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={actionLoading || (actionType === "rejected" && !reason.trim())}
                  style={{
                    padding: "0.7rem 1.5rem", background: actionType === "approved" ? "#16A34A" : "#DC2626", color: T.textOnAccent,
                    border: "none", borderRadius: 8, fontWeight: 700, cursor: actionLoading ? "wait" : "pointer", fontFamily: "inherit",
                    opacity: (actionType === "rejected" && !reason.trim()) ? 0.5 : 1
                  }}
                >
                  {actionLoading ? "Processing..." : actionType === "approved" ? "Confirm Approval" : "Confirm Rejection"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
