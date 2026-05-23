import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Label from "../ui/Label";
import Button from "../ui/Button";
import AnimalCard from "./AnimalCard";
import AdoptionModal from "./AdoptionModal";
import { vFadeUp } from "../../animations/variants";
import { useAdoption } from "../../context/AdoptionContext";
import SkeletonCard from "../system/SkeletonCard";
import EmptyState from "../system/EmptyState";

const ALL_SPECIES  = ["All", "Dog", "Cat", "Bird", "Rabbit", "Wildlife"];
const ALL_STATUSES = ["All", "Available", "In Foster", "On Hold"];
import { useAuth } from "../../context/AuthContext";

const PLACEHOLDER_IMG = (species) =>
  `https://placehold.co/480x360/f5f5f5/666?text=${encodeURIComponent(species || "Animal")}`;

const toAnimalCard = (listing) => ({
  ...listing,
  img: listing.images?.[0] || PLACEHOLDER_IMG(listing.species),
  status: listing.status === "listed" ? "Available" : listing.status === "pending_review" ? "Pending" : "Available",
});

/* ── Filter bar ─────────────────────────────────────────────────────────────── */
function FilterBar({ speciesFilter, setSpeciesFilter, statusFilter, setStatusFilter, search, setSearch }) {
  const { T } = useT();
  const vp    = useViewport();

  const pillStyle = (active) => ({
    padding: "0.38rem 1rem",
    borderRadius: 30,
    border: `1px solid ${active ? T.accent : T.border}`,
    background: active ? T.accentPale : "transparent",
    color: active ? T.accent : T.textSub,
    fontSize: "0.76rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  });

  const SPECIES_LABELS = {
    All: "🐾 All", Dog: "🐕 Dogs", Cat: "🐈 Cats",
    Bird: "🐦 Birds", Wildlife: "🦎 Wildlife", Rabbit: "🐇 Rabbits",
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={vFadeUp}
      style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginBottom: "clamp(1.5rem, 4vw, 2.5rem)" }}
    >
      {/* Search + status row */}
      <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", alignItems: "center" }}>
        {/* Search input */}
        <div style={{ position: "relative", flex: vp.mobile ? "1 1 100%" : "1 1 260px", minWidth: vp.mobile ? "100%" : 200 }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke={T.textMuted} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, breed, city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.52rem 0.9rem 0.52rem 2.4rem",
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              background: T.bgCard,
              color: T.text,
              fontSize: "0.82rem",
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Status pills */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {ALL_STATUSES.map((s) => (
            <motion.button
              key={s}
              onClick={() => setStatusFilter(s)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={pillStyle(statusFilter === s)}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Species pills row */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {ALL_SPECIES.map((sp) => (
          <motion.button
            key={sp}
            onClick={() => setSpeciesFilter(sp)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={pillStyle(speciesFilter === sp)}
          >
            {SPECIES_LABELS[sp] || sp}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Main grid ──────────────────────────────────────────────────────────────── */
export default function AdoptionGrid() {
  const { T } = useT();
  const { listings, loading } = useAdoption();
  const animals = listings.map(toAnimalCard);
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [search,        setSearch]        = useState("");
  const [showAll,       setShowAll]       = useState(false);
  const [adoptAnimal,   setAdoptAnimal]   = useState(null);

  const filtered = animals.filter((a) => {
    const matchSpecies = speciesFilter === "All" || a.species === speciesFilter;
    const matchStatus  = statusFilter  === "All" || a.status  === statusFilter;
    const q            = search.toLowerCase();
    const matchSearch  =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.breed.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.ngo.toLowerCase().includes(q);
    return matchSpecies && matchStatus && matchSearch;
  });

  const visible = showAll ? filtered : filtered.slice(0, 6);

  return (
    <>
      <section
        id="adopt"
        style={{
          width: "100%",
          padding: "clamp(3.5rem, 8vw, 6rem) 0",
          background: T.bg,
          position: "relative",
        }}
      >
        <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3rem)" }}>
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={vFadeUp}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: T.accentSurface || T.accentPale, border: `1px solid ${T.accentGlow}`, borderRadius: 9999, padding: "0.28rem 0.85rem", marginBottom: "0.85rem" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent, display: "inline-block" }} />
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: T.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>Adoption Hub</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.textHeading, margin: 0, lineHeight: 1.2 }}>
                Find your forever companion
              </h2>
            </div>
            <span style={{ fontSize: "0.76rem", color: T.textMuted }}>
              {filtered.length} animal{filtered.length !== 1 ? "s" : ""}
            </span>
          </motion.div>

          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "clamp(0.65rem, 1.5vw, 1rem)", marginBottom: "2rem" }}>
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} height={300} />)}
            </div>
          )}

          <FilterBar
            speciesFilter={speciesFilter} setSpeciesFilter={setSpeciesFilter}
            statusFilter={statusFilter}   setStatusFilter={setStatusFilter}
            search={search}               setSearch={setSearch}
          />

          {/* Cards */}
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState icon="🔍" title="No Animals Found" message="No animals match your filters. Try broadening your search." minHeight="250px" />
            ) : (
              <motion.div
                key="grid"
                layout
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "clamp(0.65rem, 1.5vw, 1rem)" }}
              >
                {visible.map((a, i) => (
                  <AnimalCard
                    key={a.id}
                    animal={a}
                    i={i % 6}
                    onAdopt={setAdoptAnimal}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show more / less */}
          {filtered.length > 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ textAlign: "center", marginTop: "clamp(1.8rem, 4vw, 2.8rem)" }}
            >
              <Button variant="ghost" onClick={() => setShowAll((o) => !o)}>
                {showAll ? "Show Less" : `Show All ${filtered.length} Animals`}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Adoption modal */}
      {adoptAnimal && (
        <AdoptionModal animal={adoptAnimal} onClose={() => setAdoptAnimal(null)} />
      )}
    </>
  );
}
