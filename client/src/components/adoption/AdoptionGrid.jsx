import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Button from "../ui/Button";
import AnimalCard from "./AnimalCard";
import AdoptionModal from "./AdoptionModal";
import { useAdoption } from "../../context/AdoptionContext";
import SkeletonCard from "../system/SkeletonCard";
import EmptyState from "../system/EmptyState";

const ALL_SPECIES  = ["All", "Dog", "Cat", "Bird", "Rabbit", "Wildlife"];
const ALL_STATUSES = ["All", "Available", "In Foster", "On Hold"];
const ALL_AGES = ["All", "Puppy/Kitten", "Adult", "Senior"];

const PLACEHOLDER_IMG = (species) =>
  `https://placehold.co/480x360/f5f5f5/666?text=${encodeURIComponent(species || "Animal")}`;

const toAnimalCard = (listing) => ({
  ...listing,
  img: listing.images?.[0] || PLACEHOLDER_IMG(listing.species),
  status: listing.status === "listed" ? "Available" : listing.status === "pending_review" ? "Pending" : "Available",
});

function SearchBar({ search, setSearch, T, vp }) {
  return (
    <div style={{
      position: "relative",
      flex: vp.mobile ? "1 1 100%" : "1 1 auto",
      maxWidth: vp.mobile ? "100%" : 480,
    }}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={T.textMuted}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search by name, breed, or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "0.75rem 1rem 0.75rem 2.75rem",
          borderRadius: "var(--radius-md)",
          border: `1px solid ${T.border}`,
          background: T.bgCard,
          color: T.text,
          fontSize: "0.85rem",
          fontFamily: "inherit",
          outline: "none",
          boxShadow: T.shadowSm,
          transition: "all 0.2s ease",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = T.accent;
          e.target.style.boxShadow = `0 0 0 3px ${T.ring}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = T.border;
          e.target.style.boxShadow = T.shadowSm;
        }}
      />
    </div>
  );
}

function FilterChips({ options, activeFilter, setFilter, T, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
      {label && (
        <span style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: T.textMuted,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          {label}:
        </span>
      )}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {options.map((option) => {
          const active = activeFilter === option;
          return (
            <motion.button
              key={option}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(option)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-full)",
                border: `1.5px solid ${active ? T.accent : T.border}`,
                background: active ? T.accentPale : T.bgCard,
                color: active ? T.accent : T.textSub,
                fontSize: "0.8rem",
                fontWeight: active ? 700 : 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
                boxShadow: active ? `0 2px 8px ${T.accent}20` : "none",
              }}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default function AdoptionGrid() {
  const { T } = useT();
  const vp = useViewport();
  const { listings, loading } = useAdoption();
  const animals = listings.map(toAnimalCard);

  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [ageFilter,     setAgeFilter]     = useState("All");
  const [search,        setSearch]        = useState("");
  const [showAll,       setShowAll]       = useState(false);
  const [adoptAnimal,   setAdoptAnimal]   = useState(null);

  const filtered = animals.filter((a) => {
    const matchSpecies = speciesFilter === "All" || a.species === speciesFilter;
    const matchStatus  = statusFilter  === "All" || a.status  === statusFilter;

    // Age filtering logic
    let matchAge = true;
    if (ageFilter !== "All") {
      const ageLower = a.age?.toLowerCase() || "";
      if (ageFilter === "Puppy/Kitten") {
        matchAge = ageLower.includes("puppy") || ageLower.includes("kitten") || ageLower.includes("young");
      } else if (ageFilter === "Adult") {
        matchAge = ageLower.includes("adult") || ageLower.includes("year");
      } else if (ageFilter === "Senior") {
        matchAge = ageLower.includes("senior") || ageLower.includes("old");
      }
    }

    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.name?.toLowerCase().includes(q) ||
      a.breed?.toLowerCase().includes(q) ||
      a.city?.toLowerCase().includes(q) ||
      a.ngo?.toLowerCase().includes(q);

    return matchSpecies && matchStatus && matchAge && matchSearch;
  });

  const visible = showAll ? filtered : filtered.slice(0, 9);

  return (
    <>
      <div style={{ width: "100%" }}>
        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {/* Search Bar */}
          <SearchBar search={search} setSearch={setSearch} T={T} vp={vp} />

          {/* Filter Chips */}
          <div style={{
            display: "flex",
            flexDirection: vp.mobile ? "column" : "row",
            gap: "1rem",
            flexWrap: "wrap",
          }}>
            <FilterChips
              label="Species"
              options={ALL_SPECIES}
              activeFilter={speciesFilter}
              setFilter={setSpeciesFilter}
              T={T}
            />
          </div>

          <div style={{
            display: "flex",
            flexDirection: vp.mobile ? "column" : "row",
            gap: "1rem",
            flexWrap: "wrap",
          }}>
            <FilterChips
              label="Status"
              options={ALL_STATUSES}
              activeFilter={statusFilter}
              setFilter={setStatusFilter}
              T={T}
            />

            <FilterChips
              label="Age"
              options={ALL_AGES}
              activeFilter={ageFilter}
              setFilter={setAgeFilter}
              T={T}
            />
          </div>

          {/* Results Count */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.65rem 1rem",
            borderRadius: "var(--radius-md)",
            background: T.bgAlt,
            border: `1px solid ${T.borderLight}`,
          }}>
            <span style={{ fontSize: "0.82rem", color: T.textSub }}>
              Showing <strong style={{ fontWeight: 700, color: T.text }}>{visible.length}</strong> of <strong style={{ fontWeight: 700, color: T.text }}>{filtered.length}</strong> animals
            </span>
            {filtered.length > 0 && (
              <span style={{ fontSize: "0.75rem", color: T.textMuted }}>
                {speciesFilter !== "All" ? `${speciesFilter}s` : "All species"}
              </span>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} height={420} />)}
          </div>
        )}

        {/* Results Grid */}
        {!loading && (
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No Animals Found"
                message="No animals match your search criteria. Try adjusting your filters or search terms."
                minHeight="300px"
              />
            ) : (
              <motion.div
                key="grid"
                layout
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1rem",
                }}
              >
                {visible.map((a, i) => (
                  <AnimalCard
                    key={a.id || i}
                    animal={a}
                    i={i}
                    onAdopt={setAdoptAnimal}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Show More Button */}
        {!loading && filtered.length > 9 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              marginTop: "2.5rem",
            }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAll((o) => !o)}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${T.border}`,
                background: T.bgCard,
                color: T.text,
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.bgAlt;
                e.currentTarget.style.borderColor = T.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.bgCard;
                e.currentTarget.style.borderColor = T.border;
              }}
            >
              {showAll ? "Show Less" : `Show All ${filtered.length} Animals`}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Adoption Modal */}
      {adoptAnimal && (
        <AdoptionModal animal={adoptAnimal} onClose={() => setAdoptAnimal(null)} />
      )}
    </>
  );
}
