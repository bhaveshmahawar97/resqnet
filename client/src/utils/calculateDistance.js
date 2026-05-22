export const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const formatDistance = (km) => {
  if (!Number.isFinite(km)) return null;
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
};

export const sortNgosByDistance = (origin, ngos = []) => {
  if (!origin || !Number.isFinite(origin.latitude) || !Number.isFinite(origin.longitude)) {
    return ngos;
  }

  return [...ngos]
    .map((ngo) => {
      const latitude = Number(ngo.latitude ?? ngo.location?.coordinates?.lat);
      const longitude = Number(ngo.longitude ?? ngo.location?.coordinates?.lng);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return { ...ngo, distanceKm: null };
      }
      const distanceKm = haversineKm(origin.latitude, origin.longitude, latitude, longitude);
      return { ...ngo, distanceKm, distance: formatDistance(distanceKm) };
    })
    .sort((a, b) => {
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });
};
