import { useState, useEffect } from "react";
import { getRescueStats } from "../services/rescueService";
import { fetchAdoptionStats } from "../services/adoptionService";
import { getNgoStatsOverview } from "../services/ngoService";

// Simple time-based cache (5 seconds) to prevent spamming while navigating rapidly,
// but short enough to reflect new completions quickly.
let cachedStats = null;
let lastFetchTime = 0;
let fetchPromise = null;

export function usePlatformStats() {
  const [stats, setStats] = useState(cachedStats || {
    totalRescues: 0,
    recoveryRate: 0,
    avgResponseMinutes: 0,
    totalNgos: 0,
    citiesCovered: 0,
    totalAdoptions: 0,
  });
  const [loading, setLoading] = useState(!cachedStats);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      const now = Date.now();
      // Use cache if it's less than 5 seconds old
      if (cachedStats && now - lastFetchTime < 5000) {
        setStats(cachedStats);
        setLoading(false);
        return;
      }

      if (!fetchPromise || now - lastFetchTime >= 5000) {
        fetchPromise = Promise.allSettled([
          getRescueStats(),
          fetchAdoptionStats(),
          getNgoStatsOverview(),
        ]);
      }

      try {
        const [rescueRes, adoptionRes, ngoRes] = await fetchPromise;

        const rescueData = rescueRes.status === "fulfilled" && rescueRes.value?.success ? rescueRes.value.data : null;
        const adoptionData = adoptionRes.status === "fulfilled" && adoptionRes.value?.success ? adoptionRes.value.data : null;
        const ngoData = ngoRes.status === "fulfilled" && ngoRes.value?.success ? ngoRes.value.data : null;

        const formattedStats = {
          totalRescues: rescueData?.total || 0,
          recoveryRate: rescueData?.completionRate ? Math.round(rescueData.completionRate) : 0,
          avgResponseMinutes: rescueData?.avgResponseMinutes || 0,
          totalNgos: ngoData?.totalVerified || 0,
          citiesCovered: ngoData?.citiesCovered || 0,
          totalAdoptions: adoptionData?.adopted || 0,
        };

        cachedStats = formattedStats;
        lastFetchTime = Date.now();

        if (mounted) {
          setStats(formattedStats);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load platform stats:", err);
        if (mounted) setLoading(false);
      }
    }

    loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, loading };
}

export function formatStat(value, isPercentage = false) {
  if (value === undefined || value === null || value === 0) return "0";
  if (isPercentage) return `${value}%`;
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M+`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k+`;
  }
  return value.toString();
}
