import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter = [42.6629, 21.1655];

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickMarker({ position, onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

function DeliveryMap({ latitude, longitude, onSelect, height = 300 }) {
  const hasPosition = Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));
  const position = hasPosition ? [Number(latitude), Number(longitude)] : null;
  const center = position || defaultCenter;

  return (
    <MapContainer className="delivery-map" center={center} zoom={13} style={{ height }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickMarker position={position} onSelect={onSelect} />
    </MapContainer>
  );
}

export default DeliveryMap;
