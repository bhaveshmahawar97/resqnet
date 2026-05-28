/**
 * ResQNet Landing Page — Phase 2 Premium Redesign
 *
 * Architecture: 9 self-contained section components.
 * Dark surface (hero/NGO/CTA) use HERO.* constants.
 * All light-mode sections use T.* theme tokens only.
 * No hardcoded hex values outside the HERO palette block.
 */

import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { useT, THEME } from "../context/ThemeContext";
import useViewport from "../hooks/useViewport";
import { usePlatformStats, formatStat } from "../hooks/usePlatformStats";
import { getNgos } from "../services/ngoService";

/* ─────────────────────────────────────────────────────────────────────────────
   HERO SURFACE PALETTE
   Always-dark sections (Hero, NGOShowcase, CtaBanner) use these constants.
   Values chosen for contrast on a #0A1120 dark surface — not theme tokens.
   All other sections use T.* exclusively.
───────────────────────────────────────────────────────────────────────────── */
const H = {
  bg:        "#0A1120",
  bg2:       "#0F1A2E",
  card:      "rgba(255,255,255,0.04)",
  cardHov:   "rgba(255,255,255,0.07)",
  border:    "rgba(255,255,255,0.09)",
  borderHov: "rgba(255,255,255,0.18)",
  fg:        "rgba(255,255,255,0.92)",
  fgSub:     "rgba(255,255,255,0.58)",
  fgMuted:   "rgba(255,255,255,0.35)",
  // Semantic on dark surface
  accent:    "#60A5FA",   // blue-400 — readable on dark
  success:   "#34D399",   // emerald-400
  warning:   "#FBBF24",   // amber-400
  danger:    "#F87171",   // red-400
};

