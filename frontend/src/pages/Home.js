import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get('/food');
        setListings(res.data);
      } catch (err) {
        console.error('Fehler beim Laden der Angebote:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Hero Banner - Deutsch */}
      <div 
        className="text-white text-center py-5 mb-5 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.9), rgba(33, 37, 41, 0.85)), url("https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200") center/cover no-repeat',
          borderRadius: '0 0 24px 24px',
          paddingTop: '80px',
          paddingBottom: '80px'
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">Lebensmittel retten. Nachbarschaft stärken.</h1>
          <p className="lead fs-4 mb-4 text-light opacity-90">
            Gemeinsam gegen Lebensmittelverschwendung. Retten Sie frische Lebensmittel in Ihrer Nähe.
          </p>
          <Link to="/add-food" className="btn btn-warning btn-lg fw-bold px-4 py-2 shadow-sm text-dark">
            Jetzt Angebot erstellen
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="row g-4">
          
          {/* Main Listings Column */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-dark m-0">📍 Verfügbare Lebensmittel in Erlangen</h3>
              <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">
                {listings.length} Angebote aktiv
              </span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Laden...</span>
                </div>
                <p className="mt-2 text-muted">Angebote werden geladen...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="card border-0 shadow-sm text-center p-5 rounded-4">
                <div className="fs-1 mb-3">🥖</div>
                <h5 className="fw-bold text-secondary">Derzeit sind keine Angebote verfügbar.</h5>
                <p className="text-muted">Seien Sie der Erste, der ein Angebot in Ihrer Gemeinschaft teilt!</p>
                <div>
                  <Link to="/add-food" className="btn btn-outline-success fw-bold px-4 mt-2">
                    Lebensmittel anbieten
                  </Link>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {listings.map((item) => (
                  <div key={item.id} className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all overflow-hidden">
                      <div className="card-body p-4 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <span className="badge bg-success-subtle text-success fw-bold fs-6 px-3 py-2 rounded-pill">
                              📦 {item.quantity}
                            </span>
                            <small className="text-danger fw-semibold bg-danger-subtle px-2 py-1 rounded">
                              ⌛ Bis: {new Date(item.expiration_date).toLocaleDateString()}
                            </small>
                          </div>
                          <h4 className="card-title fw-bold text-dark mb-2">{item.title}</h4>
                          <p className="card-text text-muted mb-3" style={{ fontSize: '0.95rem' }}>
                            {item.description || 'Keine weitere Beschreibung vorhanden.'}
                          </p>
                        </div>
                        <div>
                          <hr className="my-3 opacity-10" />
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="text-secondary fw-semibold">
                              👤 Spender: <span className="text-dark">{item.donor_name || 'Anonym'}</span>
                            </small>
                          </div>
                          <button className="btn btn-success w-100 fw-bold py-2 rounded-3">
                            Reservieren
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Dashboard Column */}
          <div className="col-lg-4">
            {/* Impact Dashboard - Deutsch */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                  <span className="me-2">📊</span> Erfolgs-Dashboard
                </h5>
                <div className="row g-2 text-center">
                  <div className="col-4">
                    <div className="p-3 bg-success text-white rounded-3 shadow-sm">
                      <h3 className="fw-bold mb-0">{listings.length}</h3>
                      <small style={{ fontSize: '11px', opacity: 0.9 }}>Mahlzeiten</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 bg-dark text-white rounded-3 shadow-sm">
                      <h3 className="fw-bold mb-0">12kg</h3>
                      <small style={{ fontSize: '11px', opacity: 0.9 }}>CO₂ gespart</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 bg-primary text-white rounded-3 shadow-sm">
                      <h3 className="fw-bold mb-0">5</h3>
                      <small style={{ fontSize: '11px', opacity: 0.9 }}>Partner</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation Card - Deutsch */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3">Schnelllinks</h6>
                <div className="list-group list-group-flush">
                  <a href="#profile" className="list-group-item list-group-item-action border-0 px-0 text-secondary fw-semibold">
                    👤 Mein Profil
                  </a>
                  <a href="#reservations" className="list-group-item list-group-item-action border-0 px-0 text-secondary fw-semibold">
                    📜 Meine Reservierungen
                  </a>
                  <a href="#partners" className="list-group-item list-group-item-action border-0 px-0 text-secondary fw-semibold">
                    🤝 Soziale Partner
                  </a>
                  <a href="#settings" className="list-group-item list-group-item-action border-0 px-0 text-secondary fw-semibold">
                    ⚙️ Einstellungen
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;