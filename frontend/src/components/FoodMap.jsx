import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// إصلاح أيقونات الخريطة في React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FoodMap = ({ foodListings = [] }) => {
  const erlangenCenter = [49.5897, 11.0039];
  
  const isSingleItem = foodListings.length === 1;

  // تمركز الخريطة على موقع الوجبة إذا كانت معروضة لوحدها
  const mapCenter = isSingleItem && (foodListings[0].lat || foodListings[0].latitude)
    ? [foodListings[0].lat || foodListings[0].latitude, foodListings[0].lng || foodListings[0].longitude]
    : erlangenCenter;

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
      <div className="card-body p-3 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold text-dark m-0 d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
            <span className="me-2">🗺️</span> Interaktive Karte - Erlangen
          </h6>
          <span className="badge bg-light text-secondary border fw-normal" style={{ fontSize: '0.75rem' }}>
            Live Standorte
          </span>
        </div>
        <div style={{ height: '280px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
          <MapContainer 
            center={mapCenter} 
            zoom={isSingleItem ? 15 : 13} 
            scrollWheelZoom={false} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {foodListings.length > 0 ? (
              foodListings.map((item, index) => {
                const position = [
                  item.lat || item.latitude || (erlangenCenter[0] + (index * 0.002)), 
                  item.lng || item.longitude || (erlangenCenter[1] + (index * 0.002))
                ];

                return (
                  <Marker 
                    key={item.id || index} 
                    position={position}
                    eventHandlers={{
                      add: (e) => {
                        if (isSingleItem) {
                          e.target.openPopup();
                        }
                      },
                    }}
                  >
                    <Popup autoPan={false}>
                      <strong>{item.title}</strong><br />
                      👤 {item.donor_name || item.spender || 'Anonym'}<br />
                      📍 {item.location || 'Erlangen Stadtmitte'}
                    </Popup>
                  </Marker>
                );
              })
            ) : (
              <Marker position={erlangenCenter}>
                <Popup autoPan={false}>
                  <strong>Erlangen Zentrum</strong><br />
                  Aktive Food-Saving Zone 🥖
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default FoodMap;