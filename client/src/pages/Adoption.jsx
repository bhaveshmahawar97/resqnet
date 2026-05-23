import { useT } from "../context/ThemeContext";

import {
  AdoptionHero,
  AdoptionStats,
  AdoptionGrid,
  AdoptionCTA,
} from "../components/adoption";

/**
 * Adoption Page — concise 4-section layout:
 * Hero → Stats → Grid (with modal) → CTA
 */
export default function Adoption() {
  const { T } = useT();

  return (
    <main style={{ width: "100%", overflowX: "hidden", background: T.bg }}>
      <AdoptionHero />
      <AdoptionStats />
      <AdoptionGrid />
      <AdoptionCTA />
    </main>
  );
}