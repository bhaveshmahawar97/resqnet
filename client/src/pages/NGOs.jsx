import { useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Btn from "../components/ui/Button";
import Label from "../components/ui/Label";
import useViewport from "../hooks/useViewport";
import useCountUp from "../hooks/useCountUp";
import { useT } from "../context/ThemeContext";

import {
  vFade,
  vFadeUp,
} from "../animations/variants";

import Orbs from "../components/ui/BackgroundOrbs";
/* ═══════════════════════════════════════════════════════════════
   NGO DATA
═══════════════════════════════════════════════════════════════ */
const ALL_NGOS = [
  { name: "Paws of Hope Foundation",       city: "Mumbai, Maharashtra",    animals: 347, type: "Rescue",   focus: "Street Animals", active: true,  since: 2014, rating: 4.9, volunteers: 82,  phone: "+91 98200 11230" },
  { name: "Street Animal Relief Trust",    city: "Bengaluru, Karnataka",   animals: 214, type: "Medical",  focus: "Veterinary Aid",  active: true,  since: 2016, rating: 4.8, volunteers: 54,  phone: "+91 80000 44220" },
  { name: "Wildlife Bridge Society",       city: "Pune, Maharashtra",      animals: 89,  type: "Rehab",    focus: "Wildlife",        active: true,  since: 2011, rating: 4.7, volunteers: 38,  phone: "+91 20000 55310" },
  { name: "Urban Canine Coalition",        city: "Delhi NCR",              animals: 503, type: "Shelter",  focus: "Dogs",            active: true,  since: 2013, rating: 4.9, volunteers: 120, phone: "+91 11000 88450" },
  { name: "Feather & Fin Sanctuary",       city: "Chennai, Tamil Nadu",    animals: 162, type: "Rescue",   focus: "Birds & Aquatic", active: false, since: 2017, rating: 4.6, volunteers: 29,  phone: "+91 44000 66780" },
  { name: "Compassionate Herd Network",    city: "Jaipur, Rajasthan",      animals: 271, type: "Rescue",   focus: "Cattle & Equine", active: true,  since: 2015, rating: 4.8, volunteers: 67,  phone: "+91 14100 33210" },
  { name: "Northern Feline Alliance",      city: "Chandigarh, Punjab",     animals: 134, type: "Medical",  focus: "Cats",            active: true,  since: 2019, rating: 4.7, volunteers: 41,  phone: "+91 17200 22190" },
  { name: "Green Canopy Rescue Corp",      city: "Kolkata, West Bengal",   animals: 198, type: "Rehab",    focus: "Reptiles",        active: true,  since: 2012, rating: 4.5, volunteers: 33,  phone: "+91 33000 55670" },
  { name: "Haven for Stray Lives",         city: "Hyderabad, Telangana",   animals: 416, type: "Shelter",  focus: "Street Animals",  active: true,  since: 2010, rating: 4.9, volunteers: 98,  phone: "+91 40000 77830" },
  { name: "Desert Paws Initiative",        city: "Jodhpur, Rajasthan",     animals: 88,  type: "Rescue",   focus: "Cattle & Equine", active: false, since: 2020, rating: 4.4, volunteers: 22,  phone: "+91 29100 44120" },
  { name: "Coastal Animal Watch",          city: "Kochi, Kerala",          animals: 175, type: "Medical",  focus: "Aquatic & Birds", active: true,  since: 2018, rating: 4.6, volunteers: 45,  phone: "+91 48400 99010" },
  { name: "Hills Rescue Collective",       city: "Shimla, Himachal Pradesh",animals: 61, type: "Rehab",   focus: "Wildlife",        active: true,  since: 2016, rating: 4.7, volunteers: 19,  phone: "+91 17700 33440" },
];

const TYPE_COLORS = {
  Rescue:  { bg: "rgba(22,160,86,0.10)",  text: "#16A056" },
  Medical: { bg: "rgba(59,130,246,0.10)", text: "#3B82F6" },
  Rehab:   { bg: "rgba(245,158,11,0.10)", text: "#D97706" },
  Shelter: { bg: "rgba(139,92,246,0.10)", text: "#7C3AED" },
};

const ALL_TYPES  = ["All", "Rescue", "Medical", "Rehab", "Shelter"];
const ALL_STATUS = ["All", "Active", "Full Capacity"];

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
function Hero() {
  const { T } = useT();
  const vp = useViewport();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : vp.mobile ? 30 : 90]);
  const heroOp    = useTransform(scrollY, [0, 420], [1, 0]);

  const badges = ["312 Active NGOs", "18 States", "Verified Partners"];

  return (
    <section style={{ position: "relative", width: "100%", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", background: T.gradHero }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=2000&q=75"
          alt=""
          aria-hidden
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", opacity: T.heroImg, filter: "grayscale(20%) contrast(1.1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, ${T.bg} 100%)` }} />
      </div>

      <Orbs />

      <motion.div style={{ y: parallaxY, opacity: heroOp, position: "relative", zIndex: 1, width: "100%", textAlign: "center", padding: `clamp(5rem, 12vh, 8rem) clamp(1.25rem, 5vw, 6rem) clamp(3rem, 8vh, 5rem)` }}>
        <motion.div initial="hidden" animate="show" variants={vFade} style={{ display: "flex", gap: "0.45rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          {badges.map((b, i) => (
            <motion.span key={b} custom={i} variants={vFade}
              style={{ padding: "0.3rem 0.85rem", borderRadius: 30, border: `1px solid ${T.border}`, background: T.bgGlass, backdropFilter: "blur(14px)", fontSize: "0.7rem", fontWeight: 600, color: T.textSub, letterSpacing: "0.04em" }}>
              {b}
            </motion.span>
          ))}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: "clamp(2.6rem, 9vw, 7rem)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.045em", margin: "0 0 1.25rem", color: T.text }}>
          The Network Behind{" "}
          <br />
          <span style={{ background: `linear-gradient(100deg, ${T.accent} 0%, ${T.accentDim} 55%, ${T.accent} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Every Rescue.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.2rem)", color: T.textSub, margin: "0 auto 2.5rem", lineHeight: 1.75 }}>
          Discover, connect with, and support the NGOs that form the backbone of animal rescue across India — all verified, all on ResQNet.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}
          style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Btn variant="primary" size="lg">Register Your NGO</Btn>
          <Btn variant="ghost"   size="lg">Browse All Partners</Btn>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ marginTop: "clamp(2.5rem, 6vh, 4.5rem)", display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(1.5rem, 4vw, 3rem)", flexWrap: "wrap" }}>
          {[["312","Verified NGOs"],["18","States Covered"],["94%","Response Rate"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(1.2rem, 3vw, 1.65rem)", fontWeight: 800, color: T.text, letterSpacing: "-0.03em" }}>{v}</div>
              <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 2, letterSpacing: "0.04em" }}>{l}</div>
            </div>
          ))}
        </motion.div>

        {!vp.mobile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <motion.div animate={reduce ? {} : { y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: 1, height: 34, background: `linear-gradient(to bottom, ${T.textMuted}, transparent)` }} />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STATISTICS BAND
═══════════════════════════════════════════════════════════════ */
function StatPill({ value, suffix, label, i }) {
  const { T } = useT();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(value, inView);
  return (
    <motion.div ref={ref} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={vFadeUp}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18,
        padding: "clamp(1.2rem, 2.5vw, 1.8rem) clamp(1.25rem, 3vw, 2.25rem)",
        textAlign: "center", flex: "1 1 clamp(130px, 18vw, 210px)",
        boxShadow: `0 2px 16px ${T.shadow}`, cursor: "default" }}>
      <div style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", fontWeight: 900, color: T.text, letterSpacing: "-0.05em", lineHeight: 1 }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: "clamp(0.72rem, 1.5vw, 0.82rem)", color: T.textSub, marginTop: "0.45rem", fontWeight: 500 }}>{label}</div>
      <div style={{ width: 24, height: 2, background: T.accent, margin: "0.9rem auto 0", borderRadius: 2 }} />
    </motion.div>
  );
}

