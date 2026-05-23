import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../../context/ThemeContext";
import useViewport from "../../hooks/useViewport";
import { vFadeUp } from "../../animations/variants";
import Label from "../ui/Label";
import Button from "../ui/Button";
import NgoMap from "../maps/NgoMap";
import { fetchNgos } from "../../services/userService";

export default function NGONetworkMap() {
  const { T } = useT();
  const vp = useViewport();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await fetchNgos({ limit: 60 });
      if (result.success) {
        setNgos(result.data.ngos || []);
        setError("");
      } else {
        setError(result.message || "Unable to load NGO network");
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section style={{ width: "100%", padding: "clamp(3.5rem, 8vw, 6rem) 0", background: T.bgAlt, position: "relative", overflow: "hidden" }}>
      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3.5rem)", display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "1fr 1fr", gap: "clamp(2.5rem, 6vw, 6rem)", alignItems: "start" }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={vFadeUp}>
          <Label>Rescue Network</Label>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.035em", margin: "0 0 1rem", color: T.text }}>
            Live NGO coverage across the network.
          </h2>
          <p style={{ color: T.textSub, lineHeight: 1.78, marginBottom: "1.75rem", fontSize: "clamp(0.88rem, 1.8vw, 1rem)" }}>
            Explore partner NGOs on an operational OpenStreetMap layer. The map shows real network coverage, city labels, and available rescue teams.
          </p>
          <Button variant="primary">Browse NGO Listings</Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: vp.mobile ? 0 : 40, y: vp.mobile ? 28 : 0 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
          <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: T.shadowDeep, border: `1px solid ${T.border}` }}>
            <NgoMap ngos={ngos} />
          </div>
        </motion.div>
      </div>

      <div style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "2rem clamp(1.25rem, 4vw, 3.5rem)", display: "grid", gap: "1rem" }}>
        {loading && (
          <div style={{ padding: "1rem 1.25rem", borderRadius: 18, background: T.bgCard, color: T.textMuted }}>Loading NGO network…</div>
        )}
        {error && (
          <div style={{ padding: "1rem 1.25rem", borderRadius: 18, background: "rgba(239,68,68,0.1)", color: "#991B1B" }}>{error}</div>
        )}
        {!loading && ngos.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: "1rem" }}>
            {ngos.slice(0, 6).map((ngo) => (
              <div key={ngo.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "1rem" }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{ngo.name}</div>
                <div style={{ color: T.textMuted, fontSize: "0.82rem", marginBottom: 10 }}>{ngo.city || "Unknown city"}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(ngo.specialties || []).slice(0, 3).map((item) => (
                    <span key={item} style={{ padding: "0.35rem 0.7rem", borderRadius: 12, background: T.bg, color: T.textSub, fontSize: "0.72rem" }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
