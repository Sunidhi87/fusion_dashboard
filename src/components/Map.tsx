import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { IntelligenceNode } from '../types/intelligence';
import PopupContent from './PopupContent';
import { useEffect } from 'react';

// Fix for default Leaflet icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  nodes: IntelligenceNode[];
  selectedNode: IntelligenceNode | null;
}

const createCustomIcon = (type: string) => {
  let color = '255, 255, 255';
  let hex = '#ffffff';
  
  if (type === 'OSINT') { color = '59, 130, 246'; hex = '#3b82f6'; } // Blue
  if (type === 'HUMINT') { color = '245, 158, 11'; hex = '#f59e0b'; } // Amber
  if (type === 'IMINT') { color = '16, 185, 129'; hex = '#10b981'; } // Green

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 16px;
      height: 16px;
      background-color: ${hex};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 10px rgba(${color}, 0.8), 0 0 20px rgba(${color}, 0.5);
      --marker-color: ${color};
    " class="marker-pulse"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
  });
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function Map({ nodes, selectedNode }: MapProps) {
  // Default to a central location if no nodes, or center of nodes
  const center: [number, number] = selectedNode
    ? [selectedNode.latitude, selectedNode.longitude]
    : nodes.length > 0 
      ? [nodes[0].latitude, nodes[0].longitude] 
      : [34.0522, -118.2437]; // Los Angeles

  return (
    <div style={{ flex: 1, height: '100%', position: 'relative' }}>
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ width: '100%', height: '100%', background: '#0a0e17' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        {/* We add a subtle dark overlay to the map using a pane or just keeping the map dark */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />
        
        <MapUpdater center={center} />

        {nodes.map(node => (
          <Marker 
            key={node.id} 
            position={[node.latitude, node.longitude]}
            icon={createCustomIcon(node.type)}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },
              // keeping it open on hover, might not need mouseout immediately to let them interact with popup
              // mouseout: (e) => { e.target.closePopup(); }
            }}
          >
            <Popup closeButton={true}>
              <PopupContent node={node} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
