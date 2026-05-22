import { useT } from "../context/ThemeContext";

import {
  AdoptionHero,
  AdoptionStats,
  AdoptionGrid,
  AIMatching,
  SuccessStories,
  ResponsibleAdoption,
  AdoptionCTA,
} from "../components/adoption";

export default function Adoption() {
  const { T } = useT();

  return (
    <main style={{ width: "100%", overflowX: "hidden", background: T.bg }}>
      <AdoptionHero />
      <AdoptionStats />
      <AdoptionGrid />
      <AIMatching />
      <SuccessStories />
      <ResponsibleAdoption />
      <AdoptionCTA />
    </main>
  );
}