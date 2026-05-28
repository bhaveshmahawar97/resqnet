import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { vFadeUp } from "../../animations/variants";
import Btn from "../ui/Button";
import { fetchNgos } from "../../services/userService";
import NgoCard from "./NgoCard";
import SkeletonCard from "../system/SkeletonCard";
import EmptyState from "../system/EmptyState";

const ALL_STATUS = ["All", "Verified"];
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

// NGOCard moved to NgoCard.jsx

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
      (statusFilter === "Verified" ? n.verified : false);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      n.name?.toLowerCase().includes(q) ||
      n.city?.toLowerCase().includes(q) ||
      (n.specialties || []).join(" ").toLowerCase().includes(q);
    return matchType && matchStatus && matchSearch && n.verified;
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "clamp(0.65rem, 1.5vw, 1rem)", marginBottom: "2rem" }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} height={240} />)}
            </div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "4rem 0", color: T.textMuted }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚠️</div>
              <div style={{ fontSize: "0.9rem" }}>{error}</div>
            </motion.div>
          ) : filtered.length === 0 ? (
            <EmptyState icon="🔍" title="No NGOs Found" message="No NGOs match your filters. Try a different search." minHeight="250px" />
          ) : (
            <motion.div key="grid" layout style={{ display: "flex", gap: "clamp(0.65rem, 1.5vw, 1rem)", flexWrap: "wrap" }}>
              {visible.map((n, i) => <NgoCard key={`${n.id || n._id || n.name || 'ngo'}-${i}`} ngo={n} i={i % 6} />)}
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
