'use client';

import { MapContainer, useMap, Marker, Popup } from 'react-leaflet';
import * as protoleaf from 'protomaps-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngTuple } from 'leaflet';

function ProtomapsLayer() {
  const map = useMap();
  protoleaf.leafletLayer({ url: '/api/nyc/{z}/{x}/{y}.pbf' }).addTo(map);
  return null;
}
export default function NYCMap() {
  protoleaf.leafletLayer({ url: '/api/nyc/{z}/{x}/{y}.pbf' });
  const columbusCircle = [40.76808, -73.98223] as LatLngTuple;
  const center = [40.697104, -73.9795379] as LatLngTuple;
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      id="map"
      style={{
        height: '90vh',
        margin: '10px',
      }}
    >
      <ProtomapsLayer />

      <Marker position={columbusCircle}></Marker>
    </MapContainer>
  );
}
