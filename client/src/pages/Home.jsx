import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useT } from "../context/ThemeContext";
import useViewport from "../hooks/useViewport";
import { usePlatformStats, formatStat } from "../hooks/usePlatformStats";
import { getNgos } from "../services/ngoService";

const CAPABILITIES = [
  {
    to: "/rescue", label: "Report Emergency",
    desc: "Submit a rescue request — dispatched to the nearest NGO in seconds.",
    accent: "danger",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    to: "/ai-health", label: "AI Health Scan",
    desc: "Upload a photo — detect species, injuries, and triage urgency.",
    accent: "accent",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3.5"/></svg>,
  },
  {
    to: "/adoption", label: "Adoption Hub",
    desc: "Browse rescued animals matched to your lifestyle via AI scoring.",
    accent: "success",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
  {
    to: "/ngos", label: "NGO Network",
    desc: "Verified rescue organizations — search by city, specialty, or zone.",
    accent: "info",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
];

const STEPS = [
  { num: "01", title: "Report", desc: "Submit location, photo, and severity in under 30 seconds." },
  { num: "02", title: "Coordinate", desc: "Nearest verified NGO and on-duty volunteer are auto-dispatched." },
  { num: "03", title: "Rescue", desc: "Live tracking from acknowledgment to recovery." },
];

function CapabilityCard({ to, label, desc, accent, icon, T }) {
  const color = accent === "danger" ? T.danger : accent === "success" ? T.success : accent === "info" ? T.info : T.accent;
  return (
    <Link
      to={to}
      style={{ display: "flex", flexDirection: "column", gap: "0.85rem", padding: "1rem 1.1rem", borderRadius: 10, border: `1px solid ${T.border}`, background: T.bgCard, boxShadow: T.shadowSm, textDecoration: "none", color: "inherit", transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = T.shadowMd; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = T.shadowSm; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: `${color}14`, color }}>{icon}</div>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </div>
      <div>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: T.text, margin: "0 0 0.3rem", letterSpacing: "-0.015em" }}>{label}</h3>
        <p style={{ fontSize: "0.78rem", color: T.textSub, margin: 0, lineHeight: 1.5 }}>{desc}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const { T } = useT();
  const vp = useViewport();
  const { stats } = usePlatformStats();
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    getNgos({ limit: 4 }).then(data => setNgos(Array.isArray(data) ? data.slice(0, 4) : [])).catch(() => {});
  }, []);

  const navH = vp.mobile ? 56 : 64;

  return (
    <main style={{ width: "100%", background: T.bg, overflowX: "hidden", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{ width: "100%", background: T.bgAlt, borderBottom: `1px solid ${T.border}`, paddingTop: navH }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: vp.mobile ? "2rem 1rem 1.75rem" : "3rem clamp(1.25rem, 4vw, 3rem) 2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.25rem 0.65rem", borderRadius: 9999, border: `1px solid ${T.danger}33`, background: `${T.danger}10`, marginBottom: "1.25rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.danger, animation: "rq-pulse-dot 1.5s ease-in-out infinite" }} />
            <span style={{ fontSize: "0.66rem", fontWeight: 700, color: T.danger, letterSpacing: "0.06em", textTransform: "uppercase" }}>Live · Animal Rescue Platform</span>
          </div>

          <h1 style={{ fontSize: vp.mobile ? "1.85rem" : "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: T.textHeading, margin: "0 0 0.75rem", letterSpacing: "-0.035em", lineHeight: 1.1 }}>
            ResQNet
          </h1>
          <p style={{ fontSize: vp.mobile ? "0.9rem" : "1rem", color: T.textSub, margin: "0 0 1.75rem", maxWidth: 520, lineHeight: 1.65 }}>
            Animal rescue intelligence — coordinate emergency response, AI health triage, NGO dispatch, and adoption in one platform.
          </p>

          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <Link to="/rescue" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0.6rem 1.1rem", borderRadius: 8, background: T.danger, color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", boxShadow: `0 1px 4px ${T.danger}40` }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              Report Animal
            </Link>
            <Link to="/ngos" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0.6rem 1.1rem", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgCard, color: T.text, fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
              Find NGOs
            </Link>
          </div>

          {/* Stat row */}
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[
              { v: formatStat(stats.totalRescues), l: "rescues" },
              { v: formatStat(stats.totalNgos), l: "NGOs" },
              { v: `${stats.avgResponseMinutes || 0}m`, l: "avg response" },
              { v: formatStat(stats.citiesCovered), l: "cities" },
            ].map((s, i) => (
              <div key={s.l} style={{ display: "flex", alignItems: "center", gap: i === 0 ? 0 : "1.5rem" }}>
                {i > 0 && <div style={{ width: 1, height: 20, background: T.border, marginRight: "1.5rem" }} />}
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: T.text, letterSpacing: "-0.025em", lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: "0.65rem", color: T.textMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: vp.mobile ? "1.5rem 1rem" : "2rem clamp(1.25rem, 4vw, 3rem)", display: "grid", gap: "2rem" }}>

        {/* ── Quick Actions ── */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.72rem", fontWeight: 700, color: T.textSub, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>Modules</h2>
            <span style={{ fontSize: "0.7rem", color: T.textMuted }}>Pick a workflow</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.85rem" }}>
            {CAPABILITIES.map(c => <CapabilityCard key={c.to} {...c} T={T} />)}
          </div>
        </div>

        {/* ── How It Works ── */}
        <div style={{ padding: "1.25rem 1.5rem", borderRadius: 12, border: `1px solid ${T.border}`, background: T.bgCard }}>
          <h2 style={{ fontSize: "0.72rem", fontWeight: 700, color: T.textSub, margin: "0 0 1rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "repeat(3, 1fr)", gap: vp.mobile ? "1rem" : "0", position: "relative" }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", paddingRight: !vp.mobile && i < 2 ? "1.5rem" : 0, borderRight: !vp.mobile && i < 2 ? `1px solid ${T.border}` : "none", paddingLeft: !vp.mobile && i > 0 ? "1.5rem" : 0 }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 800, color: T.accent, letterSpacing: "0.04em", minWidth: 24, paddingTop: 2 }}>{s.num}</span>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: T.text, marginBottom: "0.2rem" }}>{s.title}</div>
                  <div style={{ fontSize: "0.76rem", color: T.textSub, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Verified NGOs ── */}
        {ngos.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h2 style={{ fontSize: "0.72rem", fontWeight: 700, color: T.textSub, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>Verified NGOs</h2>
              <Link to="/ngos" style={{ fontSize: "0.72rem", color: T.accent, textDecoration: "none", fontWeight: 600 }}>View all</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "0.75rem" }}>
              {ngos.map((ngo, i) => {
                const name = ngo?.fullName || ngo?.ngoProfile?.organizationName || "Verified NGO";
                const city = ngo?.location?.city || ngo?.ngoProfile?.city || "India";
                return (
                  <Link key={ngo._id || i} to="/ngos" style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.85rem 1rem", borderRadius: 10, border: `1px solid ${T.border}`, background: T.bgCard, textDecoration: "none", color: "inherit", transition: "border-color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
                    onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: T.accentPale, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, flexShrink: 0 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 4l9 5.5V20H3V9.5z"/></svg>
                      </div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 600, color: T.success, display: "flex", alignItems: "center", gap: 3 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                        Verified
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{name}</div>
                    <div style={{ fontSize: "0.7rem", color: T.textMuted }}>{city}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Operator row ── */}
        <div style={{ padding: "0.85rem 1rem", borderRadius: 10, background: T.bgAlt, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.text }}>Run an NGO or volunteer with us?</div>
            <div style={{ fontSize: "0.72rem", color: T.textMuted }}>Register to receive rescue alerts in your zone.</div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link to="/ngo-register" style={{ padding: "0.45rem 0.85rem", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgCard, color: T.text, fontWeight: 600, fontSize: "0.76rem", textDecoration: "none" }}>Register NGO</Link>
            <Link to="/login" style={{ padding: "0.45rem 0.85rem", borderRadius: 8, background: T.accent, color: "#fff", fontWeight: 600, fontSize: "0.76rem", textDecoration: "none" }}>Sign in</Link>
          </div>
        </div>

      </div>
    </main>
  );
}
