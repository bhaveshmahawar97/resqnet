import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { fetchNgos } from "../../services/userService";
import { fetchMapFacilities } from "../../services/mapService";
import { getCurrentPosition, geocodeAddress } from "../../services/geocodingService";
import NgoCard from "./NgoCard";
import SkeletonCard from "../system/SkeletonCard";
import EmptyState from "../system/EmptyState";

const ALL_STATUS = ["All", "Verified", "Map Results"];

function SearchBar({ search, setSearch, onLocationSearch, isLocating, T, vp }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onLocationSearch(search);
    }
  };

  return (
    <div style={{
      display: "flex",
      gap: "0.65rem",
      flex: vp.mobile ? "1 1 100%" : "1 1 auto",
      maxWidth: vp.mobile ? "100%" : 480,
    }}>
      <div style={{ position: "relative", flex: 1 }}>
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
          placeholder="Search by city, name, or service..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
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
          onFocus={e => {
            e.target.style.borderColor = T.accent;
            e.target.style.boxShadow = `0 0 0 3px ${T.ring}`;
          }}
          onBlur={e => {
            e.target.style.borderColor = T.border;
            e.target.style.boxShadow = T.shadowSm;
          }}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onLocationSearch(search)}
        disabled={isLocating}
        style={{
          padding: "0 1.25rem",
          borderRadius: "var(--radius-md)",
          border: "none",
          background: T.accent,
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.85rem",
          cursor: isLocating ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          opacity: isLocating ? 0.6 : 1,
        }}
      >
        {isLocating ? "Searching..." : "Search"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onLocationSearch(null)}
        disabled={isLocating}
        title="Use My Location"
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius-md)",
          border: `1px solid ${T.border}`,
          background: T.bgCard,
          color: T.text,
          cursor: isLocating ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          opacity: isLocating ? 0.6 : 1,
        }}
      >
        {isLocating ? "..." : "📍"}
      </motion.button>
    </div>
  );
}

function FilterChips({ options, activeFilter, setFilter, T }) {
  return (
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
  );
}

