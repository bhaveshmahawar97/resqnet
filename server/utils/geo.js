/**
 * Lightweight geo helpers (no external map SDK required).
 */

export const extractCityFromAddress = (address = "") => {
  if (!address || typeof address !== "string") return "";
  const parts = address
    .split(/[,|\n]/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return "";
  const last = parts[parts.length - 1];
  return last.replace(/\d{5,6}/g, "").trim() || parts[0];
};

export const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const formatDistance = (km) => {
  if (!Number.isFinite(km)) return "—";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
};
