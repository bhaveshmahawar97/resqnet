import { useT } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import { usePlatformStats, formatStat } from "../hooks/usePlatformStats";
import NGODirectory from "../components/ngo/NGODirectory";

export default function NGOs() {
  const { T } = useT();
  const { stats } = usePlatformStats();

  return (
    <main style={{ width: "100%", overflowX: "hidden", background: T.bg, minHeight: "100vh" }}>
      <PageHeader
        title="NGO Network"
        subtitle="Verified rescue organizations across India — search by city, specialty, or response zone."
        badge={{ label: "Verified", color: T.info }}
        stats={[
          { value: formatStat(stats.totalNgos), label: "verified NGOs" },
          { value: formatStat(stats.citiesCovered), label: "cities" },
        ]}
        actions={
          <Link
            to="/ngo-register"
            style={{ padding: "0.45rem 0.85rem", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: "0.76rem", textDecoration: "none" }}
          >
            Register NGO
          </Link>
        }
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem clamp(1.25rem, 3vw, 2.5rem)" }}>
        <NGODirectory />
      </div>
    </main>
  );
}
