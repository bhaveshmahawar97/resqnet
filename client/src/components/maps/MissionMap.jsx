import { useEffect, useMemo, useState } from "react";
import { Marker, Popup, CircleMarker } from "react-leaflet";
import { getCurrentPosition, geocodeAddress } from "../../utils/geo";
import BasicMap from "./BasicMap";

const defaultStart = { lat: 20.5937, lng: 78.9629 };

export default function MissionMap({ missions = [] }) {
  const [center, setCenter] = useState(defaultStart);
  const [resolved, setResolved] = useState([]);
  const [volunteerPosition, setVolunteerPosition] = useState(null);

  useEffect(() => {
    const loadPositions = async () => {
      const resolvedItems = await Promise.all(
        missions.map(async (mission) => {
          if (Number.isFinite(mission.latitude) && Number.isFinite(mission.longitude)) {
            return mission;
          }
          if (mission.address) {
            try {
              const result = await geocodeAddress(mission.address);
              if (result) {
                return { ...mission, latitude: result.latitude, longitude: result.longitude };
              }
            } catch {
              return mission;
            }
          }
          return mission;
        })
      );
      const valid = resolvedItems.filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));
      if (valid.length > 0) {
        setCenter({ lat: valid[0].latitude, lng: valid[0].longitude });
      }
      setResolved(valid);
    };

    if (missions.length > 0) {
      loadPositions();
    }
  }, [missions]);

  useEffect(() => {
    getCurrentPosition()
      .then((pos) => setVolunteerPosition(pos))
      .catch(() => setVolunteerPosition(null));
  }, []);

  const defaultCenter = useMemo(() => center || defaultStart, [center]);

  if (!missions || missions.length === 0) {
    return null;
  }

  return (
    <BasicMap center={defaultCenter} zoom={10} minHeight={340}>
      {resolved.map((mission) => (
        <Marker key={mission.id || mission._id || mission.address} position={[mission.latitude, mission.longitude]}>
          <Popup>
            <div style={{ minWidth: 220 }}>
              <strong>{mission.animal || mission.animalType || "Rescue"}</strong>
              <div style={{ marginTop: 6 }}>{mission.address || mission.location || mission.city || "Operational target"}</div>
              <div style={{ marginTop: 6, fontSize: "0.82rem", color: "#475569" }}>Status: {mission.status || "pending"}</div>
            </div>
          </Popup>
        </Marker>
      ))}
      {volunteerPosition && (
        <>
          <Marker position={[volunteerPosition.latitude, volunteerPosition.longitude]}>
            <Popup>Volunteer location</Popup>
          </Marker>
          <CircleMarker
            center={[volunteerPosition.latitude, volunteerPosition.longitude]}
            radius={70}
            pathOptions={{ color: "#2563EB", fillColor: "#2563EB", fillOpacity: 0.12 }}
          />
        </>
      )}
    </BasicMap>
  );
}