/* ─────────────────────────────────────────────────────────────────────────────
   MOTION VARIANTS
───────────────────────────────────────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

const vFadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease } },
});

const vFade = (delay = 0) => ({
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5, delay } },
});

const vSlideUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease } },
});

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL REVEAL WRAPPER
───────────────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, y = 24, style = {}, once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-56px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      variants={vFadeUp(delay)}
      initial={reduce ? "show" : "hidden"}
      animate={inView ? "show" : "hidden"}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION LABEL — shared eyebrow + heading block
───────────────────────────────────────────────────────────────────────────── */
function SectionLabel({ eyebrow, title, subtitle, center = true, light = false, T }) {
  const fg = light ? H.fg : T.textHeading;
  const fgSub = light ? H.fgSub : T.textSub;
  const accentColor = light ? H.accent : T.accent;

  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
      {eyebrow && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          padding: "0.28rem 0.8rem", borderRadius: "var(--radius-full)",
          border: `1px solid ${accentColor}30`,
          background: `${accentColor}10`,
          marginBottom: "1rem",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: accentColor, flexShrink: 0 }} />
          <span style={{ fontSize: "0.62rem", fontWeight: 700, color: accentColor, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2 style={{
        fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)", fontWeight: 800,
        letterSpacing: "-0.035em", lineHeight: 1.12, margin: "0 0 0.85rem", color: fg,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)", color: fgSub,
          lineHeight: 1.7, maxWidth: 560, margin: center ? "0 auto" : 0,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 1 — HERO
───────────────────────────────────────────────────────────────────────────── */
function HeroSection({ vp, stats }) {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  // Animate the ops card status cycling
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3200);
    return () => clearInterval(id);
  }, []);

  const TRUST = [
    { label: "Emergency Rescue Dispatch",  icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
    { label: "Verified NGO Network",       icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
    { label: "AI Health Assessment",       icon: "M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M12 12m-3.5 0a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0" },
    { label: "Adoption Support",           icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" },
  ];

  const OPS = [
    { id: "RQ-2847", animal: "Injured stray dog", loc: "Bandra West, Mumbai", sev: "Critical", sevColor: H.danger,  status: "NGO Dispatched",   statusColor: H.warning },
    { id: "RQ-2846", animal: "Abandoned cat",     loc: "Koramangala, Bengaluru", sev: "Medium",   sevColor: H.warning, status: "On Route",        statusColor: H.accent  },
    { id: "RQ-2845", animal: "Injured cow",       loc: "Andheri East, Mumbai",  sev: "High",     sevColor: H.warning, status: "Volunteer On-Site", statusColor: H.accent  },
    { id: "RQ-2844", animal: "Rescued puppy",     loc: "HSR Layout, Bengaluru", sev: "Low",      sevColor: H.success, status: "Recovered",       statusColor: H.success },
  ];

  return (
    <section style={{
      position: "relative", width: "100%", overflow: "hidden", background: H.bg,
      minHeight: vp.mobile ? "auto" : "100svh", display: "flex", alignItems: "center",
    }}>
      {/* Layered background */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1400&q=50&auto=format&fit=crop')",
        backgroundSize: "cover", backgroundPosition: "center 40%",
        opacity: 0.05, filter: "blur(1px) grayscale(60%)",
      }} />
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 70% 55% at 10% 50%, ${H.accent}16 0%, transparent 50%),
                     radial-gradient(ellipse 50% 40% at 90% 50%, ${H.success}10 0%, transparent 55%),
                     linear-gradient(180deg, ${H.bg} 0%, #050D1F 100%)`,
      }} />
      {/* Dot grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(${H.border} 1px, transparent 1px)`,
        backgroundSize: "36px 36px",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 1200, margin: "0 auto",
        padding: vp.mobile ? "6rem 1.25rem 3rem" : "0 clamp(1.5rem, 5vw, 3.5rem)",
        display: "grid",
        gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr",
        gap: vp.mobile ? "2.5rem" : "3rem",
        alignItems: "center",
        minHeight: vp.mobile ? "auto" : "100svh",
      }}>

        {/* LEFT */}
        <div>
          {/* Live pill */}
          <motion.div variants={vFade(0)} initial={reduce ? "show" : "hidden"} animate="show"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.45rem",
              padding: "0.3rem 0.85rem", borderRadius: "var(--radius-full)",
              border: `1px solid ${H.danger}40`, background: `${H.danger}10`, marginBottom: "1.5rem",
            }}>
            <motion.span
              animate={reduce ? {} : { opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: H.danger, flexShrink: 0 }}
            />
            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: H.danger, letterSpacing: "0.09em", textTransform: "uppercase" }}>
              Live · Emergency Response Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={vFadeUp(0.08)} initial={reduce ? "show" : "hidden"} animate="show"
            style={{
              fontSize: vp.mobile ? "clamp(2rem,8vw,2.75rem)" : "clamp(2.4rem,4vw,3.5rem)",
              fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.04em", color: H.fg,
              margin: "0 0 1.1rem",
            }}>
            Connecting Communities, NGOs, and Volunteers to{" "}
            <span style={{ color: H.accent }}>Save Animal Lives.</span>
          </motion.h1>

          <motion.p variants={vFadeUp(0.16)} initial={reduce ? "show" : "hidden"} animate="show"
            style={{
              fontSize: vp.mobile ? "0.92rem" : "1.025rem", color: H.fgSub,
              lineHeight: 1.72, marginBottom: "2rem", maxWidth: 480,
            }}>
            Report emergencies, locate nearby rescue partners, assess animal health, and track rescue missions in real time.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={vFadeUp(0.22)} initial={reduce ? "show" : "hidden"} animate="show"
            style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.25rem" }}>
            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link to="/rescue" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.78rem 1.5rem", borderRadius: "var(--radius-md)",
                background: H.danger, color: "#fff", fontWeight: 700,
                fontSize: "0.9rem", textDecoration: "none", letterSpacing: "-0.01em",
                boxShadow: `0 4px 20px ${H.danger}40`,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                Request Emergency Rescue
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link to="/ngos" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.78rem 1.4rem", borderRadius: "var(--radius-md)",
                border: `1px solid ${H.border}`, background: H.card,
                color: H.fg, fontWeight: 600, fontSize: "0.9rem",
                textDecoration: "none", backdropFilter: "blur(12px)",
              }}>
                Locate Rescue Partners
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div variants={vFadeUp(0.3)} initial={reduce ? "show" : "hidden"} animate="show"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem" }}>
            {TRUST.map(t => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={H.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span style={{ fontSize: "0.76rem", color: H.fgMuted, fontWeight: 500 }}>{t.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Operations card */}
        <motion.div variants={vSlideUp(0.2)} initial={reduce ? "show" : "hidden"} animate="show">
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${H.border}`,
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}>
            {/* Card header */}
            <div style={{
              padding: "0.85rem 1.1rem",
              borderBottom: `1px solid ${H.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(255,255,255,0.02)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  {["#F87171","#FBBF24","#34D399"].map(c => (
                    <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.65 }} />
                  ))}
                </div>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: H.fgMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Rescue Operations Center
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <motion.span
                  animate={reduce ? {} : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: H.success }}
                />
                <span style={{ fontSize: "0.62rem", color: H.success, fontWeight: 600 }}>LIVE</span>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: `1px solid ${H.border}` }}>
              {[
                { v: formatStat(stats.totalRescues),   l: "Rescues" },
                { v: formatStat(stats.totalNgos),      l: "NGOs Active" },
                { v: `${stats.avgResponseMinutes||0}m`, l: "Avg Response" },
              ].map((s, i) => (
                <div key={s.l} style={{
                  padding: "0.75rem 1rem", textAlign: "center",
                  borderRight: i < 2 ? `1px solid ${H.border}` : "none",
                }}>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: H.fg, letterSpacing: "-0.03em" }}>{s.v}</div>
                  <div style={{ fontSize: "0.57rem", color: H.fgMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Queue */}
            <div>
              <AnimatePresence mode="sync">
                {OPS.map((op, i) => (
                  <motion.div key={op.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.09, duration: 0.45, ease }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.7rem",
                      padding: "0.7rem 1.1rem",
                      borderBottom: i < OPS.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none",
                    }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                      background: op.sevColor, boxShadow: `0 0 8px ${op.sevColor}80`,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.18rem" }}>
                        <span style={{ fontSize: "0.6rem", fontFamily: "monospace", color: H.fgMuted }}>{op.id}</span>
                        <span style={{
                          fontSize: "0.57rem", fontWeight: 700, textTransform: "uppercase",
                          color: op.sevColor, background: `${op.sevColor}15`,
                          border: `1px solid ${op.sevColor}30`,
                          padding: "0.08rem 0.45rem", borderRadius: "var(--radius-full)",
                        }}>{op.sev}</span>
                      </div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: H.fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {op.animal}
                      </div>
                      <div style={{ fontSize: "0.64rem", color: H.fgMuted, marginTop: "0.1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {op.loc}
                      </div>
                    </div>
                    <div style={{
                      padding: "0.22rem 0.6rem", borderRadius: "var(--radius-sm)",
                      fontSize: "0.6rem", fontWeight: 700, flexShrink: 0,
                      color: op.statusColor, background: `${op.statusColor}12`,
                      border: `1px solid ${op.statusColor}28`,
                    }}>
                      {op.status}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer bar */}
            <div style={{
              padding: "0.65rem 1.1rem", borderTop: `1px solid ${H.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(255,255,255,0.015)",
            }}>
              <span style={{ fontSize: "0.62rem", color: H.fgMuted }}>Powered by ResQNet AI · India</span>
              <Link to="/rescue" style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                fontSize: "0.67rem", fontWeight: 700, color: H.accent, textDecoration: "none",
              }}>
                Report now
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 2 — QUICK ACTIONS
───────────────────────────────────────────────────────────────────────────── */
function QuickActionsSection({ vp, T }) {
  const ACTIONS = [
    {
      to: "/rescue", label: "Request Emergency Rescue",
      desc: "File a rescue report — AI dispatches the nearest verified NGO and on-duty volunteer in under a minute.",
      color: T.danger, bg: T.dangerPale, border: T.dangerBorder,
      badge: "Priority",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
    },
    {
      to: "/ai-health", label: "Analyze Health Condition",
      desc: "Upload a photo for instant species identification, injury detection, and AI-powered triage severity.",
      color: T.accent, bg: T.accentPale, border: `${T.accent}30`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
          <circle cx="12" cy="12" r="3.5"/>
        </svg>
      ),
    },
    {
      to: "/ngos", label: "Locate Rescue Partners",
      desc: "Find verified rescue organizations near you — searchable by city, specialty, and response zone.",
      color: T.info, bg: T.infoPale, border: T.infoBorder,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      to: "/adoption", label: "Give an Animal a Home",
      desc: "Browse rescued animals and get matched to a compatible companion through AI lifestyle scoring.",
      color: T.success, bg: T.successPale, border: T.successBorder,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
    },
  ];

  return (
    <section style={{ background: T.bg, padding: "clamp(3rem,6vw,5rem) 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem,4vw,3rem)" }}>
        <Reveal>
          <SectionLabel
            T={T}
            eyebrow="Platform Modules"
            title="Everything You Need to Help Animals"
            subtitle="Four integrated workflows — from emergency dispatch to long-term adoption care."
          />
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr 1fr" : "repeat(4,1fr)",
          gap: "1rem",
        }}>
          {ACTIONS.map((a, i) => (
            <Reveal key={a.to} delay={i * 0.07}>
              <motion.div whileHover={{ y: -3 }} style={{ height: "100%" }}>
                <Link to={a.to} style={{
                  display: "flex", flexDirection: "column", gap: "1rem",
                  padding: "1.4rem", borderRadius: "var(--radius-lg)",
                  border: `1px solid ${T.border}`,
                  background: T.bgCard, textDecoration: "none", color: "inherit",
                  height: "100%", boxSizing: "border-box",
                  boxShadow: T.shadowSm,
                  transition: "border-color 0.18s, box-shadow 0.18s",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = a.color;
                    e.currentTarget.style.boxShadow = `0 8px 28px ${a.color}18`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.boxShadow = T.shadowSm;
                  }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: "var(--radius-md)",
                      background: a.bg, border: `1px solid ${a.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: a.color, flexShrink: 0,
                    }}>
                      {a.icon}
                    </div>
                    {a.badge && (
                      <span style={{
                        fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "0.06em", color: a.color,
                        background: a.bg, border: `1px solid ${a.border}`,
                        padding: "0.18rem 0.55rem", borderRadius: "var(--radius-full)",
                      }}>
                        {a.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: T.text, margin: "0 0 0.4rem", letterSpacing: "-0.018em" }}>
                      {a.label}
                    </h3>
                    <p style={{ fontSize: "0.79rem", color: T.textSub, margin: 0, lineHeight: 1.62 }}>
                      {a.desc}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: a.color, fontSize: "0.75rem", fontWeight: 700 }}>
                    Get started
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 3 — HOW IT WORKS
───────────────────────────────────────────────────────────────────────────── */
function HowItWorksSection({ vp, T }) {
  const STEPS = [
    { n: "01", title: "Report Animal",      desc: "Submit a rescue report with location, photo, and severity assessment in under 30 seconds.",    color: T.danger  },
    { n: "02", title: "NGO Receives Alert", desc: "Nearest verified NGO is auto-assigned. Rescue coordinators are notified instantly via app.",   color: T.warning },
    { n: "03", title: "Volunteer Assigned", desc: "A trained volunteer is dispatched and coordinates on-site with medical-grade field support.",   color: T.accent  },
    { n: "04", title: "Animal Rescued",     desc: "The animal is secured, transported, and receives immediate care. Status tracked in real time.", color: T.info    },
    { n: "05", title: "Recovery & Adoption","desc":"Animal receives rehabilitation care and is assessed for adoption through AI compatibility matching.",color: T.success },
  ];

  return (
    <section style={{ background: T.bgAlt, padding: "clamp(3rem,6vw,5rem) 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem,4vw,3rem)" }}>
        <Reveal>
          <SectionLabel
            T={T}
            eyebrow="Rescue Workflow"
            title="How ResQNet Works"
            subtitle="Every step tracked, every role coordinated — from first report to full recovery."
          />
        </Reveal>

        {/* Timeline grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: vp.mobile ? "1fr" : "repeat(5,1fr)",
          gap: "1px", background: T.border, borderRadius: "var(--radius-lg)", overflow: "hidden",
          border: `1px solid ${T.border}`,
        }}>
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div style={{
                background: T.bgCard, padding: "1.5rem 1.25rem", height: "100%",
                display: "flex", flexDirection: "column", gap: "0.85rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "var(--radius-md)",
                    background: `${s.color}10`, border: `1px solid ${s.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: "1.5rem", fontWeight: 900, color: `${s.color}20`, letterSpacing: "-0.04em" }}>{s.n}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: T.text, margin: "0 0 0.35rem", letterSpacing: "-0.015em" }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: "0.76rem", color: T.textSub, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && !vp.mobile && (
                  <div style={{ position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)", zIndex: 2 }} />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 4 — SERVICES
───────────────────────────────────────────────────────────────────────────── */
function ServicesSection({ vp, T }) {
  const SVCS = [
    { title: "Animal Rescue",      desc: "24/7 emergency dispatch with AI routing to the nearest verified NGO and on-duty volunteer.",        color: T.danger  },
    { title: "NGO Coordination",   desc: "Real-time case assignment, volunteer management, and operations dashboards for rescue orgs.",        color: T.accent  },
    { title: "Volunteer Network",  desc: "Accept missions, submit geo-tagged field reports, and coordinate with NGOs from your mobile device.", color: T.info    },
    { title: "AI Health Assessment","desc":"Upload a photo for instant species ID, injury detection, and clinical-grade triage severity scoring.",  color: T.accent  },
    { title: "Animal Adoption",    desc: "Rescued animals matched to compatible adopters via AI lifestyle scoring and compatibility analysis.",  color: T.success },
    { title: "Rescue Tracking",    desc: "Real-time case status from first report to full recovery — every milestone timestamped.",            color: T.warning },
  ];

  return (
    <section style={{ background: T.bg, padding: "clamp(3rem,6vw,5rem) 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem,4vw,3rem)" }}>
        <Reveal>
          <SectionLabel
            T={T}
            eyebrow="Platform Services"
            title="Built for Every Role in the Rescue Chain"
            subtitle="From citizens who spot an animal in distress to NGOs running operations — ResQNet coordinates everyone."
          />
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr 1fr" : "repeat(3,1fr)",
          gap: "1rem",
        }}>
          {SVCS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.055}>
              <div style={{
                padding: "1.5rem", borderRadius: "var(--radius-lg)",
                border: `1px solid ${T.border}`, background: T.bgCard,
                boxShadow: T.shadowSm, height: "100%", boxSizing: "border-box",
                transition: "border-color 0.18s, box-shadow 0.18s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${s.color}35`;
                  e.currentTarget.style.boxShadow = `0 6px 24px ${s.color}12`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.boxShadow = T.shadowSm;
                }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "var(--radius-md)",
                  background: `${s.color}10`, border: `1px solid ${s.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1rem",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: T.text, margin: "0 0 0.45rem", letterSpacing: "-0.015em" }}>{s.title}</h3>
                <p style={{ fontSize: "0.79rem", color: T.textSub, margin: 0, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 5 — VERIFIED NGO SHOWCASE
───────────────────────────────────────────────────────────────────────────── */
function NgoSection({ vp, ngos }) {
  return (
    <section style={{ background: H.bg, padding: "clamp(3rem,6vw,5rem) 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 55% 40% at 50% 55%, ${H.accent}0D 0%, transparent 65%)`,
      }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem,4vw,3rem)" }}>
        <Reveal>
          <SectionLabel
            T={null} light
            eyebrow="Verified Partners"
            title="NGO Network"
            subtitle="Rescue organizations independently verified by ResQNet — serving communities across India."
          />
        </Reveal>

        {ngos.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: vp.mobile ? "1fr 1fr" : vp.tablet ? "repeat(3,1fr)" : "repeat(4,1fr)",
            gap: "0.85rem",
          }}>
            {ngos.map((ngo, i) => {
              const name = ngo?.ngoProfile?.organizationName || ngo?.fullName || ngo?.name || "Verified NGO";
              const city = ngo?.ngoProfile?.city || ngo?.location?.city || ngo?.city || "India";
              const type = (ngo?.ngoProfile?.specialties || ngo?.specialties || [])[0] || "Rescue";
              return (
                <Reveal key={ngo._id || i} delay={i * 0.06}>
                  <Link to="/ngos" style={{
                    display: "flex", flexDirection: "column", gap: "0.7rem",
                    padding: "1rem", borderRadius: "var(--radius-lg)",
                    border: `1px solid ${H.border}`,
                    background: H.card, textDecoration: "none",
                    transition: "border-color 0.18s, background 0.18s",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = `${H.accent}50`;
                      e.currentTarget.style.background = H.cardHov;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = H.border;
                      e.currentTarget.style.background = H.card;
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "var(--radius-md)",
                        background: `${H.accent}18`, border: `1px solid ${H.accent}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: H.accent, fontWeight: 800, fontSize: "0.8rem", flexShrink: 0,
                      }}>
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: H.fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                        <div style={{ fontSize: "0.65rem", color: H.fgMuted, marginTop: 1 }}>{city}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem" }}>
                      <span style={{
                        fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                        color: H.success, background: `${H.success}15`, border: `1px solid ${H.success}28`,
                        padding: "0.18rem 0.55rem", borderRadius: "var(--radius-full)",
                      }}>
                        {type}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={H.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
                        </svg>
                        <span style={{ fontSize: "0.58rem", color: H.success, fontWeight: 700 }}>Verified</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Reveal>
            <div style={{
              textAlign: "center", padding: "3rem 1.5rem",
              border: `1px dashed ${H.border}`, borderRadius: "var(--radius-lg)",
              background: H.card, color: H.fgMuted, fontSize: "0.85rem",
            }}>
              NGO network loading…
            </div>
          </Reveal>
        )}

        <Reveal delay={0.15}>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link to="/ngos" style={{
              display: "inline-flex", alignItems: "center", gap: "0.45rem",
              padding: "0.7rem 1.5rem", borderRadius: "var(--radius-md)",
              border: `1px solid ${H.border}`, background: H.card,
              color: H.fg, fontWeight: 600, fontSize: "0.88rem",
              textDecoration: "none", backdropFilter: "blur(12px)",
              transition: "background 0.15s, border-color 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = H.cardHov; e.currentTarget.style.borderColor = H.borderHov; }}
              onMouseLeave={e => { e.currentTarget.style.background = H.card; e.currentTarget.style.borderColor = H.border; }}>
              View all verified NGOs
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 6 — MISSION / IMPACT
───────────────────────────────────────────────────────────────────────────── */
function MissionSection({ vp, T, stats }) {
  const hasMeaningfulStats = stats.totalRescues > 0 || stats.totalNgos > 0;

  const PILLARS = [
    { title: "Zero Preventable Deaths",  desc: "Every report reaches a verified NGO. Every case is tracked until resolved.",                     color: T.danger  },
    { title: "Community-Powered Rescue", desc: "Citizens, volunteers, and NGOs work inside one coordinated operational platform.",               color: T.accent  },
    { title: "AI-Augmented Triage",      desc: "Computer vision ensures no injury goes undetected — every case clinically assessed within seconds.",color: T.success },
  ];

  return (
    <section style={{ background: T.bgAlt, padding: "clamp(3rem,6vw,5rem) 0", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem,4vw,3rem)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: vp.mobile ? "1fr" : "1.1fr 1fr",
          gap: "clamp(2.5rem,5vw,4.5rem)",
          alignItems: "center",
        }}>
          {/* Left */}
          <div>
            <Reveal>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.28rem 0.8rem", borderRadius: "var(--radius-full)",
                border: `1px solid ${T.accent}28`, background: T.accentPale, marginBottom: "1.25rem",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent }} />
                <span style={{ fontSize: "0.62rem", fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>Our Mission</span>
              </div>
            </Reveal>
            <Reveal delay={0.07}>
              <h2 style={{
                fontSize: "clamp(1.7rem,3.5vw,2.5rem)", fontWeight: 900,
                letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 1rem", color: T.textHeading,
              }}>
                Every Animal Deserves{" "}
                <span style={{ color: T.accent }}>a Chance to Live.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.13}>
              <p style={{ fontSize: "0.9rem", color: T.textSub, lineHeight: 1.75, marginBottom: "1.75rem" }}>
                ResQNet eliminates the coordination gap in animal rescue — connecting the person who spots an animal in distress with the organization equipped to help, in seconds.
              </p>
            </Reveal>

            {/* Real stats only */}
            {hasMeaningfulStats && (
              <Reveal delay={0.19}>
                <div style={{ display: "flex", gap: "2.25rem", paddingTop: "1.5rem", borderTop: `1px solid ${T.border}`, flexWrap: "wrap" }}>
                  {stats.totalRescues > 0 && (
                    <div>
                      <div style={{ fontSize: "2rem", fontWeight: 900, color: T.text, letterSpacing: "-0.045em", lineHeight: 1 }}>{formatStat(stats.totalRescues)}</div>
                      <div style={{ fontSize: "0.7rem", color: T.textMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Rescue Cases</div>
                    </div>
                  )}
                  {stats.totalNgos > 0 && (
                    <div>
                      <div style={{ fontSize: "2rem", fontWeight: 900, color: T.text, letterSpacing: "-0.045em", lineHeight: 1 }}>{formatStat(stats.totalNgos)}</div>
                      <div style={{ fontSize: "0.7rem", color: T.textMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Verified NGOs</div>
                    </div>
                  )}
                  {stats.citiesCovered > 0 && (
                    <div>
                      <div style={{ fontSize: "2rem", fontWeight: 900, color: T.text, letterSpacing: "-0.045em", lineHeight: 1 }}>{formatStat(stats.citiesCovered)}</div>
                      <div style={{ fontSize: "0.7rem", color: T.textMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Cities</div>
                    </div>
                  )}
                </div>
              </Reveal>
            )}
          </div>

          {/* Right — pillars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div style={{
                  padding: "1.25rem 1.4rem", borderRadius: "var(--radius-lg)",
                  border: `1px solid ${T.border}`, background: T.bgCard,
                  borderLeft: `3px solid ${p.color}`,
                  boxShadow: T.shadowSm,
                }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: T.text, margin: "0 0 0.35rem", letterSpacing: "-0.012em" }}>{p.title}</h3>
                  <p style={{ fontSize: "0.78rem", color: T.textSub, margin: 0, lineHeight: 1.62 }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 7 — CTA BANNER
───────────────────────────────────────────────────────────────────────────── */
function CtaSection({ vp, T }) {
  return (
    <section style={{ background: T.bg, padding: "clamp(3rem,6vw,5rem) 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem,4vw,3rem)" }}>
        <Reveal>
          <div style={{
            borderRadius: "var(--radius-lg)",
            background: H.bg,
            border: `1px solid ${H.border}`,
            padding: vp.mobile ? "2.5rem 1.5rem" : "3.5rem 4rem",
            display: "flex", flexDirection: vp.mobile ? "column" : "row",
            alignItems: vp.mobile ? "flex-start" : "center",
            justifyContent: "space-between", gap: "2rem",
            position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse 45% 55% at 15% 50%, ${H.danger}12 0%, transparent 60%)`,
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.28rem 0.75rem", borderRadius: "var(--radius-full)",
                border: `1px solid ${H.danger}38`, background: `${H.danger}0F`,
                marginBottom: "0.85rem",
              }}>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: H.danger }}
                />
                <span style={{ fontSize: "0.62rem", fontWeight: 700, color: H.danger, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Emergency Help Available
                </span>
              </div>
              <h2 style={{
                fontSize: vp.mobile ? "1.5rem" : "clamp(1.6rem,2.8vw,2.1rem)", fontWeight: 900,
                color: H.fg, margin: "0 0 0.65rem", letterSpacing: "-0.03em",
              }}>
                See an animal in distress?<br />Act right now.
              </h2>
              <p style={{ fontSize: "0.88rem", color: H.fgSub, margin: 0, lineHeight: 1.68, maxWidth: 440 }}>
                Every report reaches a verified NGO within minutes. Filing an emergency rescue request takes under 30 seconds.
              </p>
            </div>

            <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "0.75rem", flexWrap: "wrap", flexShrink: 0 }}>
              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                <Link to="/rescue" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.82rem 1.6rem", borderRadius: "var(--radius-md)",
                  background: H.danger, color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                  textDecoration: "none", boxShadow: `0 4px 20px ${H.danger}40`, whiteSpace: "nowrap",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  Request Emergency Rescue
                </Link>
              </motion.div>
              <Link to="/ngo-register" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.82rem 1.4rem", borderRadius: "var(--radius-md)",
                border: `1px solid ${H.border}`, background: H.card,
                color: H.fg, fontWeight: 600, fontSize: "0.9rem",
                textDecoration: "none", whiteSpace: "nowrap",
                backdropFilter: "blur(12px)",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = H.cardHov; e.currentTarget.style.borderColor = H.borderHov; }}
                onMouseLeave={e => { e.currentTarget.style.background = H.card; e.currentTarget.style.borderColor = H.border; }}>
                Join as NGO
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const { T } = useT();
  const vp = useViewport();
  const { stats } = usePlatformStats();
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    getNgos({ limit: 8 })
      .then(data => setNgos(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => {});
  }, []);

  return (
    <main style={{ width: "100%", background: T.bg, overflowX: "hidden" }}>
      <HeroSection vp={vp} stats={stats} />
      <QuickActionsSection vp={vp} T={T} />
      <HowItWorksSection vp={vp} T={T} />
      <ServicesSection vp={vp} T={T} />
      <NgoSection vp={vp} ngos={ngos} />
      <MissionSection vp={vp} T={T} stats={stats} />
      <CtaSection vp={vp} T={T} />
    </main>
  );
}
