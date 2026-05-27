import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useT } from "../context/ThemeContext";
import useViewport from "../hooks/useViewport";
import { usePlatformStats, formatStat } from "../hooks/usePlatformStats";
import PageHeader from "../components/ui/PageHeader";
import EmergencyForm from "../components/rescue/EmergencyForm";
import AIScanner from "../components/rescue/AIScanner";
import RescueModal from "../components/rescue/RescueModal";

function generateRescueId() {
  return `RQ-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function Rescue() {
  const { T } = useT();
  const vp = useViewport();
  const { stats } = usePlatformStats();
  const [modalOpen, setModalOpen] = useState(false);
  const [rescueId, setRescueId] = useState(generateRescueId());

  const handleFormSuccess = () => {
    setRescueId(generateRescueId());
    setModalOpen(true);
  };

  const headerStats = [
    { value: `${stats.avgResponseMinutes || 0}m`, label: "avg response" },
    { value: formatStat(stats.totalNgos), label: "NGOs active" },
    { value: formatStat(stats.totalRescues), label: "rescues" },
  ];

  return (
    <>
      <main style={{ width: "100%", background: T.bg, minHeight: "100vh", overflowX: "hidden" }}>
        <PageHeader
          title="Animal Rescue Intake"
          subtitle="AI dispatches to the nearest verified NGO in seconds."
          badge={{ label: "Live · Dispatch", color: T.danger }}
          stats={headerStats}
          actions={
            <Link
              to="/ai-health"
              style={{ padding: "0.45rem 0.85rem", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgCard, color: T.text, fontWeight: 600, fontSize: "0.76rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              AI Health Scan
            </Link>
          }
        />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: vp.mobile ? "1.25rem 1rem" : "1.5rem clamp(1.25rem, 3vw, 2.5rem)" }}>
          <div style={{ display: "grid", gridTemplateColumns: vp.mobile ? "1fr" : "1fr 380px", gap: "1.25rem", alignItems: "start" }}>
            <EmergencyForm onSuccess={handleFormSuccess} />

            {/* Right column: emergency info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "1rem 1.1rem" }}>
                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: T.text, margin: "0 0 0.75rem", letterSpacing: "-0.01em" }}>Emergency Helplines</h3>
                {[
                  { label: "Animal Helpline", number: "1962" },
                  { label: "Wildlife SOS", number: "9871963535" },
                  { label: "PETA India", number: "9820122602" },
                ].map(h => (
                  <div key={h.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: `1px solid ${T.borderLight}` }}>
                    <span style={{ fontSize: "0.78rem", color: T.textSub }}>{h.label}</span>
                    <a href={`tel:${h.number}`} style={{ fontSize: "0.82rem", fontWeight: 700, color: T.accent, textDecoration: "none" }}>{h.number}</a>
                  </div>
                ))}
              </div>

              <div style={{ background: `${T.warning}0D`, border: `1px solid ${T.warning}33`, borderRadius: 10, padding: "0.85rem 1rem" }}>
                <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: T.warning, margin: "0 0 0.5rem" }}>While help is on the way</h3>
                {["Keep the animal calm and in a safe, shaded area.", "Do not attempt to move injured animals unless in immediate danger.", "Photograph injuries for the rescue team.", "Stay on-site if possible to guide responders."].map(tip => (
                  <p key={tip} style={{ fontSize: "0.74rem", color: T.textSub, margin: "0 0 0.3rem", lineHeight: 1.5 }}>· {tip}</p>
                ))}
              </div>
            </div>
          </div>

          {/* AI Scanner below the fold */}
          <div style={{ marginTop: "1.5rem" }}>
            <AIScanner id="ai-scanner" />
          </div>
        </div>
      </main>

      <RescueModal open={modalOpen} rescueId={rescueId} onClose={() => setModalOpen(false)} onViewTimeline={() => setModalOpen(false)} />
    </>
  );
}
