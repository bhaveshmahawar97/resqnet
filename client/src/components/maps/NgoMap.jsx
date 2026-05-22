import { useEffect, useMemo, useState } from "react";
import { geocodeAddress } from "../../utils/geo";
import NgoMarkers from "./NgoMarkers";
import UserLocationMarker from "./UserLocationMarker";
import BasicMap from "./BasicMap";

const normalizeMapCenter = (value) => {
  if (!value) return null;
  if (value.lat !== undefined && value.lng !== undefined) return value;
  if (value.latitude !== undefined && value.longitude !== undefined) {
    return { lat: value.latitude, lng: value.longitude };
  }
  return null;
};

export default function NgoMap({ ngos = [], userPosition = null, center = null }) {
  const [resolvedNgos, setResolvedNgos] = useState([]);
  const [mapCenter, setMapCenter] = useState(normalizeMapCenter(center) || { lat: 20.5937, lng: 78.9629 });

  useEffect(() => {
    const loadNgos = async () => {
      const uniqueCityCache = new Map();
      const mapped = await Promise.all(
        ngos.map(async (ngo) => {
          if (Number.isFinite(ngo.latitude) && Number.isFinite(ngo.longitude)) {
            return ngo;
          }
          const lookup = ngo.city || ngo.name || ngo.address || "India";
          if (uniqueCityCache.has(lookup)) {
            const cached = uniqueCityCache.get(lookup);
            return cached ? { ...ngo, latitude: cached.latitude, longitude: cached.longitude } : ngo;
          }
          try {
            const coords = await geocodeAddress(lookup);
            uniqueCityCache.set(lookup, coords || null);
            return coords ? { ...ngo, latitude: coords.latitude, longitude: coords.longitude } : ngo;
          } catch {
            uniqueCityCache.set(lookup, null);
            return ngo;
          }
        })
      );

      const valid = mapped.filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));
      setResolvedNgos(valid);
      if (userPosition?.latitude && userPosition?.longitude) {
        setMapCenter({ lat: userPosition.latitude, lng: userPosition.longitude });
      } else if (valid.length > 0) {
        setMapCenter({ lat: valid[0].latitude, lng: valid[0].longitude });
      }
    };
    if (ngos.length > 0) {
      loadNgos();
    }
  }, [ngos, userPosition]);

  const centerPoint = useMemo(() => {
    return normalizeMapCenter(center) || normalizeMapCenter(userPosition) || mapCenter || { lat: 20.5937, lng: 78.9629 };
  }, [center, mapCenter, userPosition]);

  return (
    <BasicMap center={centerPoint} zoom={centerPoint.lat === 20.5937 ? 5 : 10} minHeight={400}>
      <NgoMarkers ngos={resolvedNgos} />
      <UserLocationMarker position={userPosition} />
    </BasicMap>
  );
}
