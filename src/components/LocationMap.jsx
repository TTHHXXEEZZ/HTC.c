import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom sleek blue pin marker SVG
const bluePinSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
    <path fill="#2563eb" stroke="white" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
`;

// Highlighted red/orange pulsing pin marker SVG
const highlightedPinSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="44" height="44">
    <path fill="#ef4444" stroke="white" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
`;

const blueIcon = L.divIcon({
  html: bluePinSvg,
  className: 'custom-leaflet-pin',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -32]
});

const highlightedIcon = L.divIcon({
  html: highlightedPinSvg,
  className: 'custom-leaflet-pin-highlighted',
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -40]
});

// A helper component to handle updates to the map's bounds/center
function MapController({ center, bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      try {
        map.fitBounds(bounds, { padding: [40, 40] });
      } catch (e) {
        console.error('Fit bounds error:', e);
      }
    } else if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, bounds, map]);

  return null;
}

// Component to handle map clicks for place pin mode
function MapEventsHandler({ onMapClick, interactive }) {
  useMapEvents({
    click(e) {
      if (interactive && onMapClick) {
        onMapClick(e.latlng);
      }
    }
  });
  return null;
}

export default function LocationMap({ 
  lat = 7.0084, 
  lng = 100.4975, 
  workplaces = [], // Optional list for dashboard view
  highlightedId = null, // ID of workplace to highlight
  onWorkplaceClick, // Callback when popup link is clicked
  interactive = false, 
  onLocationChange, 
  height = '300px' 
}) {
  const [position, setPosition] = useState([lat, lng]);
  const markerRefs = useRef({});

  useEffect(() => {
    setPosition([lat, lng]);
  }, [lat, lng]);

  const handleMapClick = (latlng) => {
    const newPos = [latlng.lat, latlng.lng];
    setPosition(newPos);
    if (onLocationChange) {
      onLocationChange({ lat: latlng.lat, lng: latlng.lng });
    }
  };

  // Calculate bounds if displaying multiple workplaces
  const bounds = React.useMemo(() => {
    if (!workplaces || workplaces.length === 0) return null;
    const coords = workplaces
      .filter(w => w.lat && w.lng)
      .map(w => [w.lat, w.lng]);
    return coords.length > 0 ? coords : null;
  }, [workplaces]);

  // Center calculation fallback
  const mapCenter = React.useMemo(() => {
    if (workplaces && workplaces.length > 0) {
      const valid = workplaces.filter(w => w.lat && w.lng);
      if (valid.length > 0) {
        const sumLat = valid.reduce((sum, w) => sum + w.lat, 0);
        const sumLng = valid.reduce((sum, w) => sum + w.lng, 0);
        return [sumLat / valid.length, sumLng / valid.length];
      }
    }
    return position;
  }, [workplaces, position]);

  // Open popup when highlighted ID changes
  useEffect(() => {
    if (highlightedId && markerRefs.current[highlightedId]) {
      markerRefs.current[highlightedId].openPopup();
    }
  }, [highlightedId]);

  const isMultiple = workplaces && workplaces.length > 0;

  return (
    <div className="map-wrapper" style={{ height }}>
      <MapContainer 
        center={mapCenter} 
        zoom={isMultiple ? 13 : 14} 
        style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-md)' }}
        scrollWheelZoom={interactive || isMultiple}
        doubleClickZoom={interactive}
        dragging={interactive || isMultiple || false}
        zoomControl={interactive || isMultiple}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {isMultiple ? (
          // Render multiple markers for dashboard
          workplaces.map(wp => {
            const isHighlighted = wp.id === highlightedId;
            return (
              <Marker 
                key={wp.id} 
                position={[wp.lat, wp.lng]} 
                icon={isHighlighted ? highlightedIcon : blueIcon}
                ref={el => {
                  if (el) markerRefs.current[wp.id] = el;
                }}
              >
                <Popup>
                  <div className="map-popup-content">
                    <span className="popup-category">{wp.category}</span>
                    <h4 className="popup-title">{wp.name}</h4>
                    <p className="popup-dept">{wp.department}</p>
                    <div className="popup-rating">
                      <span className="popup-stars">⭐ {wp.averageRating || '0.0'}</span>
                      <span className="popup-reviews">({wp.totalReviews} รีวิว)</span>
                    </div>
                    {onWorkplaceClick && (
                      <button 
                        className="btn btn-primary btn-xs popup-btn" 
                        onClick={() => onWorkplaceClick(wp.id)}
                      >
                        ดูรายละเอียด
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })
        ) : (
          // Render single marker
          <Marker position={position} icon={blueIcon} />
        )}

        <MapEventsHandler onMapClick={handleMapClick} interactive={interactive} />
        <MapController center={mapCenter} bounds={bounds} />
      </MapContainer>
      
      {interactive && (
        <div className="map-instruction">
          คลิกเลือกตำแหน่งบนแผนที่เพื่อปักหมุดสถานประกอบการ
        </div>
      )}

      <style>{`
        .map-wrapper {
          position: relative;
          width: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .custom-leaflet-pin, .custom-leaflet-pin-highlighted {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
        }

        .custom-leaflet-pin-highlighted {
          animation: mapPinPulse 1.2s infinite ease-in-out;
          z-index: 1000 !important;
        }

        @keyframes mapPinPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); filter: drop-shadow(0 6px 12px rgba(239, 68, 68, 0.4)); }
        }

        .map-instruction {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(15, 23, 42, 0.85);
          color: white;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 500;
          z-index: 1000;
          pointer-events: none;
          backdrop-filter: blur(4px);
          box-shadow: var(--shadow-md);
          text-align: center;
          white-space: nowrap;
        }

        /* Leaflet popup customization */
        .map-popup-content {
          text-align: left;
          min-width: 160px;
          padding: 2px;
        }
        
        .popup-category {
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--primary);
          display: block;
          margin-bottom: 2px;
        }

        .popup-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--navy);
          margin: 0 0 4px 0;
          line-height: 1.3;
        }

        .popup-dept {
          font-size: 0.75rem;
          color: var(--slate);
          margin: 0 0 6px 0;
        }

        .popup-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          margin-bottom: 8px;
        }

        .popup-stars {
          font-weight: 700;
          color: var(--navy);
        }

        .popup-reviews {
          color: var(--slate);
        }

        .btn-xs {
          padding: 4px 8px;
          font-size: 0.75rem;
          border-radius: 4px;
        }

        .popup-btn {
          width: 100%;
          display: block;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
