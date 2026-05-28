import { useEffect, useState } from "react";
import { getAdoptions } from "../services/adoptionService";

export default function useAdoptions(limit = 4) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (mounted) setLoading(true);
    });
    getAdoptions({ limit })
      .then((d) => mounted && setData(d))
      .catch((e) => mounted && setError(e))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [limit]);

  return { data, loading, error };
}
