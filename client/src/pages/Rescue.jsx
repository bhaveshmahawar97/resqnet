/**
 * Rescue.jsx — Emergency Rescue Command Center
 * Phase 4: Premium Emergency Dispatch Interface
 *
 * Layout:
 *   - Command-center header (live badge, stats, quick helplines)
 *   - Two-column: EmergencyForm (left) + Sidebar (right)
 *   - Sidebar: nearby NGO cards, emergency tips, helplines
 *   - AI Scanner below the fold
 *
 * No backend changes. All logic lives in EmergencyForm / RescueContext.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useT } from "../context/ThemeContext";
import useViewport from "../hooks/useViewport";
import { usePlatformStats, formatStat } from "../hooks/usePlatformStats";
import EmergencyForm from "../components/rescue/EmergencyForm";
import AIScanner from "../components/rescue/AIScanner";
import RescueModal from "../components/rescue/RescueModal";

function generateRescueId() {
  return `RQ-${Math.floor(1000 + Math.random() * 9000)}`;
}

/* ── Stat chip ─────────────────────────────────────────────────────────────── */
function StatChip({ value, label, T }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0.5rem 1rem",
      borderRadius: "var(--radius-sm)",
      border: `1px solid ${T.border}`,
      background: T.bgCard,
      minWidth: 72,
    }}>
      <span style={{ fontSize: "1.1rem", fontWeight: 800, color: T.text, letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: "0.58rem", color: T.textMuted, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{label}</span>
    </div>
  );
}

