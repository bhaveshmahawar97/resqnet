import { Marker, Popup, Tooltip } from "react-leaflet";

export default function NgoMarkers({ ngos = [] }) {
  return (
    <>
      {ngos
        .filter((ngo) => Number.isFinite(ngo.latitude) && Number.isFinite(ngo.longitude))
        .map((ngo) => (
          <Marker key={ngo.id} position={[ngo.latitude, ngo.longitude]}>
            <Popup>
              <div style={{ minWidth: 220 }}>
                <strong style={{ display: "block", marginBottom: 6 }}>{ngo.name}</strong>
                <div style={{ fontSize: "0.88rem", marginBottom: 4 }}>{ngo.city || "Unknown location"}</div>
                {ngo.specialties && ngo.specialties.length > 0 && (
                  <div style={{ fontSize: "0.81rem", marginBottom: 4 }}>
                    {ngo.specialties.slice(0, 4).join(" · ")}
                  </div>
                )}
                {ngo.distance && (
                  <div style={{ fontSize: "0.81rem", color: "#0F172A" }}>{ngo.distance} away</div>
                )}
              </div>
            </Popup>
            <Tooltip>{ngo.name}</Tooltip>
          </Marker>
        ))}
    </>
  );
}
