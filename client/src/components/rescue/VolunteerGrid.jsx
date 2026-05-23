import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import Label from "../ui/Label";
import Button from "../ui/Button";
import { vFadeUp } from "../../animations/variants";

const VOLUNTEERS = [
  { id: 1, name: "Rahul Sharma", role: "Senior Rescue Specialist", distance: "1.2 km", responseTime: "~4 min", skills: ["Large Animals", "First Aid", "Wildlife"], cases: 234, rating: 4.9, status: "available", avatar: "👨‍⚕️" },
  { id: 2, name: "Priya Mehta", role: "Veterinary Volunteer", distance: "2.8 km", responseTime: "~9 min", skills: ["Surgery", "Rehabilitation", "Cats/Dogs"], cases: 187, rating: 4.8, status: "available", avatar: "👩‍⚕️" },
  { id: 3, name: "Arjun Singh", role: "Field Rescue Coordinator", distance: "3.5 km", responseTime: "~12 min", skills: ["Emergency", "Transport", "Horses"], cases: 156, rating: 4.7, status: "on-rescue", avatar: "🧑‍🚒" },
  { id: 4, name: "Kavya Nair", role: "Wildlife Specialist", distance: "5.1 km", responseTime: "~17 min", skills: ["Birds", "Reptiles", "Snakes"], cases: 92, rating: 4.9, status: "available", avatar: "👩‍🔬" },
  { id: 5, name: "Deepak Joshi", role: "Emergency Responder", distance: "6.4 km", responseTime: "~21 min", skills: ["Trauma Care", "Stray Dogs", "Cows"], cases: 311, rating: 4.6, status: "available", avatar: "🧑‍⚕️" },
  { id: 6, name: "Meena Pillai", role: "Animal Welfare Officer", distance: "8.2 km", responseTime: "~26 min", skills: ["Legal", "Rescue", "Adoption"], cases: 145, rating: 4.8, status: "off-duty", avatar: "👩‍💼" },
];

export default function VolunteerGrid() {
  const { T } = useT();
  const vp = useViewport();
  const [assigned, setAssigned] = useState(new Set());
  const [profileModal, setProfileModal] = useState(null);
  const [filter, setFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Volunteers" },
    { id: "available", label: "Available" },
    { id: "on-rescue", label: "On Rescue" },
  ];

  const filtered = filter === "all" ? VOLUNTEERS : VOLUNTEERS.filter((v) => v.status === filter);

  const STATUS_CONFIG = {
    available: { color: "#22C55E", label: "Available", bg: "rgba(34,197,94,0.12)" },
    "on-rescue": { color: "#F97316", label: "On Rescue", bg: "rgba(249,115,22,0.12)" },
    "off-duty": { color: "#6B7280", label: "Off Duty", bg: "rgba(107,114,128,0.12)" },
  };

  return (
    <section style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bgAlt, position: "relative", overflow: "hidden" }}>


      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)", position: "relative", zIndex: 1 }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp} style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <Label>Volunteer Network</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", color: T.text, margin: "0 0 0.75rem" }}>
            Rescue Responders Near You
          </h2>
          <p style={{ color: T.textSub, fontSize: "clamp(0.88rem, 2vw, 1rem)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Trained field volunteers ready to respond. Assign them directly to your rescue request.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
          {filters.map((f) => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(f.id)}
              style={{
                padding: "0.45rem 1.1rem",
                borderRadius: 30,
                border: `1px solid ${filter === f.id ? T.accent : T.border}`,
                background: filter === f.id ? T.accentPale : T.bgCard,
                color: filter === f.id ? T.accent : T.textSub,
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* Volunteer grid */}
        <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : vp.tablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: "1.25rem" }}>
          <AnimatePresence>
            {filtered.map((v, i) => {
              const sc = STATUS_CONFIG[v.status];
              const isAssigned = assigned.has(v.id);
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    background: T.bgCard,
                    borderRadius: 14,
                    border: `1px solid ${isAssigned ? T.accent : T.border}`,
                    padding: "1.25rem",
                    boxShadow: T.shadow,
                    transition: "all 0.25s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: "1.8rem", width: 46, height: 46, borderRadius: 12, background: T.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {v.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.name}</div>
                      <div style={{ fontSize: "0.72rem", color: T.textMuted }}>{v.role}</div>
                    </div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: sc.bg, color: sc.color, flexShrink: 0 }}>
                      {sc.label}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem", marginBottom: "0.75rem" }}>
                    {[["Distance", v.distance], ["ETA", v.responseTime], ["Cases", v.cases]].map(([k, val]) => (
                      <div key={k} style={{ textAlign: "center", padding: "0.4rem", borderRadius: 7, background: T.bgAlt }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: T.text }}>{val}</div>
                        <div style={{ fontSize: "0.62rem", color: T.textMuted }}>{k}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.75rem" }}>
                    {v.skills.map((s) => (
                      <span key={s} style={{ fontSize: "0.65rem", padding: "2px 7px", borderRadius: 10, background: T.accentPale, color: T.accent, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {isAssigned ? (
                      <div style={{ flex: 1, padding: "0.55rem", borderRadius: 8, background: T.accentPale, border: `1px solid ${T.accent}`, textAlign: "center", fontSize: "0.78rem", fontWeight: 700, color: T.accent }}>
                        ✓ Assigned to Rescue
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setAssigned((s) => new Set([...s, v.id]))}
                          style={{ flex: 1, opacity: v.status === "off-duty" ? 0.5 : 1, pointerEvents: v.status === "off-duty" ? "none" : "auto", fontSize: "0.75rem" }}
                        >
                          Assign
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setProfileModal(v)} style={{ fontSize: "0.75rem" }}>
                          Profile
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

         {profileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setProfileModal(null)}
            className="rq-modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="rq-modal"
              style={{ maxWidth: 440, width: "100%" }}
            >
              <div className="rq-modal-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ fontSize: "2.5rem" }}>{profileModal.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1rem", color: T.text }}>{profileModal.name}</div>
                    <div style={{ fontSize: "0.78rem", color: T.textMuted }}>{profileModal.role}</div>
                    <div style={{ fontSize: "0.72rem", color: "#F59E0B", marginTop: 2 }}>⭐ {profileModal.rating} rating • {profileModal.cases} rescues</div>
                  </div>
                </div>
                <button
                  onClick={() => setProfileModal(null)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: `1px solid ${T.border}`, background: T.bgAlt,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: T.textSub, fontSize: "1.1rem", lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div className="rq-modal-body">
                <div style={{ fontSize: "0.85rem", color: T.textSub, lineHeight: 1.7 }}>
                  Certified animal rescue specialist with {profileModal.cases}+ successful rescue operations. Available for emergency dispatch across the region.
                </div>
              </div>
              
              <div className="rq-modal-footer">
                <Button variant="primary" onClick={() => { setAssigned((s) => new Set([...s, profileModal.id])); setProfileModal(null); }} style={{ flex: 1 }}>
                  Assign Volunteer
                </Button>
                <Button variant="ghost" onClick={() => setProfileModal(null)} style={{ flex: 1 }}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