export default function NGODirectory() {
  const { T } = useT();
  const vp = useViewport();
  const [dbNgos, setDbNgos] = useState([]);
  const [mapNgos, setMapNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");

  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Initial Load
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      const dbRes = await fetchNgos({ limit: 100 });
      if (!mounted) return;
      if (dbRes.success) {
        setDbNgos(dbRes.data.ngos || []);
      } else {
        setError(dbRes.message || "Unable to load NGOs");
      }
      setLoading(false);

      // Attempt geolocation
      try {
        setIsLocating(true);
        const loc = await getCurrentPosition();
        if (mounted && loc) {
          const mapResults = await fetchMapFacilities(loc.latitude, loc.longitude);
          if (mounted) setMapNgos(mapResults);
        }
      } catch (err) {
        console.warn("Geolocation permission denied or failed.");
      } finally {
        if (mounted) setIsLocating(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  // Handle Location Search
  const handleLocationSearch = async (query) => {
    setError("");
    if (!query) {
      // Use My Location
      try {
        setIsLocating(true);
        const loc = await getCurrentPosition();
        const mapResults = await fetchMapFacilities(loc.latitude, loc.longitude);
        if (mapResults.length === 0) {
          setError("No rescue partners found within 50km of your location.");
        }
        setMapNgos(mapResults);
      } catch (err) {
        setError("Could not access your location. Please check browser permissions.");
      } finally {
        setIsLocating(false);
      }
      return;
    }

    // Text search
    try {
      setIsLocating(true);
      const geoResult = await geocodeAddress(query);
      if (geoResult) {
        const mapResults = await fetchMapFacilities(geoResult.latitude, geoResult.longitude);
        if (mapResults.length === 0) {
          setError(`No rescue partners found near "${geoResult.displayName}".`);
        }
        setMapNgos(mapResults);
      } else {
        setError("Location not found. Please try a different city name.");
      }
    } catch (err) {
      console.error("Geocoding search failed", err);
      setError("Search failed. Please try again.");
    } finally {
      setIsLocating(false);
    }
  };

  // Strong deduplication for all combined NGOs to prevent any double listings
  const getUniqueNgos = (dbList, mapList) => {
    const combined = [...dbList, ...mapList];
    const unique = [];
    const seenIds = new Set();
    const seenNames = new Set();

    for (const ngo of combined) {
      if (!ngo) continue;

      const id = ngo._id || ngo.id;
      const name = (ngo.organizationName || ngo.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

      if (id && seenIds.has(id)) continue;
      if (name && seenNames.has(name)) continue;

      if (id) seenIds.add(id);
      if (name) seenNames.add(name);

      unique.push(ngo);
    }
    return unique;
  };

  const allCombinedNgos = getUniqueNgos(dbNgos, mapNgos);

  const typeOptions = [
    "All",
    "Rescue",
    "Shelter",
    "Medical",
    "Wildlife",
    "Adoption",
    "Welfare"
  ];

  const filtered = allCombinedNgos.filter((n) => {
    const matchType = typeFilter === "All" || (n.specialties || []).includes(typeFilter);

    let matchStatus = true;
    if (statusFilter === "Verified") {
      matchStatus = n.verified === true;
    } else if (statusFilter === "Map Results") {
      matchStatus = n.isMapResult === true;
    }

    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      n.name?.toLowerCase().includes(q) ||
      n.organizationName?.toLowerCase().includes(q) ||
      n.city?.toLowerCase().includes(q) ||
      (n.specialties || []).join(" ").toLowerCase().includes(q);

    return matchType && matchStatus && matchSearch;
  });

  const visible = showAll ? filtered : filtered.slice(0, 9);

  return (
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
        <SearchBar
          search={search}
          setSearch={setSearch}
          onLocationSearch={handleLocationSearch}
          isLocating={isLocating}
          T={T}
          vp={vp}
        />

        {/* Filter Chips */}
        <div style={{
          display: "flex",
          flexDirection: vp.mobile ? "column" : "row",
          gap: "1rem",
          alignItems: vp.mobile ? "flex-start" : "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: T.textMuted,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Services:
            </span>
            <FilterChips
              options={typeOptions}
              activeFilter={typeFilter}
              setFilter={setTypeFilter}
              T={T}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: T.textMuted,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Status:
            </span>
            <FilterChips
              options={ALL_STATUS}
              activeFilter={statusFilter}
              setFilter={setStatusFilter}
              T={T}
            />
          </div>
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
            Showing <strong style={{ fontWeight: 700, color: T.text }}>{visible.length}</strong> of <strong style={{ fontWeight: 700, color: T.text }}>{filtered.length}</strong> rescue partners
          </span>
          {filtered.length > 0 && (
            <span style={{ fontSize: "0.75rem", color: T.textMuted }}>
              {statusFilter === "Verified" ? "✓ Verified only" : statusFilter === "Map Results" ? "📍 Map results" : "All partners"}
            </span>
          )}
        </div>
      </motion.div>

      {/* Results Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} height={280} />)}
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
            }}
          >
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "var(--radius-lg)",
              background: T.dangerPale,
              border: `2px solid ${T.dangerBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "1.75rem",
            }}>
              ⚠️
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: T.text, marginBottom: "0.5rem" }}>
              Search Error
            </div>
            <div style={{ fontSize: "0.85rem", color: T.textMuted, maxWidth: 400, margin: "0 auto" }}>
              {error}
            </div>
          </motion.div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No Rescue Partners Found"
            message="Try adjusting your search criteria or filters to find rescue organizations."
            minHeight="300px"
          />
        ) : (
          <motion.div
            key="grid"
            layout
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {visible.map((n, i) => (
              <NgoCard key={n._id || n.id || i} ngo={n} i={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show More Button */}
      {filtered.length > 9 && (
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
            onClick={() => setShowAll(o => !o)}
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
            {showAll ? "Show Less" : `Show All ${filtered.length} Partners`}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
