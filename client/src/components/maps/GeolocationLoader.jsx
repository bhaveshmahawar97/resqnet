import { useState, useCallback } from "react";
import { getCurrentPosition } from "../../utils/geo";

export default function GeolocationLoader({ children }) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError("");
    setStatus("Requesting browser location…");
    try {
      const current = await getCurrentPosition();
      setPosition(current);
      setStatus("Location detected");
      return current;
    } catch (err) {
      setError("Unable to detect location. Please allow location access or choose manually.");
      setStatus("Location permission denied or unavailable.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return children({ position, loading, error, status, requestLocation });
}
