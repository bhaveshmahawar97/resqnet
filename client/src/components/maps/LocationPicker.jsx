import { useEffect, useMemo, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { getCurrentPosition, reverseGeocode } from "../../utils/geo";
import { useT } from "../../context/ThemeContext";
import Label from "../ui/Label";
import Button from "../ui/Button";

function FlyToPosition({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13, { animate: true });
    }
  }, [position, map]);
  return null;
}

function MapClickHandler({ onMapClick }) {
  const map = useMap();
  useEffect(() => {
    const handleClick = (event) => {
      onMapClick(event.latlng);
    };
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);
  return null;
}

export default function LocationPicker({ value = {}, onChange, label = "Rescue Location" }) {
  const { T } = useT();
  const [position, setPosition] = useState(
    value.latitude && value.longitude
      ? { lat: value.latitude, lng: value.longitude }
      : null
  );
  const [address, setAddress] = useState(value.address || "");
  const [city, setCity] = useState(value.city || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (value.latitude && value.longitude) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosition({ lat: value.latitude, lng: value.longitude });
    }
    if (value.address) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress(value.address);
    }
    if (value.city) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCity(value.city);
    }
  }, [value.latitude, value.longitude, value.address, value.city]);

  const syncLocation = useCallback(
    async (latlng, reason = "selected") => {
      if (!latlng?.lat || !latlng?.lng) return;
      setError("");
      setLoading(true);
      setStatus(`Location ${reason}...`);
      try {
        const result = await reverseGeocode({ latitude: latlng.lat, longitude: latlng.lng });
        const pickedAddress = result?.address || `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
        const pickedCity = result?.city || result?.city || result?.state || result?.county || "";
        setPosition({ lat: latlng.lat, lng: latlng.lng });
        setAddress(pickedAddress);
        setCity(pickedCity);
        onChange?.({
          address: pickedAddress,
          city: pickedCity,
          latitude: latlng.lat,
          longitude: latlng.lng,
        });
      } catch (err) {
        console.error(err);
        setError("Unable to resolve location. Please try another point.");
      } finally {
        setLoading(false);
        setStatus("");
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (position || value.latitude || value.longitude) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getCurrentPosition()
      .then((pos) => syncLocation({ lat: pos.latitude, lng: pos.longitude }, "detected"))
      .catch(() => {
        setError("Geolocation permission denied. Drag the marker or click the map to set location.");
      })
      .finally(() => setLoading(false));
  }, [position, value.latitude, value.longitude, syncLocation]);

  const handleMarkerDragEnd = async (event) => {
    const latlng = event.target.getLatLng();
    await syncLocation(latlng, "updated");
  };

  const mapCenter = useMemo(() => {
    if (position) return position;
    if (address) return { lat: 20.5937, lng: 78.9629 };
    return { lat: 20.5937, lng: 78.9629 };
  }, [position, address]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <Label>{label}</Label>
          <div style={{ color: T.textSub, fontSize: "0.85rem", lineHeight: 1.5, maxWidth: 640 }}>
            Drag the marker or click the map to place the rescue location. The address and city will auto-update.
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => syncLocation(mapCenter, "refreshed")}
          style={{ minWidth: 160 }}
        >
          {loading ? "Detecting…" : "Refresh location"}
        </Button>
      </div>
      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          <div style={{ color: T.textMuted, fontSize: "0.78rem" }}>Address</div>
          <div style={{ padding: "0.85rem 1rem", borderRadius: 12, background: T.bgCard, border: `1px solid ${T.border}`, color: T.text, fontSize: "0.92rem" }}>{address || "No location chosen yet"}</div>
          <div style={{ color: T.textMuted, fontSize: "0.78rem" }}>Detected city</div>
          <div style={{ padding: "0.8rem 1rem", borderRadius: 12, background: T.bgCard, border: `1px solid ${T.border}`, color: T.text, fontSize: "0.92rem" }}>{city || "Unknown city"}</div>
        </div>
        <div style={{ width: "100%", minHeight: 320, borderRadius: 18, overflow: "hidden", border: `1px solid ${T.border}` }}>
          <MapContainer center={mapCenter} zoom={position ? 13 : 5} scrollWheelZoom={true} style={{ width: "100%", minHeight: 320 }}>
            <FlyToPosition position={mapCenter} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <MapClickHandler onMapClick={syncLocation} />
            {position && (
              <Marker
                position={position}
                draggable={!loading}
                eventHandlers={{ dragend: handleMarkerDragEnd }}
              >
                <Popup>{address || "Selected rescue location"}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
      {(error || status) && (
        <div style={{ marginTop: 10, color: error ? "#DC2626" : T.textMuted, fontSize: "0.82rem" }}>
          {error || status}
        </div>
      )}
    </div>
  );
}
