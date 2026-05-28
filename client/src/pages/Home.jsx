import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useT } from "../context/ThemeContext";
import useViewport from "../hooks/useViewport";
import { usePlatformStats, formatStat } from "../hooks/usePlatformStats";
import { getNgos } from "../services/ngoService";

/* ──────────────────────────────────────────────────────────────
   DESIGN TOKENS  (independent of ThemeContext for hero bg)
──────────────────────────────────────────────────────────────── */
const BRAND = {
  primary:   "#2563EB",
  secondary: "#14B8A6",
  success:   "#22C55E",
  warning:   "#F59E0B",
  danger:    "#EF4444",
  dark:      "#0F172A",
  darkCard:  "#1E293B",
  darkBorder:"rgba(255,255,255,0.08)",
};

/* ──────────────────────────────────────────────────────────────
   MOTION VARIANTS
──────────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
});
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.55, delay } },
});

/* ──────────────────────────────────────────────────────────────
   INLINE SECTION WRAPPER  – triggers once on scroll
──────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      variants={stagger(delay)}
      initial={reduce ? "show" : "hidden"}
      animate={inView ? "show" : "hidden"}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   SECTION HEADING  – reusable across page
──────────────────────────────────────────────────────────────── */
function SectionHead({ eyebrow, title, subtitle, center = true, light = false }) {
  const { T } = useT();
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: "clamp(2rem, 5vw, 3rem)" }}>
      {eyebrow && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.3rem 0.85rem",
            borderRadius: 9999,
            border: `1px solid ${light ? "rgba(255,255,255,0.15)" : `${BRAND.primary}28`}`,
            background: light ? "rgba(255,255,255,0.07)" : `${BRAND.primary}0E`,
            marginBottom: "1rem",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: light ? BRAND.secondary : BRAND.primary }} />
          <span style={{
            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: light ? BRAND.secondary : BRAND.primary,
          }}>{eyebrow}</span>
        </div>
      )}
      <h2 style={{
        fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.035em",
        lineHeight: 1.15, margin: "0 0 0.75rem",
        color: light ? "#F1F5F9" : T.textHeading,
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)", lineHeight: 1.7, maxWidth: 580,
          margin: center ? "0 auto" : 0,
          color: light ? "rgba(255,255,255,0.55)" : T.textSub,
        }}>{subtitle}</p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   HERO — left content + right ops card
