const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

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

const parseNominatimResult = (result) => {
  if (!result) return null;
  return {
    latitude: Number(result.lat),
    longitude: Number(result.lon),
    displayName: result.display_name,
    address: result.display_name,
    city:
      result.address?.city ||
      result.address?.town ||
      result.address?.village ||
      result.address?.county ||
      result.address?.state ||
      "",
  };
};

export const reverseGeocode = async ({ latitude, longitude }) => {
  if (latitude == null || longitude == null) return null;
  const url = new URL(`${NOMINATIM_BASE}/reverse`);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("addressdetails", "1");
  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("Reverse geocoding failed");
  const data = await response.json();
  return parseNominatimResult({ ...data, ...data });
};

export const geocodeAddress = async (address) => {
  if (!address) return null;
  const url = new URL(`${NOMINATIM_BASE}/search`);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", address);
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");
  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("Geocoding failed");
  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) return null;
  return parseNominatimResult(results[0]);
};

export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator?.geolocation) {
      reject(new Error("Geolocation is not supported in this browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  });
