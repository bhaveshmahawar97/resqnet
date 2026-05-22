import { Marker, CircleMarker, Popup } from "react-leaflet";

export default function UserLocationMarker({ position, label = "Your current location" }) {
  if (!position?.latitude || !position?.longitude) return null;
  return (
    <>
      <Marker position={[position.latitude, position.longitude]}>
        <Popup>{label}</Popup>
      </Marker>
      <CircleMarker
        center={[position.latitude, position.longitude]}
        radius={90}
        pathOptions={{ color: "#22C55E", fillColor: "#22C55E", fillOpacity: 0.14 }}
      />
    </>
  );
}
