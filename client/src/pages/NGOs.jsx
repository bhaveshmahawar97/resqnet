import { useT } from "../context/ThemeContext";
import NGOHero from "../components/ngo/NGOHero";
import NGOStats from "../components/ngo/NGOStats";
import NGODirectory from "../components/ngo/NGODirectory";
import NGONetworkMap from "../components/ngo/NGONetworkMap";
import NGOOnboarding from "../components/ngo/NGOOnboarding";
import NGOTestimonials from "../components/ngo/NGOTestimonials";
import NGOPageCTA from "../components/ngo/NGOPageCTA";

export default function NGOs() {
  const { T } = useT();

  return (
    <main style={{ width: "100%", overflowX: "hidden", background: T.bg }}>
      <NGOHero />
      <NGOStats />
      <NGODirectory />
      <NGONetworkMap />
      <NGOOnboarding />
      <NGOTestimonials />
      <NGOPageCTA />
    </main>
  );
}
