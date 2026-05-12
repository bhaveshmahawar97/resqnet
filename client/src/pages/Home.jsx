import { useEffect } from "react";
import { motion } from "framer-motion";

import { useT } from "../context/ThemeContext";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Hero from "../components/sections/Hero";
import Statistics from "../components/sections/Statistics";
import NGOShowcase from "../components/sections/NGOShowcase";
import AdoptionShowcase from "../components/sections/AdoptionShowcase";
import AIScanner from "../components/sections/AIScanner";
import EmergencyCTA from "../components/sections/EmergencyCTA";

export default function Home() {
  const { T } = useT();

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  return (
    <motion.div
      animate={{ background: T.bg }}
      transition={{ duration: 0.4 }}
      style={{
        fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
        color: T.text,
        width: "100%",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; overflow-x: hidden; }
        body { margin: 0; }
        img { display: block; max-width: 100%; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${T.scrollbar}; }
        ::-webkit-scrollbar-thumb { background: ${T.scrollThumb}; border-radius: 3px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Navbar />

      <main style={{ width: "100%" }}>
        <Hero />
        <Statistics />
        <NGOShowcase />
        <AdoptionShowcase />
        <AIScanner />
        <EmergencyCTA />
      </main>

      <Footer />
    </motion.div>
  );
}