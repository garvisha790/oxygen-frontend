import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const GoogleMap = ({ sites, onSiteClick }) => {
  // Define marker colors based on status
  const getMarkerColor = (status) => {
    switch (status) {
      case 'Error':
        return 'red';
      case 'Warning':
        return 'orange';
      case 'Offline':
        return 'gray';
      default:
        return 'green';
    }
  };

  return (
    <div className="google-map-container">
      <h3>Google Map with Site Level Status</h3>
      <MapContainer
        center={[12.9121, 77.6446]} // Default center
        zoom={12}
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {sites.map((site) => (
          <Marker
            key={site.id}
            position={[site.lat, site.lng]}
            icon={L.divIcon({
              className: 'custom-icon',
              html: `<div style="background-color: ${getMarkerColor(site.status)}; width: 12px; height: 12px; border-radius: 50%;"></div>`,
            })}
            eventHandlers={{
              click: () => onSiteClick(site), // Trigger on click
            }}
          >
            <Popup>
              <strong>{site.name}</strong> <br />
              Status: {site.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GoogleMap;
