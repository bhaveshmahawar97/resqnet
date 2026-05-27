import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RescueHero from "../components/rescue/RescueHero";
import EmergencyForm from "../components/rescue/EmergencyForm";
import AIScanner from "../components/rescue/AIScanner";
import RescueModal from "../components/rescue/RescueModal";

function generateRescueId() {
  return `RQ-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function Rescue() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rescueId, setRescueId] = useState(generateRescueId());
  const navigate = useNavigate();

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
        <RescueHero onAIScan={() => navigate("#ai-scanner")} />

        <EmergencyForm onSuccess={handleFormSuccess} />
        <AIScanner id="ai-scanner" />
      </main>

      <RescueModal open={modalOpen} rescueId={rescueId} onClose={closeRescueModal} onViewTimeline={handleViewTimeline} />
    </>
  );
}
