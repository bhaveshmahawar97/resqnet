import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useT } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import useViewport from "../../hooks/useViewport";
import DashboardPage from "../../components/dashboard/DashboardPage";
import DashboardSectionTabs from "../../components/dashboard/DashboardSectionTabs";
import { getImageUrl } from "../../utils/imageUrl";
import {
  DashboardHeader, DashboardStats,
  DashboardModal, DashboardErrorBoundary,
  SeverityBadge, DashboardSidebar, StatusBadge, DashboardTimeline,
  SectionLabel, Card
} from "../../components/dashboard/DashboardShared";
import { useRescue } from "../../context/RescueContext";
import LoadingState from "../../components/system/LoadingState";
import ErrorState from "../../components/system/ErrorState";
import useDashboardData from "../../hooks/useDashboardData";
import DashboardWidget from "../../components/dashboard/DashboardWidget";

// ─── AVAILABILITY CONFIG ──────────────────────────────────────────────────────
const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available", color: "#16A34A", bg: "rgba(22,163,74,0.12)", border: "rgba(22,163,74,0.3)" },
  { value: "limited",   label: "Limited",   color: "#D97706", bg: "rgba(217,119,6,0.12)", border: "rgba(217,119,6,0.3)" },
  { value: "unavailable", label: "Unavailable", color: "#DC2626", bg: "rgba(220,38,38,0.10)", border: "rgba(220,38,38,0.25)" },
];

function getAvailabilityConfig(val) {
  const key = typeof val === "string" ? val.toLowerCase() : "available";
  return AVAILABILITY_OPTIONS.find(o => o.value === key) || AVAILABILITY_OPTIONS[0];
}

// ─── AVAILABILITY BADGE ───────────────────────────────────────────────────────
function AvailabilityBadge({ availability }) {
  const cfg = getAvailabilityConfig(availability);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 20,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      color: cfg.color, fontSize: "0.72rem", fontWeight: 700,
      letterSpacing: "0.04em", textTransform: "uppercase",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

// ─── AVAILABILITY TOGGLE ──────────────────────────────────────────────────────
function AvailabilityToggle({ current, onToggle, T }) {
  const currentCfg = getAvailabilityConfig(current);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <AvailabilityBadge availability={current} />
      <button
        onClick={onToggle}
        style={{
          padding: "5px 11px", borderRadius: 8,
          background: "transparent", border: `1px solid ${T.border}`,
          color: T.textSub, fontSize: "0.72rem", fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = currentCfg.color; e.currentTarget.style.color = currentCfg.color; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; }}
      >
        Change
      </button>
    </div>
  );
}

