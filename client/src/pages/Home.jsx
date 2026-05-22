import { useT } from "../context/ThemeContext";

// Existing sections — kept intact
import Hero from "../components/sections/Hero";

// New modular home components
import StatsSection from "../components/home/StatsSection";
import AIScannerPreviewSection from "../components/home/AIScannerPreviewSection";
import NGOPreviewSection from "../components/home/NGOPreviewSection";
import AdoptionPreviewSection from "../components/home/AdoptionPreviewSection";
import RescuePreviewSection from "../components/home/RescuePreviewSection";
import CTASection from "../components/home/CTASection";

// Existing footer CTA — kept intact
import FooterCTA from "../components/sections/FooterCTA";

/**
 * Home page — redesigned as a live preview dashboard.
 *
 * Architecture:
 *  - Hero:                 existing (preserved as-is)
 *  - StatsSection:         live data from rescueService + adoptionService
 *  - AIScannerPreview:     inline scanner using existing aiService APIs
 *  - NGOPreview:           live NGOs from useNgos hook + NgoCard
 *  - AdoptionPreview:      live pets from useAdoptions hook + PetCard
 *  - RescuePreview:        compact form using createRescue service
 *  - CTASection:           volunteer / NGO / emergency CTAs
 *  - FooterCTA:            existing (preserved as-is)
 *
 * All data flows through existing hooks and services — no mock data,
 * no duplicated logic. If the source pages update their APIs, this
 * page reflects changes automatically.
 */
export default function Home() {
  const { T } = useT();

  return (
    <main style={{ width: "100%", background: T.bg, overflowX: "hidden" }}>
      {/* 1. Hero — full viewport mission statement */}
      <Hero />

      {/* 2. Platform impact numbers (live + fallback) */}
      <StatsSection />

      {/* 3. AI Scanner — inline triage widget */}
      <AIScannerPreviewSection />

      {/* 4. NGO network preview */}
      <NGOPreviewSection />

      {/* 5. Adoption listings preview */}
      <AdoptionPreviewSection />

      {/* 6. Emergency rescue quick-report */}
      <RescuePreviewSection />

      {/* 7. CTA — volunteer / NGO / emergency */}
      <CTASection />

      {/* 8. Footer CTA — existing preserved */}
      <FooterCTA />
    </main>
  );
}
