/**
 * ResQNet — User Dashboard
 * Personal rescue participation hub: rescue tracking, AI scans, adoptions, activity.
 * Integrates into existing MainLayout. Uses ThemeContext. No standalone wrappers.
 *
 * Route: /dashboard/user
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import DashboardPage from "../../components/dashboard/DashboardPage";
import DashboardSectionTabs from "../../components/dashboard/DashboardSectionTabs";
import { getImageUrl } from "../../utils/imageUrl";
import {
  DashboardHeader, DashboardStats, DashboardActivityFeed,
  DashboardQuickActions, DashboardModal, DashboardTimeline,
  DashboardNotifications, DashboardErrorBoundary, RescueCaseRow,
  SectionLabel, Card, SeverityBadge, StatusBadge, DashboardSidebar,
} from "../../components/dashboard/DashboardShared";
import { useRescue } from "../../context/RescueContext";
import { useAuth } from "../../context/AuthContext";
import { timeAgo, buildActivityFromRescues, buildNotificationsFromRescues } from "../../utils/operationalData";

// ─── SCAN CARD ────────────────────────────────────────────────────────────────
function ScanCard({ scan, onView, T }) {
  const scoreColor = scan.severityScore >= 70 ? "#DC2626" : scan.severityScore >= 40 ? "#D97706" : "#16A34A";
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onView(scan)}
      style={{
        background: T.bgCard, border: `1px solid ${T.border}`,
        borderRadius: 12, padding: "14px 16px", cursor: "pointer",
        boxShadow: `0 2px 10px ${T.shadow}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: "0.66rem", color: T.textMuted, fontFamily: "monospace", marginBottom: 2 }}>{scan.id}</div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>{scan.animal}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.4rem", fontWeight: 900, color: scoreColor, letterSpacing: "-0.05em", lineHeight: 1 }}>
            {scan.severityScore}
          </div>
          <div style={{ fontSize: "0.6rem", color: T.textMuted }}>severity</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
        {(Array.isArray(scan.conditions) ? scan.conditions : []).map((c, i) => (
          <span key={i} style={{
            padding: "2px 7px", borderRadius: 5,
            background: T.bgAlt, border: `1px solid ${T.border}`,
            fontSize: "0.66rem", color: T.textSub, fontWeight: 500,
          }}>{c}</span>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.67rem", color: T.textMuted }}>{timeAgo(scan.date)}</div>
        <div style={{ fontSize: "0.67rem", color: T.accent, fontWeight: 600 }}>{scan.action}</div>
      </div>
    </motion.div>
  );
}

// ─── ANIMAL CARD ──────────────────────────────────────────────────────────────
function SavedAnimalCard({ animal, onAdopt, T }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "0.9rem", fontWeight: 750, color: T.text, letterSpacing: "-0.03em" }}>{animal.name}</div>
          <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 1 }}>{animal.breed} · {animal.age} · {animal.city}</div>
        </div>
        <StatusBadge status={animal.status} />
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {animal.vaccinated && <span style={{ fontSize: "0.65rem", padding: "2px 7px", borderRadius: 5, background: "rgba(22,163,74,0.1)", color: "#16A34A", fontWeight: 600 }}>Vaccinated</span>}
        {animal.neutered && <span style={{ fontSize: "0.65rem", padding: "2px 7px", borderRadius: 5, background: "rgba(22,163,74,0.1)", color: "#16A34A", fontWeight: 600 }}>Neutered</span>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.72rem", color: T.textSub }}>
          <span style={{ fontWeight: 700, color: T.accent }}>{animal.compatibility}%</span> compatibility
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => onAdopt(animal)}
          style={{
            padding: "5px 13px", borderRadius: 7,
            background: animal.status === "available" ? T.accent : T.border,
            border: "none", color: "#fff",
            fontSize: "0.73rem", fontWeight: 700,
            cursor: animal.status === "available" ? "pointer" : "default",
            fontFamily: "inherit",
          }}
        >
          {animal.status === "available" ? "Adopt" : "Pending"}
        </motion.button>
      </div>
    </Card>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function UserDashboard() {
  const { T } = useT();
  const vp = useViewport();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { myRescues, loading, error } = useRescue();
  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [notifOpen, setNotifOpen] = useState(false);
  const activityFeed = buildActivityFromRescues(myRescues);
  const [notifications, setNotifications] = useState(() => buildNotificationsFromRescues(myRescues));

  const rescueStatusCounts = myRescues.reduce(
    (acc, rescue) => {
      acc[rescue.status] = (acc[rescue.status] || 0) + 1;
      return acc;
    },
    { pending: 0, accepted: 0, in_progress: 0, rescued: 0, completed: 0, cancelled: 0 }
  );

  const stats = [
    { label: "Rescue Reports", value: myRescues.length, icon: "🚑", sub: `${rescueStatusCounts.pending} pending`, trend: "up", highlight: true },
    { label: "Active Operations", value: rescueStatusCounts.accepted + rescueStatusCounts.in_progress + rescueStatusCounts.rescued, icon: "🌀", sub: "Live response" },
    { label: "Completed", value: rescueStatusCounts.completed, icon: "✅", sub: "Finished missions" },
    { label: "Cancelled", value: rescueStatusCounts.cancelled, icon: "🚫", sub: "Cancelled reports" },
  ];

  const quickActions = [
    { icon: "🚑", label: "Report Rescue", sub: "New emergency report", primary: true, onClick: () => navigate("/rescue") },
    { icon: "📸", label: "AI Scanner", sub: "Analyze animal", onClick: () => navigate("/scanner") },
    { icon: "🗺️", label: "Find NGO", sub: "Nearby organizations", onClick: () => navigate("/ngos") },
    { icon: "🏠", label: "Adopt", sub: "Browse animals", onClick: () => navigate("/adoption") },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Timeline for the latest rescue
  const myRescueTimeline = Array.isArray(myRescues[0]?.rescueTimeline)
    ? myRescues[0].rescueTimeline.map((t, idx) => ({
      label: t.status,
      done: true,
      time: timeAgo(t.createdAt || t.timestamp),
      type: t.status === "completed" ? "success" : t.status === "cancelled" ? "error" : "info",
      note: t.note,
    }))
    : [];

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  // Section rendering, now using myRescues from context
  const renderSection = () => {
    switch (section) {
      case "rescues":
        return (
          <div>
            <SectionLabel action="Report new" onAction={() => navigate("/rescue")}>My Rescue Reports</SectionLabel>
            {loading && <div style={{ padding: 16, color: T.textMuted }}>Loading rescues…</div>}
            {error && <div style={{ padding: 16, color: T.error }}>{error}</div>}
            <div style={{ borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", background: T.bgCard }}>
              {myRescues.length === 0 && !loading && <div style={{ padding: 16, color: T.textMuted }}>No rescue reports yet.</div>}
              {myRescues.slice(0, 4).map((r) => (
                <RescueCaseRow key={r._id || r.id} rescue={r} onView={() => setModal({ open: true, type: "rescue", data: r })} />
              ))}
            </div>
          </div>
        );


      case "adoptions":
        return (
          <div>
            <SectionLabel action="Browse all" onAction={() => navigate("/adoption")}>Saved & Tracked Animals</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              <motion.div style={{ padding: 16, color: T.textMuted, fontSize: "0.85rem" }}>
                Adoption listings will load from the core database when the adoption workflow is enabled.
              </motion.div>
            </div>
          </div>
        );

      case "activity":
        return (
          <div>
            <SectionLabel>Full Activity Log</SectionLabel>
            <Card style={{ padding: "8px 0" }}>
              <DashboardActivityFeed items={activityFeed} limit={10} />
            </Card>
          </div>
        );

      default: // overview
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Quick Actions */}
            <div>
              <SectionLabel>Quick Actions</SectionLabel>
              <DashboardQuickActions actions={quickActions} />
            </div>

            {/* Active rescue + Timeline */}
            {myRescues.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                <Card>
                  <SectionLabel>Latest Rescue</SectionLabel>
                  <RescueCaseRow rescue={myRescues[0]} onView={() => setModal({ open: true, type: "rescue", data: myRescues[0] })} />
                </Card>
                <Card>
                  <SectionLabel>Rescue Timeline</SectionLabel>
                  <DashboardTimeline events={myRescueTimeline} />
                </Card>
              </div>
            )}

            {/* Recent scans */}
            <div>
              <SectionLabel action="View all" onAction={() => setSection("scans")}>Recent AI Scans</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                {myRescues.length > 0 && (
                  <motion.div style={{ padding: 12, color: T.textMuted, fontSize: "0.82rem", gridColumn: "1 / -1" }}>
                    Run an AI scan from the Scanner page to get a fresh AI assessment.
                  </motion.div>
                )}
              </div>
            </div>

            {/* Activity */}
            <div>
              <SectionLabel action="View all" onAction={() => setSection("activity")}>Activity Feed</SectionLabel>
              <Card style={{ padding: "6px 0" }}>
                <DashboardActivityFeed items={activityFeed} limit={4} />
              </Card>
            </div>
          </div>
        );
    }
  };

  const userSections = [
    { id: "overview", label: "Overview" },
    { id: "rescues", label: "Rescues" },
    { id: "adoptions", label: "Adoptions" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>
        {/* Header with notifications */}
        <div style={{ position: "relative" }}>
          <DashboardHeader role="user" userName={user?.fullName || user?.name || user?.email || "Rescuer"} onNotifClick={() => setNotifOpen((p) => !p)} notifCount={unreadCount} />
          <AnimatePresence>
            {notifOpen && (
              <div style={{ position: "absolute", top: 0, right: 0, zIndex: 200 }}>
                <DashboardNotifications items={notifications} onClose={() => setNotifOpen(false)} onMarkAll={markAllRead} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats */}
        <DashboardStats stats={stats} />

        {/* Layout: sidebar + content */}
        <div className="dashboard-layout">
          {vp.desktop && (
            <div className="dashboard-sidebar-slot">
              <DashboardSidebar role="user" activeSection={section} onSection={setSection} />
            </div>
          )}

          <div className="dashboard-main">
            {!vp.desktop && (
              <DashboardSectionTabs sections={userSections} activeSection={section} onSection={setSection} />
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      {/* Modals */}
      <DashboardModal
        isOpen={modal.open && modal.type === "rescue"}
        title={`Rescue ${modal.data?.id}`}
        onClose={() => setModal({ open: false, type: null, data: null })}
      >
        {modal.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <SeverityBadge level={modal.data.severity} size="lg" />
              <StatusBadge status={modal.data.status} />
            </div>
            {modal.data.images && modal.data.images.length > 0 && (
              <div>
                <img src={getImageUrl(modal.data.images[0]) || ""} alt="rescue" style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 10 }} />
              </div>
            )}
            {[
              ["Animal", modal.data.animal],
              ["Location", modal.data.location],
              ["AI Score", `${modal.data.aiScore}/100`],
              ["Assigned NGO", modal.data.assignedTo],
              ["Volunteer", modal.data.volunteer],
              ["Notes", modal.data.notes],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 90, fontSize: "0.75rem", color: T.textMuted, fontWeight: 600, flexShrink: 0, paddingTop: 1 }}>{k}</div>
                <div style={{ flex: 1, fontSize: "0.82rem", color: T.text, letterSpacing: "-0.01em", lineHeight: 1.4 }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </DashboardModal>

      <DashboardModal
        isOpen={modal.open && modal.type === "scan"}
        title={`Scan Report — ${modal.data?.id}`}
        onClose={() => setModal({ open: false, type: null, data: null })}
      >
        {modal.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: modal.data.severityScore >= 70 ? "#DC2626" : "#D97706", letterSpacing: "-0.05em" }}>
                {modal.data.severityScore}<span style={{ fontSize: "0.9rem", opacity: 0.5 }}>/100</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.67rem", color: T.textMuted }}>Confidence</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: T.text }}>{modal.data.confidence}%</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.67rem", color: T.textMuted, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>Detected Conditions</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(Array.isArray(modal.data.conditions) ? modal.data.conditions : []).map((c, i) => (
                  <span key={i} style={{ padding: "3px 9px", borderRadius: 6, background: T.bgAlt, border: `1px solid ${T.border}`, fontSize: "0.74rem", color: T.text, fontWeight: 500 }}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{ fontSize: "0.82rem", color: T.textSub, padding: "10px 12px", borderRadius: 8, background: T.bgAlt, border: `1px solid ${T.border}` }}>
              <strong>Action taken:</strong> {modal.data.action}
            </div>
          </div>
        )}
      </DashboardModal>

      <DashboardModal
        isOpen={modal.open && modal.type === "adopt"}
        title={`Adopt ${modal.data?.name}`}
        onClose={() => setModal({ open: false, type: null, data: null })}
      >
        {modal.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: "0.84rem", color: T.textSub, lineHeight: 1.6 }}>
              You're initiating an adoption request for <strong>{modal.data.name}</strong>, a {modal.data.age} {modal.data.breed} from {modal.data.ngo} in {modal.data.city}.
            </div>
            <div style={{ padding: "12px", borderRadius: 10, background: T.bgAlt, border: `1px solid ${T.border}`, fontSize: "0.81rem", color: T.text }}>
              AI Compatibility: <strong style={{ color: T.accent }}>{modal.data.compatibility}%</strong> match with your profile.
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setModal({ open: false, type: null, data: null }); navigate("/adoption"); }}
              style={{
                padding: "11px", borderRadius: 9, background: T.accent,
                border: "none", color: "#fff", fontSize: "0.85rem",
                fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Continue to Adoption Portal →
            </motion.button>
          </div>
        )}
      </DashboardModal>
      </DashboardErrorBoundary>
    </DashboardPage>
  );
}