function NGOStats() {
  const { T } = useT();
  const stats = [
    { value: 312,   suffix: "",  label: "Verified NGOs" },
    { value: 18,    suffix: "",  label: "States Active" },
    { value: 48200, suffix: "+", label: "Animals Rescued" },
    { value: 1240,  suffix: "+", label: "Active Volunteers" },
    { value: 7400,  suffix: "+", label: "Successful Adoptions" },
  ];
  return (
    <section style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bgAlt, position: "relative", overflow: "hidden" }}>
      <div style={{ width: "100%", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>Network Impact</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: 0 }}>
            Every number is<br />an animal saved.
          </h2>
        </motion.div>
        <div style={{ display: "flex", gap: "clamp(0.65rem, 1.5vw, 1.25rem)", flexWrap: "wrap", justifyContent: "center", alignItems: "stretch" }}>
          {stats.map((s, i) => <StatPill key={s.label} {...s} i={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FILTER BAR
═══════════════════════════════════════════════════════════════ */
function FilterBar({ typeFilter, setTypeFilter, statusFilter, setStatusFilter, search, setSearch }) {
  const { T } = useT();
  const vp = useViewport();

  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
      style={{ display: "flex", gap: "clamp(0.6rem, 1.5vw, 1rem)", flexWrap: "wrap", alignItems: "center", marginBottom: "clamp(1.5rem, 4vw, 2.5rem)" }}>

      {/* Search */}
      <div style={{ position: "relative", flex: vp.mobile ? "1 1 100%" : "1 1 240px", minWidth: vp.mobile ? "100%" : 200 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search NGOs, cities…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "0.6rem 0.9rem 0.6rem 2.3rem", borderRadius: 10,
            border: `1px solid ${T.border}`, background: T.bgCard, color: T.text,
            fontSize: "0.82rem", fontFamily: "inherit", outline: "none",
            boxShadow: `0 2px 8px ${T.shadow}`, transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.border}
        />
      </div>

      {/* Type chips */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {ALL_TYPES.map(t => {
          const active = typeFilter === t;
          return (
            <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => setTypeFilter(t)}
              style={{
                padding: "0.42rem 0.9rem", borderRadius: 8, border: `1px solid ${active ? T.accent : T.border}`,
                background: active ? T.accentPale : T.bgCard,
                color: active ? T.accent : T.textSub,
                fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s",
              }}>
              {t}
            </motion.button>
          );
        })}
      </div>

      {/* Status chips */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {ALL_STATUS.map(s => {
          const active = statusFilter === s;
          return (
            <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => setStatusFilter(s)}
              style={{
                padding: "0.42rem 0.9rem", borderRadius: 8, border: `1px solid ${active ? T.accent : T.border}`,
                background: active ? T.accentPale : T.bgCard,
                color: active ? T.accent : T.textSub,
                fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s",
              }}>
              {s}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NGO CARD — full detail version
═══════════════════════════════════════════════════════════════ */
function NGOCard({ ngo, i }) {
  const { T } = useT();
  const [hov, setHov] = useState(false);
  const tc = TYPE_COLORS[ngo.type] || TYPE_COLORS.Rescue;

  return (
    <motion.div
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={vFadeUp}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.bgCardHov : T.bgCard,
        border: `1px solid ${hov ? T.borderHov : T.border}`,
        borderRadius: 18,
        padding: "clamp(1.1rem, 2.5vw, 1.6rem)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov ? `0 22px 58px ${T.shadowHov}` : `0 2px 14px ${T.shadow}`,
        flex: "1 1 clamp(280px, 30vw, 380px)",
        display: "flex", flexDirection: "column", gap: "1rem",
      }}>

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: T.accentPale, border: `1px solid ${T.accentGlow}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: "clamp(0.86rem, 1.8vw, 0.98rem)", fontWeight: 700, margin: 0, color: T.text, lineHeight: 1.3 }}>{ngo.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: "0.18rem" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{ fontSize: "0.72rem", color: T.textSub }}>{ngo.city}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
          <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: tc.text, background: tc.bg, padding: "0.18rem 0.55rem", borderRadius: 20 }}>{ngo.type}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <motion.div animate={{ opacity: ngo.active ? [0.5, 1, 0.5] : 1 }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: ngo.active ? T.accent : "#F59E0B" }} />
            <span style={{ fontSize: "0.65rem", color: ngo.active ? T.accent : "#D97706", fontWeight: 600 }}>{ngo.active ? "Active" : "At Capacity"}</span>
          </div>
        </div>
      </div>

      {/* Focus tag */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.66rem", color: T.textSub, background: T.bgAlt, border: `1px solid ${T.border}`, padding: "0.18rem 0.6rem", borderRadius: 20 }}>{ngo.focus}</span>
        <span style={{ fontSize: "0.66rem", color: T.textSub, background: T.bgAlt, border: `1px solid ${T.border}`, padding: "0.18rem 0.6rem", borderRadius: 20 }}>Est. {ngo.since}</span>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", borderTop: `1px solid ${T.border}`, paddingTop: "0.9rem" }}>
        {[
          { val: ngo.animals.toLocaleString(), sub: "In Care" },
          { val: ngo.volunteers,               sub: "Volunteers" },
          { val: `${ngo.rating}★`,             sub: "Rating" },
        ].map(({ val, sub }) => (
          <div key={sub} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "clamp(1rem, 2.2vw, 1.2rem)", fontWeight: 800, color: T.text, letterSpacing: "-0.03em" }}>{val}</div>
            <div style={{ fontSize: "0.62rem", color: T.textMuted, marginTop: 1 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", marginTop: "auto" }}>
        <Btn variant="primary" size="sm" style={{ flex: 1 }}>Contact NGO</Btn>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NGO GRID + FILTERS
═══════════════════════════════════════════════════════════════ */
function NGODirectory() {
  const { T } = useT();
  const [typeFilter,   setTypeFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search,       setSearch]       = useState("");
  const [showAll,      setShowAll]      = useState(false);

  const filtered = ALL_NGOS.filter(n => {
    const matchType   = typeFilter   === "All" || n.type === typeFilter;
    const matchStatus = statusFilter === "All" || (statusFilter === "Active" ? n.active : !n.active);
    const q           = search.toLowerCase();
    const matchSearch = !q || n.name.toLowerCase().includes(q) || n.city.toLowerCase().includes(q) || n.focus.toLowerCase().includes(q);
    return matchType && matchStatus && matchSearch;
  });

  const visible = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id="for-ngos" style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bg, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "3px", height: "100%", background: `linear-gradient(to bottom, transparent, ${T.accent}, transparent)` }} />

      <div style={{ width: "100%", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.25rem", marginBottom: "clamp(1.5rem, 4vw, 2.5rem)" }}>
          <div>
            <Label>NGO Directory</Label>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: 0 }}>
              Verified organizations.<br />Real-world impact.
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", color: T.textMuted }}>{filtered.length} results</span>
          </div>
        </motion.div>

        <FilterBar
          typeFilter={typeFilter} setTypeFilter={setTypeFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          search={search} setSearch={setSearch}
        />

        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "4rem 0", color: T.textMuted }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
              <div style={{ fontSize: "0.9rem" }}>No NGOs match your filters. Try a different search.</div>
            </motion.div>
          ) : (
            <motion.div key="grid" layout style={{ display: "flex", gap: "clamp(0.65rem, 1.5vw, 1rem)", flexWrap: "wrap" }}>
              {visible.map((n, i) => <NGOCard key={n.name} ngo={n} i={i % 6} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length > 6 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ textAlign: "center", marginTop: "clamp(1.8rem, 4vw, 2.8rem)" }}>
            <Btn variant="ghost" onClick={() => setShowAll(o => !o)}>
              {showAll ? "Show Less" : `Show All ${filtered.length} NGOs`}
            </Btn>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESCUE NETWORK MAP (stylized, no real map)
═══════════════════════════════════════════════════════════════ */
const NETWORK_NODES = [
  { name: "Mumbai",    x: "22%", y: "62%", count: 28, size: "lg" },
  { name: "Delhi",     x: "42%", y: "24%", count: 34, size: "lg" },
  { name: "Bengaluru", x: "34%", y: "76%", count: 21, size: "md" },
  { name: "Hyderabad", x: "40%", y: "64%", count: 18, size: "md" },
  { name: "Chennai",   x: "43%", y: "82%", count: 15, size: "md" },
  { name: "Kolkata",   x: "66%", y: "44%", count: 12, size: "sm" },
  { name: "Pune",      x: "26%", y: "67%", count: 9,  size: "sm" },
  { name: "Jaipur",    x: "38%", y: "36%", count: 8,  size: "sm" },
  { name: "Chandigarh",x: "42%", y: "16%", count: 6,  size: "sm" },
  { name: "Kochi",     x: "30%", y: "88%", count: 7,  size: "sm" },
];

function NetworkMap() {
  const { T } = useT();
  const vp = useViewport();
  const reduce = useReducedMotion();
  const [hov, setHov] = useState(null);

  const sz = { lg: 14, md: 10, sm: 7 };

  return (
    <section style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bgAlt, position: "relative", overflow: "hidden" }}>
      <div style={{ width: "100%", padding: "0 clamp(1.25rem, 4vw, 3.5rem)", display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr", gap: "clamp(2.5rem, 6vw, 6rem)", alignItems: "center" }}>

        {/* Text */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}>
          <Label>Rescue Coverage</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", margin: "0 0 1rem", color: T.text }}>
            A national network,<br />always within reach.
          </h2>
          <p style={{ color: T.textSub, lineHeight: 1.78, marginBottom: "1.75rem", fontSize: "clamp(0.88rem, 1.8vw, 1rem)" }}>
            ResQNet partner NGOs span 18 states — from metro rescue hubs to rural relief outposts. When an animal needs help, our network coordinates the closest available team automatically.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2rem" }}>
            {[
              { icon: "📍", text: "Geo-tagged rescue zones for precise dispatch" },
              { icon: "🔗", text: "Interlinked NGO communication channels" },
              { icon: "📊", text: "Real-time capacity & availability tracking" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1rem", lineHeight: 1.4 }}>{icon}</span>
                <span style={{ fontSize: "0.85rem", color: T.textSub, lineHeight: 1.65 }}>{text}</span>
              </div>
            ))}
          </div>
          <Btn variant="primary">View Full Map</Btn>
        </motion.div>

        {/* Stylized map panel */}
        <motion.div initial={{ opacity: 0, x: vp.mobile ? 0 : 40, y: vp.mobile ? 28 : 0 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
          <div style={{ position: "relative", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 22, overflow: "hidden", boxShadow: `0 40px 100px ${T.shadowDeep}`, aspectRatio: "4/3" }}>
            {/* Grid background */}
            <div style={{ position: "absolute", inset: 0,
              backgroundImage: `linear-gradient(${T.grid} 1px, transparent 1px), linear-gradient(90deg, ${T.grid} 1px, transparent 1px)`,
              backgroundSize: "40px 40px" }} />
            {/* Faint India silhouette stand-in — a blob polygon */}
            <svg viewBox="0 0 400 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }}>
              <path d="M100,40 L160,30 L210,38 L250,55 L270,90 L280,130 L265,170 L250,200 L240,240 L210,265 L190,260 L170,240 L155,215 L130,200 L110,180 L90,155 L80,120 L85,80 Z" fill={T.accent} />
            </svg>
            {/* Animated connection lines */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25 }}>
              {NETWORK_NODES.slice(0, 6).map((a, i) =>
                NETWORK_NODES.slice(i + 1, i + 3).map((b, j) => (
                  <motion.line key={`${i}-${j}`}
                    x1={parseFloat(a.x)} y1={parseFloat(a.y)}
                    x2={parseFloat(b.x)} y2={parseFloat(b.y)}
                    stroke={T.accent} strokeWidth="0.3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.5, 0.25] }}
                    transition={{ duration: 2.5, delay: i * 0.3, ease: "easeOut" }}
                  />
                ))
              )}
            </svg>
            {/* Nodes */}
            {NETWORK_NODES.map((node, i) => {
              const r = sz[node.size];
              return (
                <motion.div key={node.name}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setHov(node.name)}
                  onMouseLeave={() => setHov(null)}
                  style={{ position: "absolute", left: node.x, top: node.y, transform: "translate(-50%, -50%)", zIndex: 2, cursor: "pointer" }}>
                  {/* Pulse ring */}
                  {node.size === "lg" && !reduce && (
                    <motion.div animate={{ scale: [1, 2.4], opacity: [0.5, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5 }}
                      style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${T.accent}`, transform: "translate(-50%, -50%)", left: "50%", top: "50%", width: r * 2, height: r * 2 }} />
                  )}
                  <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", background: T.accent, border: `2px solid ${T.bgCard}`, boxShadow: `0 0 ${r * 2}px ${T.accentGlow}` }} />
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hov === node.name && (
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                        style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, padding: "0.35rem 0.65rem", whiteSpace: "nowrap", pointerEvents: "none", boxShadow: `0 8px 24px ${T.shadow}`, zIndex: 10 }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.text }}>{node.name}</div>
                        <div style={{ fontSize: "0.62rem", color: T.accent }}>{node.count} NGOs</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
            {/* Legend */}
            <div style={{ position: "absolute", bottom: "0.9rem", right: "0.9rem", background: T.bgGlass, backdropFilter: "blur(12px)", border: `1px solid ${T.borderGlass}`, borderRadius: 10, padding: "0.5rem 0.75rem" }}>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, color: T.textMuted, marginBottom: "0.3rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Legend</div>
              {[["lg", "Metro Hub", 7], ["md", "City Node", 5], ["sm", "District", 3.5]].map(([s, l, r]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                  <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.62rem", color: T.textSub }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONBOARDING STEPS
═══════════════════════════════════════════════════════════════ */
function OnboardingSteps() {
  const { T } = useT();
  const vp = useViewport();
  const steps = [
    { n: "01", title: "Submit your NGO", desc: "Fill in your organization's details, operational area, specialization, and current capacity. Takes under 10 minutes." },
    { n: "02", title: "Verification Review", desc: "Our team verifies your registration documents, rescue history, and references within 48 hours." },
    { n: "03", title: "Join the Network", desc: "Get your dashboard, connect with nearby NGOs and clinics, and start receiving automated rescue alerts in your zone." },
    { n: "04", title: "Grow Together", desc: "Access AI tools, adoption listings, donor connections, and community funding rounds exclusive to ResQNet partners." },
  ];

  return (
    <section style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "3px", height: "100%", background: `linear-gradient(to bottom, transparent, ${T.accent}, transparent)` }} />

      <div style={{ width: "100%", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>NGO Onboarding</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: 0 }}>
            Join the network in<br />four simple steps.
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "1fr 1fr" : "repeat(4, 1fr)", gap: "clamp(0.75rem, 2vw, 1.25rem)" }}>
          {steps.map((s, i) => (
            <motion.div key={s.n} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
              style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: "clamp(1.2rem, 2.5vw, 1.75rem)", position: "relative", overflow: "hidden", boxShadow: `0 2px 14px ${T.shadow}` }}>
              {/* Number watermark */}
              <div style={{ position: "absolute", top: "-0.5rem", right: "0.75rem", fontSize: "3.5rem", fontWeight: 900, color: T.accentPale, letterSpacing: "-0.06em", lineHeight: 1, userSelect: "none" }}>{s.n}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.accentPale, border: `1px solid ${T.accentGlow}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 900, color: T.accent }}>{s.n}</span>
              </div>
              <h3 style={{ fontSize: "clamp(0.9rem, 1.8vw, 1rem)", fontWeight: 700, color: T.text, margin: "0 0 0.5rem" }}>{s.title}</h3>
              <p style={{ fontSize: "0.78rem", color: T.textSub, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  { name: "Priya Menon",     role: "Director, Paws of Hope",         quote: "ResQNet cut our average response time from 40 minutes to 18. The AI dispatch is a genuine lifesaver — literally.", city: "Mumbai" },
  { name: "Arjun Khanna",    role: "Founder, Urban Canine Coalition", quote: "The adoption pipeline alone has tripled our placements. We reach adopters we'd never have found on our own.",  city: "Delhi" },
  { name: "Sneha Rao",       role: "Head of Care, Wildlife Bridge",   quote: "Finally, a platform built by people who actually understand what field rescuers need. Nothing else comes close.",   city: "Pune" },
];

function Testimonials() {
  const { T } = useT();
  return (
    <section style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bgAlt, position: "relative", overflow: "hidden" }}>
      <Orbs />
      <div style={{ position: "relative", zIndex: 1, width: "100%", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
          style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>Partner Voices</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: 0 }}>
            Trusted by those<br />on the front lines.
          </h2>
        </motion.div>

        <div style={{ display: "flex", gap: "clamp(0.75rem, 2vw, 1.25rem)", flexWrap: "wrap", justifyContent: "center" }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
              style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18,
                padding: "clamp(1.3rem, 2.5vw, 1.8rem)", flex: "1 1 clamp(260px, 28vw, 360px)",
                boxShadow: `0 2px 18px ${T.shadow}`, position: "relative" }}>
              {/* Quote mark */}
              <div style={{ position: "absolute", top: "1rem", right: "1.2rem", fontSize: "3rem", fontWeight: 900, color: T.accentPale, lineHeight: 1 }}>"</div>
              <div style={{ display: "flex", gap: 3, marginBottom: "1rem" }}>
                {[...Array(5)].map((_, k) => <div key={k} style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }} />)}
              </div>
              <p style={{ fontSize: "0.88rem", color: T.textSub, lineHeight: 1.78, margin: "0 0 1.25rem", fontStyle: "italic" }}>"{t.quote}"</p>
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.86rem", fontWeight: 700, color: T.text }}>{t.name}</div>
                  <div style={{ fontSize: "0.72rem", color: T.textMuted }}>{t.role}</div>
                </div>
                <span style={{ fontSize: "0.65rem", color: T.accent, background: T.accentPale, padding: "0.18rem 0.55rem", borderRadius: 20, fontWeight: 600 }}>{t.city}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CTA SECTION
═══════════════════════════════════════════════════════════════ */
function CTASection() {
  const { T } = useT();
  return (
    <section style={{ width: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=2000&q=70" alt="" aria-hidden
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 50%", opacity: 0.09, filter: "grayscale(30%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${T.bg} 0%, ${T.bgAlt} 55%, ${T.accentPale} 100%)` }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3.5rem)", textAlign: "center" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}>
          <Label>Get Started</Label>
          <h2 style={{ fontSize: "clamp(2rem, 6vw, 4.2rem)", fontWeight: 900, letterSpacing: "-0.045em", margin: "0 0 1.1rem", color: T.text, lineHeight: 1.08 }}>
            Your NGO belongs<br />
            <span style={{ background: `linear-gradient(100deg, ${T.accent} 0%, ${T.accentDim} 55%, ${T.accent} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              in this network.
            </span>
          </h2>
          <p style={{ color: T.textSub, margin: "0 auto 2.5rem", lineHeight: 1.75, fontSize: "clamp(0.9rem, 2vw, 1.05rem)" }}>
            Register today and connect your rescue operations with the most advanced coordination platform for animal welfare in India — free for verified NGOs.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="primary" size="lg">Register Your NGO — Free</Btn>
            <Btn variant="ghost"   size="lg">Talk to Our Team</Btn>
          </div>
          <div style={{ marginTop: "1.5rem", fontSize: "0.72rem", color: T.textMuted }}>
            No cost for verified NGOs · Verified in 48 hrs · 312+ organizations already onboard
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════ */
export default function NGOs() {
  const { T } = useT();

  return (
    <>
      <Navbar />

      <main
        style={{
          width: "100%",
          overflowX: "hidden",
          background: T.bg,
        }}
      >
        <Hero />
        <NGOStats />
        <NGODirectory />
        <NetworkMap />
        <OnboardingSteps />
        <Testimonials />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}