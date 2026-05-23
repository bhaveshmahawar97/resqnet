import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { vFadeUp } from "../../animations/variants";
import Btn from "../ui/Button";
import Label from "../ui/Label";
import { fetchNgos } from "../../services/userService";
import { TYPE_COLORS, ALL_STATUS } from "../../data/ngos";

function FilterBar({ typeOptions, typeFilter, setTypeFilter, statusFilter, setStatusFilter, search, setSearch }) {
  const { T } = useT();
  const vp = useViewport();

  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
      style={{ display: "flex", gap: "clamp(0.6rem, 1.5vw, 1rem)", flexWrap: "wrap", alignItems: "center", marginBottom: "clamp(1.5rem, 4vw, 2.5rem)" }}>

      {/* Search */}
      <div style={{ position: "relative", flex: vp.mobile ? "1 1 100%" : "1 1 240px", minWidth: vp.mobile ? "100%" : 200 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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
        {typeOptions.map((t) => {
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
        {ALL_STATUS.map((s) => {
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

function NGOCard({ ngo, i }) {
  const { T } = useT();
  const [hov, setHov] = useState(false);
  const type = (ngo.specialties || ["Partner"])[0];
  const focus = (ngo.specialties || []).slice(0, 3).join(", ") || "Rescue support";
  const tc = TYPE_COLORS[type] || TYPE_COLORS.Rescue;

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
        borderRadius: 14,
        padding: "clamp(1.1rem, 2.5vw, 1.6rem)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? T.shadowHov : T.shadow,
        flex: "1 1 clamp(280px, 30vw, 380px)",
        display: "flex", flexDirection: "column", gap: "1rem",
      }}>

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: T.accentPale, border: `1px solid ${T.accentGlow}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: "clamp(0.86rem, 1.8vw, 0.98rem)", fontWeight: 700, margin: 0, color: T.text, lineHeight: 1.3 }}>{ngo.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: "0.18rem" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span style={{ fontSize: "0.72rem", color: T.textSub }}>{ngo.city}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
          <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: tc.text, background: tc.bg, padding: "0.18rem 0.55rem", borderRadius: 20 }}>{type}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: ngo.verified ? T.accent : "#F59E0B" }} />
            <span style={{ fontSize: "0.65rem", color: ngo.verified ? T.accent : "#D97706", fontWeight: 600 }}>{ngo.verified ? "Verified" : "Unverified"}</span>
          </div>
        </div>
      </div>

      {/* Focus tag */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {focus && (
          <span style={{ fontSize: "0.66rem", color: T.textSub, background: T.bgAlt, border: `1px solid ${T.border}`, padding: "0.18rem 0.6rem", borderRadius: 20 }}>{focus}</span>
        )}
        {(ngo.distance || ngo.responseTime) && (
          <span style={{ fontSize: "0.66rem", color: T.textSub, background: T.bgAlt, border: `1px solid ${T.border}`, padding: "0.18rem 0.6rem", borderRadius: 20 }}>
            {ngo.distance ? `${ngo.distance} away` : ngo.responseTime}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", borderTop: `1px solid ${T.border}`, paddingTop: "0.9rem" }}>
        {[
          { val: ngo.responseTime || "~20 min", sub: "Response" },
          { val: ngo.missionsCompleted?.toLocaleString?.() ?? 0, sub: "Missions" },
          { val: `${ngo.rating ?? 4.8}★`, sub: "Rating" },
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function NGODirectory() {
  const { T } = useT();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadNgos = async () => {
      setLoading(true);
      const result = await fetchNgos({ limit: 50 });
      if (!mounted) return;
      if (result.success) {
        setNgos(result.data.ngos || []);
      } else {
        setError(result.message || "Unable to load NGOs");
      }
      setLoading(false);
    };
    loadNgos();
    return () => {
      mounted = false;
    };
  }, []);

  const typeOptions = [
    "All",
    ...Array.from(new Set(ngos.flatMap((ngo) => ngo.specialties || []))).filter(Boolean),
  ];

  const filtered = ngos.filter((n) => {
    const matchType =
      typeFilter === "All" || (n.specialties || []).includes(typeFilter);
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Verified" ? n.verified : !n.verified);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      n.name?.toLowerCase().includes(q) ||
      n.city?.toLowerCase().includes(q) ||
      (n.specialties || []).join(" ").toLowerCase().includes(q);
    return matchType && matchStatus && matchSearch;
  });

  const visible = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id="for-ngos" style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bg, position: "relative" }}>
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3rem)" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "clamp(1.5rem, 4vw, 2.5rem)" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: T.accentSurface || T.accentPale, border: `1px solid ${T.accentGlow}`, borderRadius: 9999, padding: "0.28rem 0.85rem", marginBottom: "0.85rem" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent, display: "inline-block" }} />
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>NGO Directory</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.textHeading, margin: 0, lineHeight: 1.2 }}>
              Verified organizations, real-world impact
            </h2>
          </div>
          <span style={{ fontSize: "0.76rem", color: T.textMuted }}>{filtered.length} results</span>
        </motion.div>

        <FilterBar
          typeOptions={typeOptions}
          typeFilter={typeFilter} setTypeFilter={setTypeFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          search={search} setSearch={setSearch}
        />

        <AnimatePresence mode="popLayout">
              {loading ? (
            <div style={{ display: "flex", gap: "clamp(0.65rem, 1.5vw, 1rem)", flexWrap: "wrap" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "clamp(280px, 30vw, 380px)", height: 240,
                    borderRadius: 14, background: T.bgCard,
                    border: `1px solid ${T.border}`,
                    boxShadow: `0 2px 14px ${T.shadow}`,
                  }}
                />
              ))}
            </div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "4rem 0", color: T.textMuted }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚠️</div>
              <div style={{ fontSize: "0.9rem" }}>{error}</div>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "4rem 0", color: T.textMuted }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
              <div style={{ fontSize: "0.9rem" }}>No NGOs match your filters. Try a different search.</div>
            </motion.div>
          ) : (
            <motion.div key="grid" layout style={{ display: "flex", gap: "clamp(0.65rem, 1.5vw, 1rem)", flexWrap: "wrap" }}>
              {visible.map((n, i) => <NGOCard key={n.id || n.name} ngo={n} i={i % 6} />)}
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
