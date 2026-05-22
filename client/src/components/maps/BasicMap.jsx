import { MapContainer, TileLayer } from "react-leaflet";

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

function normalizeCenter(center) {
  if (!center) return defaultCenter;
  if (Array.isArray(center) && center.length >= 2) {
    const lat = Number(center[0]);
    const lng = Number(center[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }
  const lat = Number(center.lat ?? center.latitude ?? center[0]);
  const lng = Number(center.lng ?? center.longitude ?? center[1]);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }
  return defaultCenter;
}

export default function BasicMap({ center, zoom = 10, children, style = {}, minHeight = 320, scrollWheelZoom = true }) {
  const normalized = normalizeCenter(center);
  return (
    <div style={{ width: "100%", minHeight, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(148, 163, 184, 0.2)", ...style }}>
      <MapContainer center={[normalized.lat, normalized.lng]} zoom={zoom} scrollWheelZoom={scrollWheelZoom} style={{ width: "100%", minHeight }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {children}
      </MapContainer>
    </div>
  );
}
