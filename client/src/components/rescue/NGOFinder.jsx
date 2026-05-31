import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Label from "../ui/Label";
import Button from "../ui/Button";
import { vFadeUp } from "../../animations/variants";
import { fetchNgos } from "../../services/userService";
import { getCurrentPosition, extractCityFromAddress } from "../../utils/geo";
import NgoMap from "../maps/NgoMap";
import NearbyNgoList from "../maps/NearbyNgoList";

export default function NGOFinder({ id, onAssign, addressHint = "" }) {
  const { T } = useT();
  const vp = useViewport();
  const [locating, setLocating] = useState(false);
  const [located, setLocated] = useState(false);
  const [locationLabel, setLocationLabel] = useState("");
  const [position, setPosition] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [error, setError] = useState("");
  const [assignedNGO, setAssignedNGO] = useState(null);
  const [modalNGO, setModalNGO] = useState(null);

  const loadNgos = async ({ city, latitude, longitude } = {}) => {
    const result = await fetchNgos({ city, address: addressHint, latitude, longitude });
    if (result.success) {
      const fetched = result.data.ngos || [];
      const unique = [];
      const seenNames = new Set();
      
      for (const ngo of fetched) {
        if (!ngo) continue;
        const name = (ngo.organizationName || ngo.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        if (name && seenNames.has(name)) continue;
        if (name) seenNames.add(name);
        unique.push(ngo);
      }
      
      setNgos(unique);
      setLocationLabel(result.data.city || city || "your area");
      setError("");
    } else {
      setNgos([]);
      setError(result.message || "Unable to load NGOs");
    }
  };

  const handleLocate = async () => {
    setLocating(true);
    setError("");
    try {
      const position = await getCurrentPosition();
      setPosition(position);
      const city = extractCityFromAddress(addressHint);
      await loadNgos({ city, latitude: position.latitude, longitude: position.longitude });
      setLocated(true);
      setLocationLabel(city || `GPS ${position.latitude.toFixed(2)}, ${position.longitude.toFixed(2)}`);
    } catch {
      const city = extractCityFromAddress(addressHint);
      await loadNgos({ city });
      setLocated(true);
      setLocationLabel(city || "Nationwide directory");
      setError("Location permission denied — showing directory by city when available.");
    } finally {
      setLocating(false);
    }
  };

  return (
    <section id={id} style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bg }}>
      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp} style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>NGO Matcher</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, color: T.text, margin: "0 0 0.75rem" }}>
            Nearest Rescue Teams, Ready Now.
          </h2>
          <p style={{ color: T.textSub, maxWidth: 520, margin: "0 auto 1.5rem", lineHeight: 1.7 }}>
            Registered NGOs from the ResQNet network, matched by your location.
          </p>
          {!located ? (
            <Button variant="primary" onClick={handleLocate} disabled={locating}>
              {locating ? "Detecting…" : "📍 Find Nearby NGOs"}
            </Button>
          ) : (
            <span style={{ display: "inline-block", padding: "0.5rem 1rem", borderRadius: 30, background: T.accentPale, color: T.accent, fontWeight: 600, fontSize: "0.85rem" }}>
              ✓ Near {locationLabel}
            </span>
          )}
          {error && <p style={{ marginTop: 12, color: T.textMuted, fontSize: "0.85rem" }}>{error}</p>}
        </motion.div>

        {located && ngos.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: "1.5rem" }}
            >
              <NgoMap ngos={ngos} userPosition={position} center={position} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: "1.5rem" }}
            >
              <NearbyNgoList
                ngos={ngos}
                currentLocation={position}
                selectedNgo={assignedNGO}
                onSelectNgo={(ngo) => {
                  setAssignedNGO(ngo);
                  onAssign?.(ngo);
                }}
              />
            </motion.div>
          </>
        )}

        <AnimatePresence>
          {located && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr", gap: "1.25rem" }}
            >
              {ngos.length === 0 ? (
                <p style={{ gridColumn: "1 / -1", textAlign: "center", color: T.textMuted }}>No NGOs found. Submit a rescue request first.</p>
              ) : (
                ngos.map((ngo) => (
                  <motion.div
                    key={ngo.id}
                    style={{
                      borderRadius: 18,
                      border: `1px solid ${assignedNGO?.id === ngo.id ? T.accent : T.border}`,
                      background: T.bgCard,
                      padding: "1.25rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 800 }}>{ngo.name}</div>
                        <div style={{ fontSize: "0.8rem", color: T.textMuted }}>{ngo.city}</div>
                      </div>
                      {ngo.distance && <span style={{ color: T.accent, fontWeight: 700, fontSize: "0.75rem" }}>{ngo.distance}</span>}
                    </div>
                    <p style={{ fontSize: "0.78rem", color: T.textSub, marginBottom: 12 }}>{ngo.specialties?.join(" · ")}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button variant="ghost" size="sm" onClick={() => setModalNGO(ngo)}>Details</Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setAssignedNGO(ngo);
                          onAssign?.(ngo);
                        }}
                        disabled={assignedNGO?.id === ngo.id}
                      >
                        {assignedNGO?.id === ngo.id ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {modalNGO && (
        <motion.div
          role="presentation"
          onClick={() => setModalNGO(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 400, display: "grid", placeItems: "center", padding: 20 }}
        >
          <motion.div
            role="dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ background: T.bgCard, borderRadius: 16, padding: 24, maxWidth: 400, width: "100%" }}
          >
            <h3>{modalNGO.name}</h3>
            <p style={{ color: T.textSub }}>{modalNGO.city}</p>
            <Button variant="primary" onClick={() => setModalNGO(null)} style={{ marginTop: 16 }}>
              Close
            </Button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
