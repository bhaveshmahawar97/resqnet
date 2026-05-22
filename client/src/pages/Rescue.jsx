import { useState } from "react";
import RescueHero from "../components/rescue/RescueHero";
import EmergencyStats from "../components/rescue/EmergencyStats";
import EmergencyForm from "../components/rescue/EmergencyForm";
import AIScanner from "../components/rescue/AIScanner";
import RescueModal from "../components/rescue/RescueModal";

function generateRescueId() {
  return `RQ-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function Rescue() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rescueId, setRescueId] = useState(generateRescueId());

  const openRescueModal = () => {
    setRescueId(generateRescueId());
    setModalOpen(true);
  };

  const closeRescueModal = () => {
    setModalOpen(false);
  };

  const handleViewTimeline = () => {
    setModalOpen(false);
  };

  const handleFormSuccess = () => {
    setRescueId(generateRescueId());
    setModalOpen(true);
  };

  return (
    <>
      <main style={{ width: "100%", overflowX: "hidden" }}>
        <RescueHero
          onRequestRescue={openRescueModal}
          onAIScan={() => window.document.getElementById("ai-scanner")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        />

        <EmergencyStats />
        <EmergencyForm onSuccess={handleFormSuccess} />
        <AIScanner id="ai-scanner" />
      </main>

      <RescueModal open={modalOpen} rescueId={rescueId} onClose={closeRescueModal} onViewTimeline={handleViewTimeline} />
    </>
  );
}