/* ── Sidebar section wrapper ───────────────────────────────────────────────── */
function SideCard({ children, T, accent }) {
  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${accent ? `${accent}28` : T.border}`,
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      boxShadow: T.shadowSm,
      ...(accent ? { borderLeft: `3px solid ${accent}` } : {}),
    }}>
      {children}
    </div>
  );
}

/* ── NGO card ──────────────────────────────────────────────────────────────── */
function NgoCard({ name, city, specialty, verified = true, T }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.65rem",
      padding: "0.7rem 1rem",
      borderBottom: `1px solid ${T.borderLight}`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "var(--radius-sm)",
        background: T.accentPale, border: `1px solid ${T.accent}28`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: T.accent, fontWeight: 800, fontSize: "0.78rem", flexShrink: 0,
      }}>
        {name.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
          {verified && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Verified">
              <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
            </svg>
          )}
        </div>
        <div style={{ fontSize: "0.65rem", color: T.textMuted, marginTop: 1 }}>{city} · {specialty}</div>
      </div>
      <Link to="/ngos" style={{
        fontSize: "0.65rem", fontWeight: 700, color: T.accent,
        textDecoration: "none", whiteSpace: "nowrap",
        padding: "0.2rem 0.5rem", borderRadius: "var(--radius-full)",
        background: T.accentPale, border: `1px solid ${T.accent}28`,
      }}>
        View
      </Link>
    </div>
  );
}

/* ── Helpline row ──────────────────────────────────────────────────────────── */
function HelplineRow({ label, number, T }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.55rem 1rem",
      borderBottom: `1px solid ${T.borderLight}`,
    }}>
      <span style={{ fontSize: "0.78rem", color: T.textSub }}>{label}</span>
      <a href={`tel:${number}`} style={{
        fontSize: "0.82rem", fontWeight: 700, color: T.accent,
        textDecoration: "none", letterSpacing: "0.01em",
      }}>
        {number}
      </a>
    </div>
  );
}

/* ── Tip row ───────────────────────────────────────────────────────────────── */
function TipRow({ text, T }) {
  return (
    <div style={{
      display: "flex", gap: "0.55rem", alignItems: "flex-start",
      padding: "0.55rem 1rem",
      borderBottom: `1px solid ${T.borderLight}`,
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.warning} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M12 8v4M12 16h.01"/>
      </svg>
      <span style={{ fontSize: "0.76rem", color: T.textSub, lineHeight: 1.55 }}>{text}</span>
    </div>
  );
}

/* ── Section heading inside a card ────────────────────────────────────────── */
function CardHeading({ label, icon, T, color }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.5rem",
      padding: "0.7rem 1rem",
      borderBottom: `1px solid ${T.border}`,
      background: T.bgAlt,
    }}>
      {icon}
      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: color || T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function Rescue() {
  const { T } = useT();
  const vp = useViewport();
  const { stats } = usePlatformStats();
  const [modalOpen, setModalOpen] = useState(false);
  const [rescueId, setRescueId] = useState(generateRescueId());

  const handleFormSuccess = () => {
    setRescueId(generateRescueId());
    setModalOpen(true);
  };

  const SAMPLE_NGOS = [
    { name: "Animal Aid Unlimited",  city: "Udaipur",   specialty: "Rescue & Rehab" },
    { name: "CARE India",            city: "Mumbai",    specialty: "Emergency Rescue" },
    { name: "Wildlife SOS",          city: "Delhi",     specialty: "Wildlife Rescue" },
    { name: "Blue Cross of India",   city: "Chennai",   specialty: "Shelter & Adoption" },
  ];

  const TIPS = [
    "Stay at a safe distance — do not approach aggressive or wild animals.",
    "Do not move injured animals unless they are in immediate danger.",
    "Provide clear, well-lit photos of the animal and its injuries.",
    "Note the exact location — a landmark or pin helps responders arrive faster.",
    "Stay on-site if safe to do so to guide the rescue team.",
  ];

  const HELPLINES = [
    { label: "Animal Helpline",  number: "1962" },
    { label: "Wildlife SOS",     number: "9871963535" },
    { label: "PETA India",       number: "9820122602" },
  ];

  return (
    <>
      <main style={{ width: "100%", background: T.bg, minHeight: "100svh", overflowX: "hidden" }}>

        {/* ── COMMAND CENTER HEADER ─────────────────────────────────────────── */}
        <div style={{
          background: T.bgAlt,
          borderBottom: `1px solid ${T.border}`,
          paddingTop: vp.mobile ? 72 : 80,
        }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto",
            padding: "1.5rem clamp(1.25rem, 4vw, 3rem) 1.25rem",
          }}>
            <div style={{
              display: "flex", alignItems: vp.mobile ? "flex-start" : "center",
              justifyContent: "space-between",
              flexDirection: vp.mobile ? "column" : "row",
              gap: "1rem",
            }}>
              {/* Left: title + badge */}
              <div>
                {/* Live badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.22rem 0.7rem",
                  borderRadius: "var(--radius-full)",
                  background: `${T.danger}10`,
                  border: `1px solid ${T.dangerBorder}`,
                  marginBottom: "0.65rem",
                }}>
                  <motion.span
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: T.danger, flexShrink: 0 }}
                  />
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, color: T.danger, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                    Live · Emergency Dispatch
                  </span>
                </div>

                <h1 style={{
                  fontSize: vp.mobile ? "1.5rem" : "clamp(1.6rem, 2.8vw, 2rem)",
                  fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.1,
                  color: T.textHeading, margin: "0 0 0.45rem",
                }}>
                  Emergency Rescue Request
                </h1>
                <p style={{ fontSize: "0.88rem", color: T.textSub, margin: 0, lineHeight: 1.6, maxWidth: 480 }}>
                  Report an injured, abandoned, trapped, or endangered animal. Your report is dispatched to the nearest verified NGO and on-duty volunteer within seconds.
                </p>
              </div>

              {/* Right: stats + AI scan link */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: vp.mobile ? "flex-start" : "flex-end", gap: "0.75rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <StatChip T={T} value={`${stats.avgResponseMinutes || "<5"}m`} label="Avg Response" />
                  <StatChip T={T} value={formatStat(stats.totalNgos)} label="NGOs Active" />
                  <StatChip T={T} value={formatStat(stats.totalRescues)} label="Rescues" />
                </div>
                <Link to="/ai-health" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.42rem 0.9rem",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${T.border}`,
                  background: T.bgCard,
                  color: T.textSub, fontSize: "0.78rem", fontWeight: 600,
                  textDecoration: "none",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  AI Health Scan
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: vp.mobile ? "1.25rem 1rem 3rem" : "1.75rem clamp(1.25rem, 4vw, 3rem) 3rem",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr" : "1fr 340px",
            gap: "1.5rem",
            alignItems: "start",
          }}>

            {/* ── LEFT: Emergency Form ─────────────────────────────────────── */}
            <EmergencyForm onSuccess={handleFormSuccess} />

            {/* ── RIGHT: Sidebar ───────────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Nearby NGOs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <SideCard T={T}>
                  <CardHeading T={T} label="Rescue Partners" color={T.accent} icon={
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  } />
                  {SAMPLE_NGOS.map(ngo => (
                    <NgoCard key={ngo.name} T={T} {...ngo} />
                  ))}
                  <div style={{ padding: "0.65rem 1rem" }}>
                    <Link to="/ngos" style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem",
                      padding: "0.55rem",
                      borderRadius: "var(--radius-sm)",
                      border: `1px solid ${T.border}`,
                      background: "transparent",
                      color: T.textSub, fontSize: "0.76rem", fontWeight: 600,
                      textDecoration: "none",
                      transition: "background 0.14s, color 0.14s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.bgAlt; e.currentTarget.style.color = T.text; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textSub; }}
                    >
                      View all rescue partners
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </SideCard>
              </motion.div>

              {/* Emergency helplines */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <SideCard T={T} accent={T.danger}>
                  <CardHeading T={T} label="Emergency Helplines" color={T.danger} icon={
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.danger} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  } />
                  {HELPLINES.map(h => <HelplineRow key={h.label} T={T} {...h} />)}
                </SideCard>
              </motion.div>

              {/* Emergency tips */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                <SideCard T={T} accent={T.warning}>
                  <CardHeading T={T} label="While Help Is On the Way" color={T.warning} icon={
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.warning} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  } />
                  {TIPS.map(tip => <TipRow key={tip} T={T} text={tip} />)}
                </SideCard>
              </motion.div>
            </div>
          </div>

          {/* ── AI Scanner below the fold ──────────────────────────────────── */}
          <div style={{ marginTop: "2rem" }}>
            <AIScanner id="ai-scanner" />
          </div>
        </div>
      </main>

      <RescueModal
        open={modalOpen}
        rescueId={rescueId}
        onClose={() => setModalOpen(false)}
        onViewTimeline={() => setModalOpen(false)}
      />
    </>
  );
}
