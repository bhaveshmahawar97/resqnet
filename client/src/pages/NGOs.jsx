import { useT } from "../context/ThemeContext";
import NGOHero from "../components/ngo/NGOHero";
import NGOStats from "../components/ngo/NGOStats";
import NGODirectory from "../components/ngo/NGODirectory";
import NGOPageCTA from "../components/ngo/NGOPageCTA";

/**
 * NGO Page — concise 4-section layout:
 * Hero → Stats → Directory → CTA
 */
export default function NGOs() {
  const { T } = useT();

  return (
    <main style={{ width: "100%", overflowX: "hidden", background: T.bg }}>
      <NGOHero />
      <NGOStats />
      <NGODirectory />
      <NGOPageCTA />
    </main>
  );
}
