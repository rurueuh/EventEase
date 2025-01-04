import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Correction de l'icône par défaut pour éviter les erreurs liées à Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
L.Marker.prototype.options.icon = DefaultIcon;

type MarkerType = {
  id: string;
  lat: number;
  lng: number;
  label: string;
};

type MapProps = {
  markers: MarkerType[];
};

const MapComponent: React.FC<MapProps> = ({ markers }) => {
  const center : [number, number] = markers.length > 0 ? [markers[0].lat, markers[0].lng] : [0, 0];

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: '500px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]}>
          <Popup>{marker.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
