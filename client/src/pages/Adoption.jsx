import { useT } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import { usePlatformStats, formatStat } from "../hooks/usePlatformStats";
import AdoptionGrid from "../components/adoption/AdoptionGrid";

export default function Adoption() {
  const { T } = useT();
  const { stats } = usePlatformStats();

  return (
    <main style={{ width: "100%", overflowX: "hidden", background: T.bg, minHeight: "100vh" }}>
      <PageHeader
        title="Adoption Hub"
        subtitle="Browse rescued animals matched to your lifestyle through AI compatibility scoring."
        badge={{ label: "Live · Adopt", color: T.success }}
        stats={[
          { value: formatStat(stats.totalAdoptions), label: "adopted" },
          { value: formatStat(stats.totalNgos), label: "NGO partners" },
        ]}
        actions={
          <Link
            to="/ngo-register"
            style={{ padding: "0.45rem 0.85rem", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgCard, color: T.text, fontWeight: 600, fontSize: "0.76rem", textDecoration: "none" }}
          >
            List an Animal
          </Link>
        }
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem clamp(1.25rem, 3vw, 2.5rem)" }}>
        <AdoptionGrid />
      </div>
    </main>
  );
}