──────────────────────────────────────────────────────────────── */
function Hero({ vp, stats }) {
  const reduce = useReducedMotion();

  const TRUST = [
    "Emergency Rescue Dispatch",
    "Verified NGO Network",
    "AI Health Scanner",
    "Adoption Support",
  ];

  const OPS_STEPS = [
    { id: "RQ-4821", label: "New report", status: "Received", animal: "Injured dog", loc: "Bandra, Mumbai", sev: "critical", color: BRAND.danger },
    { id: "RQ-4820", label: "NGO Dispatched", status: "In Transit", animal: "Stray cat", loc: "Koramangala, Bengaluru", sev: "medium", color: BRAND.warning },
    { id: "RQ-4819", label: "Volunteer On Site", status: "On Site", animal: "Injured cow", loc: "Andheri, Mumbai", sev: "high", color: BRAND.warning },
    { id: "RQ-4818", label: "Rescued", status: "Rescued", animal: "Abandoned puppy", loc: "HSR Layout, Bengaluru", sev: "low", color: BRAND.success },
  ];

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: vp.mobile ? "auto" : "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: BRAND.dark,
      }}
    >
      {/* Background image — Unsplash animal rescue photo, blurred */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1600&q=60&auto=format&fit=crop")`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: 0.07,
          filter: "blur(2px) saturate(0.5)",
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 15% 50%, ${BRAND.primary}22 0%, transparent 55%),
                       radial-gradient(ellipse 60% 50% at 85% 50%, ${BRAND.secondary}18 0%, transparent 55%),
                       linear-gradient(180deg, ${BRAND.dark} 0%, #0A1628 100%)`,
        }}
      />

      {/* Grid dot pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: vp.mobile
            ? "7rem 1.25rem 4rem"
            : "0 clamp(1.5rem, 5vw, 4rem)",
          display: "grid",
          gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr",
          gap: vp.mobile ? "3rem" : "4rem",
          alignItems: "center",
          minHeight: vp.mobile ? "auto" : "100svh",
        }}
      >
        {/* LEFT — headline + CTAs */}
        <div>
          {/* Live indicator */}
          <motion.div
            variants={fadeIn(0)}
            initial={reduce ? "show" : "hidden"}
            animate="show"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.3rem 0.85rem",
              borderRadius: 9999,
              border: `1px solid ${BRAND.danger}40`,
              background: `${BRAND.danger}12`,
              marginBottom: "1.5rem",
            }}
          >
            <motion.span
              animate={reduce ? {} : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: BRAND.danger }}
            />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: BRAND.danger, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Live · Emergency Response Platform
            </span>
          </motion.div>

          <motion.h1
            variants={stagger(0.1)}
            initial={reduce ? "show" : "hidden"}
            animate="show"
            style={{
              fontSize: vp.mobile ? "clamp(2rem, 8vw, 2.6rem)" : "clamp(2.4rem, 4vw, 3.25rem)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
              color: "#F1F5F9",
              margin: "0 0 1.25rem",
            }}
          >
            Connecting Communities,{" "}
            <span style={{ color: BRAND.primary }}>NGOs,</span> and Volunteers{" "}
            <span style={{ color: BRAND.secondary }}>to Save Animal Lives.</span>
          </motion.h1>

          <motion.p
            variants={stagger(0.2)}
            initial={reduce ? "show" : "hidden"}
            animate="show"
            style={{
              fontSize: vp.mobile ? "0.92rem" : "1rem",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.75,
              marginBottom: "2rem",
              maxWidth: 480,
            }}
          >
            Report emergencies, find nearby NGOs, scan animal health issues, and track rescue missions in real time.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={stagger(0.3)}
            initial={reduce ? "show" : "hidden"}
            animate="show"
            style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.25rem" }}
          >
            <Link
              to="/rescue"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "0.75rem 1.4rem",
                borderRadius: 10,
                background: BRAND.danger,
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                boxShadow: `0 4px 20px ${BRAND.danger}40`,
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${BRAND.danger}50`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 20px ${BRAND.danger}40`; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              Report Animal
            </Link>
            <Link
              to="/ngos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "0.75rem 1.4rem",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                backdropFilter: "blur(12px)",
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            >
              Find NGOs
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={stagger(0.4)}
            initial={reduce ? "show" : "hidden"}
            animate="show"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem" }}
          >
            {TRUST.map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BRAND.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                <span style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Glassmorphism Ops Card */}
        <motion.div
          variants={stagger(0.25)}
          initial={reduce ? "show" : "hidden"}
          animate="show"
        >
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 18,
              overflow: "hidden",
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Card header */}
            <div
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  {["#EF4444", "#F59E0B", "#22C55E"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>RESCUE OPERATIONS</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <motion.span
                  animate={reduce ? {} : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: BRAND.success }}
                />
                <span style={{ fontSize: "0.65rem", color: BRAND.success, fontWeight: 600 }}>LIVE</span>
              </div>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {[
                { v: formatStat(stats.totalRescues), l: "Total Rescues" },
                { v: formatStat(stats.totalNgos), l: "NGOs Active" },
                { v: `${stats.avgResponseMinutes || 0}m`, l: "Avg Response" },
              ].map((s, i) => (
                <div
                  key={s.l}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.03em" }}>{s.v}</div>
                  <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.4)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Rescue queue */}
            <div style={{ padding: "0.75rem 0" }}>
              {OPS_STEPS.map((op, i) => (
                <motion.div
                  key={op.id}
                  initial={reduce ? {} : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.65rem 1.25rem",
                    borderBottom: i < OPS_STEPS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Severity dot */}
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: op.color,
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${op.color}80`,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                      <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "rgba(255,255,255,0.3)" }}>{op.id}</span>
                      <span
                        style={{
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: op.color,
                          background: `${op.color}15`,
                          border: `1px solid ${op.color}30`,
                          padding: "0.1rem 0.45rem",
                          borderRadius: 9999,
                        }}
                      >
                        {op.sev}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {op.animal}
                    </div>
                    <div style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.35)", marginTop: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {op.loc}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "0.2rem 0.6rem",
                      borderRadius: 6,
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: op.color,
                      background: `${op.color}10`,
                      border: `1px solid ${op.color}25`,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {op.status}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer bar */}
            <div
              style={{
                padding: "0.65rem 1.25rem",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.3)" }}>Powered by ResQNet AI</span>
              <Link
                to="/rescue"
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: BRAND.primary,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                Report Now
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   QUICK ACTIONS — 4 cards
──────────────────────────────────────────────────────────────── */
function QuickActions({ vp, T }) {
  const ACTIONS = [
    {
      to: "/rescue", label: "Report Emergency",
      desc: "Submit a rescue request — dispatches to the nearest NGO and volunteer in seconds.",
      color: BRAND.danger, bg: `${BRAND.danger}10`, border: `${BRAND.danger}25`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
      badge: "Most Critical",
    },
    {
      to: "/ai-health", label: "AI Health Scan",
      desc: "Upload a photo — AI detects species, breed, injuries, and triage urgency.",
      color: BRAND.primary, bg: `${BRAND.primary}10`, border: `${BRAND.primary}25`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3.5"/></svg>,
    },
    {
      to: "/ngos", label: "Find NGOs",
      desc: "Locate verified rescue organizations near you — search by city, type, or service.",
      color: BRAND.secondary, bg: `${BRAND.secondary}10`, border: `${BRAND.secondary}25`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
    {
      to: "/adoption", label: "Adopt an Animal",
      desc: "Browse rescued animals matched to your lifestyle through AI compatibility scoring.",
      color: BRAND.success, bg: `${BRAND.success}10`, border: `${BRAND.success}25`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    },
  ];

  return (
    <section style={{ background: T.bg, padding: "clamp(3rem, 7vw, 5rem) 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3rem)" }}>
        <Reveal>
          <SectionHead
            eyebrow="Platform Modules"
            title="Everything You Need to Help Animals"
            subtitle="Four integrated workflows — from emergency dispatch to long-term adoption."
          />
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {ACTIONS.map((a, i) => (
            <Reveal key={a.to} delay={i * 0.08}>
              <Link
                to={a.to}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  padding: "1.4rem",
                  borderRadius: 14,
                  border: `1px solid ${T.border}`,
                  background: T.bgCard,
                  textDecoration: "none",
                  color: "inherit",
                  height: "100%",
                  boxShadow: T.shadowSm,
                  transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = a.color;
                  e.currentTarget.style.boxShadow = `0 8px 32px ${a.color}20`;
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.boxShadow = T.shadowSm;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 11,
                    background: a.bg, border: `1px solid ${a.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: a.color, flexShrink: 0,
                  }}>
                    {a.icon}
                  </div>
                  {a.badge && (
                    <span style={{ fontSize: "0.58rem", fontWeight: 700, color: a.color, background: a.bg, border: `1px solid ${a.border}`, padding: "0.18rem 0.55rem", borderRadius: 9999, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {a.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, color: T.text, margin: "0 0 0.4rem", letterSpacing: "-0.02em" }}>{a.label}</h3>
                  <p style={{ fontSize: "0.8rem", color: T.textSub, margin: 0, lineHeight: 1.6 }}>{a.desc}</p>
                </div>
                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "0.35rem", color: a.color, fontSize: "0.76rem", fontWeight: 700 }}>
                  Get started
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   HOW IT WORKS — numbered workflow
──────────────────────────────────────────────────────────────── */
function HowItWorks({ vp, T }) {
  const STEPS = [
    { n: "01", title: "Report", desc: "Submit location, photo, and severity in under 30 seconds.", color: BRAND.danger,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
    { n: "02", title: "Dispatch", desc: "Nearest verified NGO is auto-assigned. Volunteers are notified instantly.", color: BRAND.warning,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { n: "03", title: "Respond", desc: "Volunteer coordinates on-site. NGO provides medical support and resources.", color: BRAND.primary,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { n: "04", title: "Rescue", desc: "Animal is secured and transported. Status updated in real time.", color: BRAND.secondary,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
    { n: "05", title: "Recover", desc: "Animal receives care and is listed for adoption on the platform.", color: BRAND.success,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  ];

  return (
    <section style={{ background: T.bgAlt, padding: "clamp(3rem, 7vw, 5rem) 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3rem)" }}>
        <Reveal>
          <SectionHead
            eyebrow="Rescue Workflow"
            title="How ResQNet Works"
            subtitle="From first report to full recovery — every step tracked, coordinated, and transparent."
          />
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr 1fr" : "repeat(5, 1fr)",
            gap: "1px",
            background: T.border,
            borderRadius: 14,
            overflow: "hidden",
            border: `1px solid ${T.border}`,
          }}
        >
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.07}>
              <div style={{ background: T.bgCard, padding: "1.5rem 1.25rem", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: `${s.color}12`, border: `1px solid ${s.color}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: s.color, flexShrink: 0,
                  }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: "0.62rem", fontWeight: 800, color: s.color, letterSpacing: "0.08em" }}>{s.n}</span>
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: T.text, margin: "0 0 0.35rem", letterSpacing: "-0.015em" }}>{s.title}</h3>
                <p style={{ fontSize: "0.76rem", color: T.textSub, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                {i < STEPS.length - 1 && !vp.mobile && !vp.tablet && (
                  <div style={{
                    position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)",
                    zIndex: 2, display: "none",
                  }} />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   SERVICES GRID
──────────────────────────────────────────────────────────────── */
function Services({ vp, T }) {
  const SVCS = [
    {
      title: "Animal Rescue",
      desc: "24/7 emergency response with AI-powered dispatch to the nearest verified NGO and volunteer.",
      color: BRAND.danger,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    },
    {
      title: "NGO Coordination",
      desc: "Real-time case assignment, volunteer management, and operational dashboards for rescue organizations.",
      color: BRAND.primary,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 4l9 5.5V20H3V9.5z"/><rect x="9" y="14" width="6" height="6" rx="1"/></svg>,
    },
    {
      title: "Volunteer Network",
      desc: "Accept missions, submit field reports, and coordinate with NGOs — all from your mobile device.",
      color: BRAND.secondary,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
    {
      title: "AI Health Scanner",
      desc: "Upload a photo for instant species identification, injury detection, and triage severity scoring.",
      color: "#8B5CF6",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3.5"/></svg>,
    },
    {
      title: "Animal Adoption",
      desc: "Rescued animals matched to compatible adopters through AI lifestyle scoring and compatibility analysis.",
      color: BRAND.success,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    },
    {
      title: "Emergency Tracking",
      desc: "Real-time case status updates from report to rescue — every milestone timestamped and transparent.",
      color: BRAND.warning,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    },
  ];

  return (
    <section style={{ background: T.bg, padding: "clamp(3rem, 7vw, 5rem) 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3rem)" }}>
        <Reveal>
          <SectionHead
            eyebrow="Platform Services"
            title="Built for Every Role in the Rescue Chain"
            subtitle="From citizens reporting strays to NGOs managing cases — ResQNet connects everyone."
          />
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          {SVCS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: 14,
                  border: `1px solid ${T.border}`,
                  background: T.bgCard,
                  boxShadow: T.shadowSm,
                  transition: "border-color 0.18s, box-shadow 0.18s",
                  height: "100%",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}40`; e.currentTarget.style.boxShadow = `0 6px 24px ${s.color}14`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = T.shadowSm; }}
              >
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${s.color}10`, border: `1px solid ${s.color}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: s.color, marginBottom: "1rem",
                  }}
                >
                  {s.icon}
                </div>
                <h3 style={{ fontSize: "0.98rem", fontWeight: 800, color: T.text, margin: "0 0 0.5rem", letterSpacing: "-0.015em" }}>{s.title}</h3>
                <p style={{ fontSize: "0.8rem", color: T.textSub, margin: 0, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   NGO SHOWCASE
──────────────────────────────────────────────────────────────── */
function NGOShowcase({ vp, T, ngos }) {
  return (
    <section style={{ background: BRAND.dark, padding: "clamp(3rem, 7vw, 5rem) 0", position: "relative", overflow: "hidden" }}>
      {/* Subtle background */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${BRAND.primary}10 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3rem)" }}>
        <Reveal>
          <SectionHead light eyebrow="Verified Partners" title="NGO Network" subtitle="Rescue organizations verified by ResQNet — serving communities across India." />
        </Reveal>

        {ngos.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: "0.85rem",
            }}
          >
            {ngos.map((ngo, i) => {
              const name = ngo?.ngoProfile?.organizationName || ngo?.fullName || ngo?.name || "Verified NGO";
              const city = ngo?.ngoProfile?.city || ngo?.location?.city || ngo?.city || "India";
              const type = (ngo?.ngoProfile?.specialties || ngo?.specialties || [])[0] || "Rescue";
              return (
                <Reveal key={ngo._id || i} delay={i * 0.07}>
                  <Link
                    to="/ngos"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      padding: "1.1rem",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.09)",
                      background: "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(12px)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "border-color 0.18s, background 0.18s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${BRAND.primary}50`; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 9,
                        background: `${BRAND.primary}20`, border: `1px solid ${BRAND.primary}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: BRAND.primary, fontWeight: 800, fontSize: "0.82rem", flexShrink: 0,
                      }}>
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F1F5F9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                        <div style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.4)", marginTop: "0.1rem" }}>{city}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{
                        fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                        color: BRAND.secondary, background: `${BRAND.secondary}15`, border: `1px solid ${BRAND.secondary}25`,
                        padding: "0.18rem 0.55rem", borderRadius: 9999,
                      }}>
                        {type}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={BRAND.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                        <span style={{ fontSize: "0.6rem", color: BRAND.success, fontWeight: 700 }}>Verified</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Reveal>
            <div style={{ textAlign: "center", padding: "2.5rem", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>
              NGO network loading…
            </div>
          </Reveal>
        )}

        <Reveal delay={0.2}>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link
              to="/ngos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "0.75rem 1.5rem",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
                fontSize: "0.88rem",
                textDecoration: "none",
                backdropFilter: "blur(12px)",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            >
              View all NGOs
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   MISSION / IMPACT (no fake stats)
──────────────────────────────────────────────────────────────── */
function Mission({ vp, T, stats }) {
  const PILLARS = [
    { title: "Zero Preventable Deaths", desc: "Every report reaches a verified NGO. Every case is tracked until resolved.", color: BRAND.danger },
    { title: "Community-Powered Rescue", desc: "Citizens, volunteers, and NGOs working in one coordinated platform.", color: BRAND.primary },
    { title: "AI-Augmented Care", desc: "Computer vision triage ensures no injury goes undetected or untriaged.", color: BRAND.secondary },
  ];

  return (
    <section style={{ background: T.bgAlt, padding: "clamp(3rem, 7vw, 5rem) 0", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3rem)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr",
            gap: "clamp(2rem, 5vw, 4rem)",
            alignItems: "center",
          }}
        >
          {/* Left — mission */}
          <div>
            <Reveal>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.3rem 0.85rem", borderRadius: 9999,
                border: `1px solid ${BRAND.primary}28`, background: `${BRAND.primary}0E`, marginBottom: "1.25rem",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: BRAND.primary }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: BRAND.primary }}>Our Mission</span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{
                fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)", fontWeight: 900,
                letterSpacing: "-0.04em", lineHeight: 1.12, margin: "0 0 1rem",
                color: T.textHeading,
              }}>
                Every Animal Deserves<br />
                <span style={{ color: BRAND.primary }}>a Chance to Live.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p style={{ fontSize: "0.9rem", color: T.textSub, lineHeight: 1.75, marginBottom: "1.5rem" }}>
                ResQNet exists to eliminate the coordination gap in animal rescue — connecting the person who sees an animal in distress with the organization equipped to help, in seconds.
              </p>
            </Reveal>

            {/* Real platform stats if available */}
            {(stats.totalRescues > 0 || stats.totalNgos > 0) && (
              <Reveal delay={0.2}>
                <div style={{ display: "flex", gap: "2rem", paddingTop: "1.5rem", borderTop: `1px solid ${T.border}` }}>
                  {stats.totalRescues > 0 && (
                    <div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 900, color: T.text, letterSpacing: "-0.04em" }}>{formatStat(stats.totalRescues)}</div>
                      <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Rescue Cases</div>
                    </div>
                  )}
                  {stats.totalNgos > 0 && (
                    <div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 900, color: T.text, letterSpacing: "-0.04em" }}>{formatStat(stats.totalNgos)}</div>
                      <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Verified NGOs</div>
                    </div>
                  )}
                  {stats.citiesCovered > 0 && (
                    <div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 900, color: T.text, letterSpacing: "-0.04em" }}>{formatStat(stats.citiesCovered)}</div>
                      <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Cities</div>
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
                  padding: "1.25rem 1.4rem",
                  borderRadius: 12,
                  border: `1px solid ${T.border}`,
                  background: T.bgCard,
                  borderLeft: `3px solid ${p.color}`,
                  boxShadow: T.shadowSm,
                }}>
                  <h3 style={{ fontSize: "0.92rem", fontWeight: 800, color: T.text, margin: "0 0 0.35rem", letterSpacing: "-0.01em" }}>{p.title}</h3>
                  <p style={{ fontSize: "0.79rem", color: T.textSub, margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   CTA BANNER
──────────────────────────────────────────────────────────────── */
function CtaBanner({ vp, T }) {
  return (
    <section style={{ background: T.bg, padding: "clamp(3rem, 7vw, 5rem) 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3rem)" }}>
        <Reveal>
          <div
            style={{
              borderRadius: 20,
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #0A1628 50%, #0C1D3A 100%)`,
              border: "1px solid rgba(255,255,255,0.08)",
              padding: vp.mobile ? "2.5rem 1.5rem" : "3.5rem 4rem",
              display: "flex",
              flexDirection: vp.mobile ? "column" : "row",
              alignItems: vp.mobile ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: "2rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background glow */}
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse 50% 60% at 20% 50%, ${BRAND.primary}15 0%, transparent 60%)`,
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.28rem 0.75rem", borderRadius: 9999,
                border: `1px solid ${BRAND.danger}35`, background: `${BRAND.danger}10`,
                marginBottom: "0.85rem",
              }}>
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: BRAND.danger }} />
                <span style={{ fontSize: "0.62rem", fontWeight: 700, color: BRAND.danger, letterSpacing: "0.08em", textTransform: "uppercase" }}>Emergency Help Available</span>
              </div>
              <h2 style={{ fontSize: vp.mobile ? "1.5rem" : "clamp(1.6rem, 2.8vw, 2.1rem)", fontWeight: 900, color: "#F1F5F9", margin: "0 0 0.6rem", letterSpacing: "-0.03em" }}>
                See an animal in distress?<br />Act now.
              </h2>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.65, maxWidth: 440 }}>
                Every report reaches a verified NGO within minutes. It takes under 30 seconds to file an emergency rescue request.
              </p>
            </div>

            <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "0.75rem", flexWrap: "wrap", flexShrink: 0 }}>
              <Link
                to="/rescue"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "0.85rem 1.75rem", borderRadius: 10,
                  background: BRAND.danger, color: "#fff",
                  fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
                  letterSpacing: "-0.01em", boxShadow: `0 4px 20px ${BRAND.danger}40`,
                  transition: "transform 0.15s, box-shadow 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${BRAND.danger}55`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 20px ${BRAND.danger}40`; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Report an Animal
              </Link>
              <Link
                to="/ngo-register"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "0.85rem 1.5rem", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: "0.9rem",
                  textDecoration: "none", backdropFilter: "blur(12px)",
                  transition: "background 0.15s, border-color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.11)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              >
                Join as NGO
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   PAGE ROOT
──────────────────────────────────────────────────────────────── */
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
      <Hero vp={vp} stats={stats} />
      <QuickActions vp={vp} T={T} />
      <HowItWorks vp={vp} T={T} />
      <Services vp={vp} T={T} />
      <NGOShowcase vp={vp} T={T} ngos={ngos} />
      <Mission vp={vp} T={T} stats={stats} />
      <CtaBanner vp={vp} T={T} />
    </main>
  );
}
