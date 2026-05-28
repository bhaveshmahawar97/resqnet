import { useEffect, useMemo, useState, useCallback } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { reverseGeocode } from "../../services/geocodingService";
import { useT } from "../../context/ThemeContext";
import Label from "../ui/Label";
import Button from "../ui/Button";
import BasicMap from "./BasicMap";
import GeolocationLoader from "./GeolocationLoader";

function FlyToPosition({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13, { animate: true });
    }
  }, [position, map]);
  return null;
}

export default function RescueLocationPicker({ value = {}, onChange, label = "Rescue Location" }) {
  const { T } = useT();
  const [position, setPosition] = useState(
    value.latitude && value.longitude ? { lat: value.latitude, lng: value.longitude } : null
  );
  const [address, setAddress] = useState(value.address || "");
  const [city, setCity] = useState(value.city || "");
  const [stateName, setStateName] = useState(value.state || "");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value.latitude && value.longitude) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosition({ lat: value.latitude, lng: value.longitude });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value.address) setAddress(value.address);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value.city) setCity(value.city);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value.state) setStateName(value.state);
  }, [value.latitude, value.longitude, value.address, value.city, value.state]);

  const syncLocation = useCallback(
    async (latlng, reason = "selected") => {
      if (!latlng?.lat || !latlng?.lng) return;
      setError("");
      setLoading(true);
      setStatus(`Location ${reason}...`);
      try {
        const result = await reverseGeocode({ latitude: latlng.lat, longitude: latlng.lng });
        const pickedAddress = result?.address || `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
        const pickedCity = result?.city || "";
        const pickedState = result?.state || "";
        setPosition({ lat: latlng.lat, lng: latlng.lng });
        setAddress(pickedAddress);
        setCity(pickedCity);
        setStateName(pickedState);
        onChange?.({
          address: pickedAddress,
          city: pickedCity,
          state: pickedState,
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

  const handleMarkerDragEnd = async (event) => {
    const latlng = event.target.getLatLng();
    await syncLocation(latlng, "updated");
  };

  const mapCenter = useMemo(() => {
    if (position) return position;
    return { lat: 20.5937, lng: 78.9629 };
  }, [position]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <Label>{label}</Label>
          <div style={{ color: T.textSub, fontSize: "0.85rem", lineHeight: 1.5, maxWidth: 640 }}>
            Click or drag the marker to set the rescue location. The map uses OpenStreetMap and Nominatim reverse geocoding.
          </div>
        </div>
        <GeolocationLoader>
          {({ loading: geoLoading, error: geoError, status: geoStatus, requestLocation }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 160 }}>
              <Button variant="outline" size="sm" onClick={() => requestLocation().then((pos) => syncLocation({ lat: pos.latitude, lng: pos.longitude }, "detected")).catch(() => {})} style={{ minWidth: 160 }}>
                {geoLoading ? "Detecting…" : "Detect Current Location"}
              </Button>
              <div style={{ color: T.textMuted, fontSize: "0.78rem", minHeight: 18 }}>{geoError || geoStatus}</div>
            </div>
          )}
        </GeolocationLoader>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ color: T.textMuted, fontSize: "0.78rem", marginBottom: 6 }}>Address</div>
            <div style={{ padding: "0.85rem 1rem", borderRadius: 12, background: T.bgCard, border: `1px solid ${T.border}`, color: T.text, fontSize: "0.92rem" }}>{address || "No location chosen yet"}</div>
          </div>
          <div>
            <div style={{ color: T.textMuted, fontSize: "0.78rem", marginBottom: 6 }}>City / State</div>
            <div style={{ padding: "0.85rem 1rem", borderRadius: 12, background: T.bgCard, border: `1px solid ${T.border}`, color: T.text, fontSize: "0.92rem" }}>{city ? `${city}${stateName ? `, ${stateName}` : ""}` : "Unknown location"}</div>
          </div>
        </div>

        <BasicMap center={mapCenter} zoom={position ? 13 : 5}>
          <FlyToPosition position={mapCenter} />
          {position && (
            <Marker position={position} draggable={!loading} eventHandlers={{ dragend: handleMarkerDragEnd }}>
              <Popup>{address || "Selected rescue location"}</Popup>
            </Marker>
          )}
        </BasicMap>
      </div>

      {(error || status) && (
        <div style={{ marginTop: 10, color: error ? "#DC2626" : T.textMuted, fontSize: "0.82rem" }}>
          {error || status}
        </div>
      )}
    </div>
  );
}
