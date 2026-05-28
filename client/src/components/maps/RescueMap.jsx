import { useEffect, useMemo, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import BasicMap from "./BasicMap";
import UserLocationMarker from "./UserLocationMarker";
import { geocodeAddress } from "../../utils/geo";

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

const getRescueCoordinates = (rescue) => {
  if (rescue?.location?.coordinates?.lat && rescue?.location?.coordinates?.lng) {
    return { lat: rescue.location.coordinates.lat, lng: rescue.location.coordinates.lng };
  }
  if (Number.isFinite(rescue?.latitude) && Number.isFinite(rescue?.longitude)) {
    return { lat: rescue.latitude, lng: rescue.longitude };
  }
  return null;
};

const getLocationLabel = (rescue) => {
  if (rescue?.location?.city || rescue?.location?.state) {
    return [rescue.location.city, rescue.location.state].filter(Boolean).join(", ");
  }
  return rescue.address || rescue.city || "Unknown location";
};

export default function RescueMap({ rescue, userPosition }) {
  const [center, setCenter] = useState(defaultCenter);
  const [resolvedRescue, setResolvedRescue] = useState(null);

  useEffect(() => {
    if (!rescue) return;
    const coords = getRescueCoordinates(rescue);
    if (coords) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResolvedRescue({ ...rescue, latitude: coords.lat, longitude: coords.lng });
      setCenter(coords);
      return;
    }
    if (rescue.address) {
      geocodeAddress(rescue.address)
        .then((result) => {
          if (result) {
            setResolvedRescue({ ...rescue, latitude: result.latitude, longitude: result.longitude });
            setCenter({ lat: result.latitude, lng: result.longitude });
          }
        })
        .catch(() => {
          setCenter(defaultCenter);
        });
    }
  }, [rescue]);

  const mapCenter = useMemo(() => center || defaultCenter, [center]);

  if (!rescue) return null;

  return (
    <BasicMap center={mapCenter} zoom={resolvedRescue ? 12 : 5} minHeight={340}>
      {resolvedRescue?.latitude && resolvedRescue?.longitude && (
        <Marker position={[resolvedRescue.latitude, resolvedRescue.longitude]}>
          <Popup>
            <div style={{ minWidth: 220 }}>
              <strong>Rescue site</strong>
              <div style={{ marginTop: 6 }}>{getLocationLabel(resolvedRescue)}</div>
              <div style={{ marginTop: 6, fontSize: "0.82rem", color: "#475569" }}>
                Severity: {resolvedRescue.severity || "unknown"}
              </div>
            </div>
          </Popup>
        </Marker>
      )}
      <UserLocationMarker position={userPosition} label="Volunteer location" />
    </BasicMap>
  );
}
