import { useEffect, useState } from "react";
import { getNgos } from "../services/ngoService";

export default function useNgos({ limit = 4, sort } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (mounted) setLoading(true);
    });
    getNgos({ limit, sort })
      .then((d) => {
        if (!mounted) return;
        const ngos = Array.isArray(d) ? d : d?.data?.ngos || [];
        setData(ngos);
      })
      .catch((e) => mounted && setError(e))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [limit, sort]);

  return { data, loading, error };
}
