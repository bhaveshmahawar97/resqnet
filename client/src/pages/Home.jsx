import { useT } from "../context/ThemeContext";

// Homepage sections — modular, preview-only (no operational forms)
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import RescuePreviewSection from "../components/home/RescuePreviewSection";
import NGOPreviewSection from "../components/home/NGOPreviewSection";
import AIScannerPreviewSection from "../components/home/AIScannerPreviewSection";
import AdoptionPreviewSection from "../components/home/AdoptionPreviewSection";
import CTASection from "../components/home/CTASection";

/**
 * Home page — redesigned as a concise healthcare rescue ecosystem landing page.
 *
 * Architecture:
 *  - Hero:              premium mission statement
 *  - Stats:             live platform impact numbers
 *  - Rescue Preview:    rescue coordination preview + CTA (no form)
 *  - NGO Preview:       partner NGO network preview
 *  - AI Scanner:        AI health capabilities preview (no upload)
 *  - Adoption Preview:  adoption listings preview
 *  - CTA:               volunteer / NGO / emergency CTAs
 *
 * All preview sections use the SAME real APIs and shared components
 * as operational pages — no mock data, no duplicated logic.
 */
export default function Home() {
  const { T } = useT();

  return (
    <main style={{ width: "100%", background: T.bg, overflowX: "hidden" }}>
      {/* 1. Hero — premium mission statement */}
      <HeroSection />

      {/* 2. Platform impact numbers */}
      <StatsSection />

      {/* 3. Rescue coordination ecosystem preview */}
      <RescuePreviewSection />

      {/* 4. NGO network preview */}
      <NGOPreviewSection />

      {/* 5. AI Health Scanner capabilities */}
      <AIScannerPreviewSection />

      {/* 6. Adoption listings preview */}
      <AdoptionPreviewSection />

      {/* 7. CTA — volunteer / NGO / emergency */}
      <CTASection />
    </main>
  );
}