// ─── MISSION CARD (available) ─────────────────────────────────────────────────
function AvailableMissionCard({ mission, onAccept, onView, T }) {
  const severityColor = {
    critical: T.danger, high: T.warning, medium: T.info, low: T.success,
  }[mission.severity?.toLowerCase()] || T.textMuted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: `0 6px 20px ${T.accent}18` }}
      style={{
        background: T.bgCard, border: `1px solid ${T.border}`,
        borderRadius: 12, padding: "14px 16px",
        display: "flex", flexDirection: "column", gap: 10,
        cursor: "pointer", transition: "box-shadow 0.2s",
        borderLeft: `3px solid ${severityColor}`,
      }}
      onClick={() => onView(mission)}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.63rem", fontFamily: "monospace", color: T.textMuted, letterSpacing: "0.04em" }}>
              {mission.id || mission._id?.slice(-8)}
            </span>
            <SeverityBadge level={mission.severity} />
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.text, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
            {mission.animal || mission.animalType || "Animal"}
          </div>
        </div>
        {mission.aiScore != null && (
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
            <div style={{
              fontSize: "1.4rem", fontWeight: 900, lineHeight: 1,
              color: mission.aiScore >= 70 ? T.danger : mission.aiScore >= 40 ? T.warning : T.success,
            }}>
              {mission.aiScore}
            </div>
            <div style={{ fontSize: "0.56rem", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>AI score</div>
          </div>
        )}
      </div>

      {/* Meta info */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {mission.location && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: T.textSub }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mission.location}</span>
          </div>
        )}
        {mission.distance && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: T.textSub }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {mission.distance}
          </div>
        )}
        {(mission.timePosted || mission.createdAt) && (
          <div style={{ fontSize: "0.72rem", color: T.textMuted }}>
            {mission.timePosted || new Date(mission.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>

      {/* Action */}
      <button
        onClick={e => { e.stopPropagation(); onAccept(mission); }}
        style={{
          width: "100%", padding: "8px", borderRadius: 8,
          background: T.accent, border: "none",
          color: T.textOnAccent, fontSize: "0.78rem", fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Accept Mission
      </button>
    </motion.div>
  );
}

// ─── ACTIVE MISSION CARD ──────────────────────────────────────────────────────
function ActiveMissionCard({ mission, onUpdate, onView, T }) {
  const tasks = Array.isArray(mission.tasks) ? mission.tasks : [];
  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: `0 6px 20px ${T.info}18` }}
      style={{
        background: T.bgCard, border: `1px solid ${T.border}`,
        borderRadius: 12, padding: "14px 16px",
        display: "flex", flexDirection: "column", gap: 10,
        cursor: "pointer", transition: "box-shadow 0.2s",
        borderLeft: `3px solid ${T.info}`,
      }}
      onClick={() => onView(mission)}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.63rem", fontFamily: "monospace", color: T.textMuted, letterSpacing: "0.04em" }}>
              {mission.id || mission._id?.slice(-8)}
            </span>
            <SeverityBadge level={mission.severity} />
            <StatusBadge status={mission.status} />
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.text, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
            {mission.animal || mission.animalType || "Animal"}
          </div>
        </div>
        {mission.aiScore != null && (
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
            <div style={{
              fontSize: "1.4rem", fontWeight: 900, lineHeight: 1,
              color: mission.aiScore >= 70 ? T.danger : mission.aiScore >= 40 ? T.warning : T.success,
            }}>
              {mission.aiScore}
            </div>
            <div style={{ fontSize: "0.56rem", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>AI score</div>
          </div>
        )}
      </div>

      {/* Location */}
      {mission.location && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: T.textSub }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mission.location}</span>
        </div>
      )}

      {/* Progress bar (if tasks exist) */}
      {total > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Progress</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: T.accent }}>{progress}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 4, background: T.bgAlt, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ height: "100%", borderRadius: 4, background: T.accent }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={e => { e.stopPropagation(); onView(mission); }}
          style={{
            flex: 1, padding: "7px", borderRadius: 8,
            background: "transparent", border: `1px solid ${T.border}`,
            color: T.textSub, fontSize: "0.75rem", fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          View Briefing
        </button>
        <button
          onClick={e => { e.stopPropagation(); onUpdate(mission); }}
          style={{
            flex: 1, padding: "7px", borderRadius: 8,
            background: T.info, border: "none",
            color: "#fff", fontSize: "0.75rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Update Status
        </button>
      </div>
    </motion.div>
  );
}

// ─── KANBAN BOARD ─────────────────────────────────────────────────────────────
function MissionBoard({ availableMissions, activeMissions, onAccept, onUpdate, onView, T }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
      {/* Available Missions Column */}
      <div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: T.success, boxShadow: `0 0 0 3px ${T.success}22`,
            }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Available Missions
            </span>
          </div>
          <span style={{
            fontSize: "0.65rem", fontWeight: 800, padding: "2px 8px",
            borderRadius: 20, background: T.successPale || "rgba(22,163,74,0.1)",
            color: T.success, border: `1px solid ${T.successBorder || "rgba(22,163,74,0.25)"}`,
          }}>
            {availableMissions.length}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {availableMissions.length === 0 ? (
            <div style={{
              padding: "28px 20px", textAlign: "center",
              background: T.bgCard, border: `1px dashed ${T.border}`,
              borderRadius: 12, color: T.textMuted, fontSize: "0.82rem",
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>--</div>
              No missions available in your area
            </div>
          ) : (
            availableMissions.map(m => (
              <AvailableMissionCard
                key={m.id || m._id}
                mission={m}
                onAccept={onAccept}
                onView={onView}
                T={T}
              />
            ))
          )}
        </div>
      </div>

      {/* Active Missions Column */}
      <div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: T.info, boxShadow: `0 0 0 3px ${T.info}22`,
            }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              My Active Missions
            </span>
          </div>
          <span style={{
            fontSize: "0.65rem", fontWeight: 800, padding: "2px 8px",
            borderRadius: 20, background: T.infoPale || "rgba(14,165,233,0.1)",
            color: T.info, border: `1px solid ${T.infoBorder || "rgba(14,165,233,0.25)"}`,
          }}>
            {activeMissions.length}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activeMissions.length === 0 ? (
            <div style={{
              padding: "28px 20px", textAlign: "center",
              background: T.bgCard, border: `1px dashed ${T.border}`,
              borderRadius: 12, color: T.textMuted, fontSize: "0.82rem",
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>--</div>
              No active missions assigned
            </div>
          ) : (
            activeMissions.map(m => (
              <ActiveMissionCard
                key={m.id || m._id}
                mission={m}
                onUpdate={onUpdate}
                onView={onView}
                T={T}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAP PLACEHOLDER ──────────────────────────────────────────────────────────
function MapPlaceholder({ location, T }) {
  return (
    <div style={{
      height: 160, borderRadius: 10, background: T.bgAlt,
      border: `1px solid ${T.border}`, display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 8, color: T.textMuted,
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
      <div style={{ fontSize: "0.75rem", textAlign: "center", maxWidth: 200, lineHeight: 1.4 }}>
        {location ? location : "Location not available"}
      </div>
      <span style={{ fontSize: "0.65rem", color: T.textMuted, opacity: 0.6 }}>Map integration pending</span>
    </div>
  );
}

// ─── MISSION DETAIL MODAL ─────────────────────────────────────────────────────
function MissionDetailModal({ isOpen, mission, onClose, onAccept, onUpdate, T }) {
  const [reportText, setReportText] = useState("");
  const [reportStatus, setReportStatus] = useState("in_progress");

  if (!mission) return null;

  const isAvailable = !mission.assignedVolunteer;

  return (
    <DashboardModal isOpen={isOpen} title={`Mission Briefing — ${mission.id || mission._id?.slice(-8)}`} onClose={onClose} width={540}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Header badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <SeverityBadge level={mission.severity} />
          <StatusBadge status={mission.status} />
          {mission.aiScore != null && (
            <span style={{
              fontSize: "0.72rem", fontWeight: 700, padding: "3px 8px",
              borderRadius: 6, background: T.bgAlt, color: T.textSub,
              border: `1px solid ${T.border}`,
            }}>
              AI Score: {mission.aiScore}/100
            </span>
          )}
        </div>

        {/* Animal & location */}
        <div style={{
          background: T.bgAlt, borderRadius: 10, padding: "12px 14px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
        }}>
          {[
            ["Animal", mission.animal || mission.animalType],
            ["Location", mission.location || mission.address],
            ["Assigned NGO", mission.assignedTo || mission.ngo],
            ["Time Reported", mission.timePosted || (mission.createdAt ? new Date(mission.createdAt).toLocaleString() : null)],
          ].map(([k, v]) => v ? (
            <div key={k}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: T.text, lineHeight: 1.35 }}>{v}</div>
            </div>
          ) : null)}
        </div>

        {/* Map placeholder */}
        <MapPlaceholder location={mission.location} T={T} />

        {/* Contact info */}
        {(mission.contactName || mission.contactPhone || mission.reporterPhone) && (
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Contact Info</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {mission.contactName && (
                <div style={{ fontSize: "0.82rem", color: T.text }}>{mission.contactName}</div>
              )}
              {(mission.contactPhone || mission.reporterPhone) && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <a href={`tel:${mission.contactPhone || mission.reporterPhone}`} style={{ fontSize: "0.82rem", color: T.accent, textDecoration: "none", fontWeight: 600 }}>
                    {mission.contactPhone || mission.reporterPhone}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {mission.notes && (
          <div style={{ background: T.bgAlt, borderRadius: 8, padding: "10px 12px", fontSize: "0.8rem", color: T.textSub, lineHeight: 1.5 }}>
            {mission.notes}
          </div>
        )}

        {/* Timeline */}
        {Array.isArray(mission.rescueTimeline) && mission.rescueTimeline.length > 0 && (
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Timeline</div>
            <DashboardTimeline events={mission.rescueTimeline} />
          </div>
        )}

        {/* Action zone */}
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
          {isAvailable ? (
            <button
              onClick={() => onAccept(mission)}
              style={{
                width: "100%", padding: "11px", borderRadius: 9,
                background: T.accent, border: "none",
                color: T.textOnAccent, fontSize: "0.85rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Accept Mission
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: T.textSub }}>Field Report / Status Update</div>
              <select
                value={reportStatus}
                onChange={e => setReportStatus(e.target.value)}
                style={{
                  width: "100%", padding: "8px 10px", borderRadius: 8,
                  border: `1px solid ${T.border}`, background: T.bgCard,
                  color: T.text, fontSize: "0.82rem", fontFamily: "inherit",
                }}
              >
                <option value="in_progress">In Progress</option>
                <option value="rescued">Rescued (Safe)</option>
                <option value="completed">Completed (Closed)</option>
              </select>
              <textarea
                value={reportText}
                onChange={e => setReportText(e.target.value)}
                placeholder="Describe current situation, actions taken, and any issues..."
                rows={4}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8,
                  border: `1px solid ${T.border}`, background: T.bgCard,
                  color: T.text, fontSize: "0.82rem", fontFamily: "inherit",
                  resize: "vertical", boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => onUpdate(mission, reportStatus, reportText)}
                style={{
                  width: "100%", padding: "10px", borderRadius: 9,
                  background: T.info, border: "none",
                  color: "#fff", fontSize: "0.82rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Submit Update
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardModal>
  );
}

// ─── ACCEPT CONFIRM MODAL ─────────────────────────────────────────────────────
function AcceptMissionModal({ isOpen, mission, onConfirm, onClose, T }) {
  if (!mission) return null;
  return (
    <DashboardModal isOpen={isOpen} title="Confirm Mission Acceptance" onClose={onClose} width={420}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{
          background: T.bgAlt, borderRadius: 10, padding: "12px 14px",
          fontSize: "0.84rem", color: T.textSub, lineHeight: 1.6,
        }}>
          You are about to accept mission <strong style={{ color: T.text }}>{mission.id || mission._id?.slice(-8)}</strong> — <strong style={{ color: T.text }}>{mission.animal}</strong> at <em>{mission.location}</em>.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <SeverityBadge level={mission.severity} />
          {mission.aiScore != null && (
            <span style={{ fontSize: "0.72rem", color: T.textMuted, alignSelf: "center" }}>
              AI Score: {mission.aiScore}/100
            </span>
          )}
        </div>
        <div style={{ fontSize: "0.78rem", color: T.textMuted, lineHeight: 1.5 }}>
          By accepting, you will be assigned as the primary responder. Your location and status will be visible to the coordinating NGO.
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button
            onClick={() => onConfirm(mission)}
            style={{
              flex: 1, padding: "10px", borderRadius: 9,
              background: T.accent, border: "none",
              color: T.textOnAccent, fontSize: "0.82rem", fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Accept Mission
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "10px", borderRadius: 9,
              background: "transparent", border: `1px solid ${T.border}`,
              color: T.textSub, fontSize: "0.82rem", fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </DashboardModal>
  );
}

// ─── REPORT MODAL ─────────────────────────────────────────────────────────────
function ReportModal({ isOpen, mission, onSubmit, onClose, T, reportText, setReportText, reportStatus, setReportStatus }) {
  return (
    <DashboardModal isOpen={isOpen} title="Field Report / Update Status" onClose={onClose} width={440}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mission && (
          <div style={{ fontSize: "0.78rem", color: T.textSub }}>
            Updating mission: <strong style={{ color: T.text }}>{mission.id} — {mission.animal}</strong>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: "0.72rem", fontWeight: 700, color: T.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</label>
          <select
            value={reportStatus}
            onChange={e => setReportStatus(e.target.value)}
            style={{
              width: "100%", padding: "8px 10px", borderRadius: 8,
              border: `1px solid ${T.border}`, background: T.bgCard,
              color: T.text, fontSize: "0.82rem", fontFamily: "inherit",
            }}
          >
            <option value="in_progress">In Progress</option>
            <option value="rescued">Rescued (Safe)</option>
            <option value="completed">Completed (Closed)</option>
          </select>
        </div>
        <textarea
          value={reportText}
          onChange={e => setReportText(e.target.value)}
          placeholder="Describe current situation, actions taken, and any issues..."
          rows={5}
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 8,
            border: `1px solid ${T.border}`, background: T.bgCard,
            color: T.text, fontSize: "0.82rem", fontFamily: "inherit",
            resize: "vertical", boxSizing: "border-box",
          }}
        />
        <button
          onClick={onSubmit}
          style={{
            width: "100%", padding: "10px", borderRadius: 9,
            background: T.accent, border: "none",
            color: T.textOnAccent, fontSize: "0.82rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Submit Update
        </button>
      </div>
    </DashboardModal>
  );
}

// ─── QUICK ACTION BAR ─────────────────────────────────────────────────────────
function QuickActionBar({ onReportIncident, onContactNGO, onUpdateAvailability, T }) {
  const actions = [
    {
      label: "Report Incident",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      color: T.danger, bg: T.dangerPale, border: T.dangerBorder,
      onClick: onReportIncident,
    },
    {
      label: "Contact NGO",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      color: T.accent, bg: T.accentPale, border: `${T.accent}33`,
      onClick: onContactNGO,
    },
    {
      label: "Update Availability",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      color: T.success, bg: T.successPale, border: T.successBorder,
      onClick: onUpdateAvailability,
    },
  ];

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10,
      padding: "14px 16px",
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: 12, marginTop: 4,
    }}>
      {actions.map((a, i) => (
        <motion.button
          key={i}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={a.onClick}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 12px", borderRadius: 9,
            background: a.bg, border: `1px solid ${a.border}`,
            color: a.color, fontSize: "0.78rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            transition: "transform 0.15s",
          }}
        >
          <span style={{ flexShrink: 0 }}>{a.icon}</span>
          <span>{a.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

// ─── VOLUNTEER HEADER ─────────────────────────────────────────────────────────
function VolunteerMissionHeader({ userName, availability, missionCount, onToggleAvailability, T }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      flexWrap: "wrap", gap: 12, marginBottom: 4,
    }}>
      {/* Left: identity */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: T.accentPale, border: `1px solid ${T.accent}33`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", fontWeight: 800, color: T.accent,
            letterSpacing: "-0.02em",
          }}>
            {userName ? userName.charAt(0).toUpperCase() : "V"}
          </div>
          <div>
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: T.text, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              {userName || "Volunteer"}
            </div>
            <div style={{ fontSize: "0.7rem", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 1 }}>
              Field Responder
            </div>
          </div>
        </div>
      </div>

      {/* Right: status + mission count */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {missionCount != null && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 11px", borderRadius: 20,
            background: T.bgAlt, border: `1px solid ${T.border}`,
            fontSize: "0.72rem", fontWeight: 700, color: T.textSub,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            </svg>
            {missionCount} mission{missionCount !== 1 ? "s" : ""}
          </div>
        )}
        <AvailabilityToggle current={availability} onToggle={onToggleAvailability} T={T} />
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function VolunteerDashboard() {
  const { T } = useT();
  const vp = useViewport();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const { data: config, isLoading, error, refetch } = useDashboardData();
  const { acceptMission, updateMissionStatus } = useRescue();

  const [section, setSection] = useState("overview");
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [reportText, setReportText] = useState("");
  const [reportStatus, setReportStatus] = useState("in_progress");

  if (isLoading) return <DashboardPage><LoadingState message="Loading dashboard..." minHeight="80vh" /></DashboardPage>;
  if (error) return <DashboardPage><ErrorState message="Failed to load dashboard data." minHeight="80vh" /></DashboardPage>;
  if (!config) return <DashboardPage><ErrorState message="Dashboard configuration missing." minHeight="80vh" /></DashboardPage>;

  // ─── HANDLERS ──────────────────────────────────────────────────────────────

  const handleAction = (actionType, payload) => {
    switch (actionType) {
      case "navigate":
        if (payload?.path) navigate(payload.path);
        break;
      case "view_rescue":
        setModal({ open: true, type: "rescue", data: payload });
        break;
      case "accept_mission":
        setModal({ open: true, type: "accept", data: payload });
        break;
      case "report_mission":
        setModal({ open: true, type: "report", data: payload });
        break;
      case "update_mission":
        setReportStatus(payload.status || "in_progress");
        setModal({ open: true, type: "report", data: payload });
        break;
      case "modal":
        if (payload?.payload === "report") setModal({ open: true, type: "report", data: null });
        break;
      default:
        console.log("Unhandled action:", actionType, payload);
    }
  };

  const handleAcceptMission = async (rescue) => {
    const result = await acceptMission(rescue._id || rescue.id);
    if (result.success) {
      setModal({ open: false, type: null, data: null });
      refetch();
    }
  };

  const submitReport = async () => {
    if (modal.data) {
      await updateMissionStatus(modal.data.id || modal.data._id, reportStatus, reportText || `Status updated to ${reportStatus}`);
    }
    setReportText("");
    setReportStatus("in_progress");
    setModal({ open: false, type: null, data: null });
    refetch();
  };

  const handleMissionDetailUpdate = async (mission, status, text) => {
    if (mission) {
      await updateMissionStatus(mission.id || mission._id, status, text || `Status updated to ${status}`);
    }
    setModal({ open: false, type: null, data: null });
    refetch();
  };

  const toggleAvailability = async () => {
    try {
      const res = await api.put("/users/me/availability");
      if (res.data.success) {
        addToast(`Availability updated to ${res.data.data.availability}`);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to update availability");
    }
  };

  // ─── DERIVE DATA FROM CONFIG ────────────────────────────────────────────────
  // Collect missions from config widgets for the kanban board
  const allWidgets = Object.values(config?.widgets || {}).flat();
  const availableMissionsWidget = allWidgets.find(w => w.type === "AvailableMissionList");
  const activeMissionsWidget = allWidgets.find(w =>
    w.type === "MissionCardList" || w.type === "MissionCard"
  );

  const availableMissions = Array.isArray(availableMissionsWidget?.data)
    ? availableMissionsWidget.data
    : [];
  const activeMissions = Array.isArray(activeMissionsWidget?.data)
    ? activeMissionsWidget.data
    : Array.isArray(activeMissionsWidget?.data)
    ? [activeMissionsWidget.data]
    : [];

  const userName = user?.fullName || user?.name || user?.email || "Volunteer";
  const availability = user?.volunteerProfile?.availability || "available";
  const totalMissions = availableMissions.length + activeMissions.length;

  // Sidebar sections for volunteer role
  const sidebarSections = [
    { id: "overview", label: "Overview" },
    { id: "missions", label: "My Missions" },
    { id: "tasks", label: "Tasks" },
    { id: "history", label: "History" },
  ];

  return (
    <DashboardPage>
      <DashboardErrorBoundary T={T}>

        {/* ── VOLUNTEER BRIEFING HEADER ───────────────────────────────────────── */}
        <VolunteerMissionHeader
          userName={userName}
          availability={availability}
          missionCount={activeMissions.length}
          onToggleAvailability={toggleAvailability}
          T={T}
        />

        {/* ── STATS ROW ───────────────────────────────────────────────────────── */}
        {config.stats && <DashboardStats stats={config.stats} />}

        {/* ── MISSION BOARD + SIDEBAR LAYOUT ──────────────────────────────────── */}
        <div className="rq-dashboard-content-grid">
          {/* Sidebar */}
          <div className="dashboard-sidebar-slot">
            <DashboardSidebar
              role="volunteer"
              activeSection={section}
              onSection={setSection}
              sections={sidebarSections}
            />
          </div>

          {/* Main content */}
          <div className="dashboard-main">
            {!vp.desktop && (
              <DashboardSectionTabs
                sections={sidebarSections}
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
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* OVERVIEW: show kanban board prominently */}
                {section === "overview" && (
                  <>
                    {/* Kanban Mission Board */}
                    <div>
                      <SectionLabel>Mission Board</SectionLabel>
                      <MissionBoard
                        availableMissions={availableMissions}
                        activeMissions={activeMissions}
                        onAccept={(m) => setModal({ open: true, type: "accept", data: m })}
                        onUpdate={(m) => { setReportStatus(m.status || "in_progress"); setModal({ open: true, type: "report", data: m }); }}
                        onView={(m) => setModal({ open: true, type: "rescue", data: m })}
                        T={T}
                      />
                    </div>

                    {/* Other overview widgets */}
                    {config?.widgets?.[section]
                      ?.filter(w => !["AvailableMissionList", "MissionCardList", "MissionCard"].includes(w.type))
                      .map(widget => (
                        <DashboardWidget key={widget.id} widget={widget} onAction={handleAction} />
                      ))}
                  </>
                )}

                {/* Other sections: render widgets normally */}
                {section !== "overview" && (
                  config?.widgets?.[section]?.map(widget => (
                    <DashboardWidget key={widget.id} widget={widget} onAction={handleAction} />
                  ))
                )}

                {/* MISSIONS section: always show kanban */}
                {section === "missions" && (
                  <div>
                    <SectionLabel>Mission Board</SectionLabel>
                    <MissionBoard
                      availableMissions={availableMissions}
                      activeMissions={activeMissions}
                      onAccept={(m) => setModal({ open: true, type: "accept", data: m })}
                      onUpdate={(m) => { setReportStatus(m.status || "in_progress"); setModal({ open: true, type: "report", data: m }); }}
                      onView={(m) => setModal({ open: true, type: "rescue", data: m })}
                      T={T}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── QUICK ACTION BAR ──────────────────────────────────────────────── */}
            <QuickActionBar
              onReportIncident={() => setModal({ open: true, type: "report", data: null })}
              onContactNGO={() => navigate("/ngos")}
              onUpdateAvailability={toggleAvailability}
              T={T}
            />
          </div>
        </div>

        {/* ── MODALS ─────────────────────────────────────────────────────────── */}

        {/* Mission detail / briefing modal */}
        <MissionDetailModal
          isOpen={modal.open && modal.type === "rescue"}
          mission={modal.data}
          onClose={() => setModal({ open: false, type: null, data: null })}
          onAccept={handleAcceptMission}
          onUpdate={handleMissionDetailUpdate}
          T={T}
        />

        {/* Accept confirm modal */}
        <AcceptMissionModal
          isOpen={modal.open && modal.type === "accept"}
          mission={modal.data}
          onConfirm={handleAcceptMission}
          onClose={() => setModal({ open: false, type: null, data: null })}
          T={T}
        />

        {/* Field report / status update modal */}
        <ReportModal
          isOpen={modal.open && modal.type === "report"}
          mission={modal.data}
          onSubmit={submitReport}
          onClose={() => setModal({ open: false, type: null, data: null })}
          T={T}
          reportText={reportText}
          setReportText={setReportText}
          reportStatus={reportStatus}
          setReportStatus={setReportStatus}
        />

      </DashboardErrorBoundary>
    </DashboardPage>
  );
}
