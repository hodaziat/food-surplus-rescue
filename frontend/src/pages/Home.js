import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Rating from '../components/Rating';

// إصلاح أيقونات الخريطة في React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  // قراءة المستخدم الحالي من الـ LocalStorage لمعرفة دوره
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const erlangenCenter = [49.5897, 11.0039];

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

  // دالة الحذف الخاصة بالأدمن
  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie dieses Angebot wirklich löschen?')) {
      try {
        await API.delete(`/food/${id}`);
        // تحديث القائمة محلياً لتختفي البطاقة فوراً
        setListings(listings.filter((item) => item.id !== id));
      } catch (err) {
        console.error('Fehler beim Löschen:', err);
        alert('Fehler beim Löschen des Angebots.');
      }
    }
  };

  // تصفية النتائج بناءً على البحث والفئة
  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Alle' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Hero Banner */}
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

          {/* الزر الديناميكي حسب نوع المستخدم: يظهر فقط إذا كان donor */}
          {currentUser && currentUser.role === 'donor' ? (
            <Link to="/add-food" className="btn btn-warning btn-lg fw-bold px-4 py-2 shadow-sm text-dark">
              ➕ Jetzt Angebot erstellen
            </Link>
          ) : (
            <a href="#listings-section" className="btn btn-warning btn-lg fw-bold px-4 py-2 shadow-sm text-dark">
              🔍 Verfügbare Angebote durchstöbern
            </a>
          )}
        </div>
      </div>

      <div className="container" id="listings-section">
        <div className="row g-4">
          
          {/* Main Content Column */}
          <div className="col-lg-8">
            
            {/* Map Section */}
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
                <div style={{ height: '180px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                  <MapContainer 
                    center={erlangenCenter} 
                    zoom={13} 
                    scrollWheelZoom={false} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={erlangenCenter}>
                      <Popup>
                        <strong>Erlangen Zentrum</strong><br />
                        Aktive Food-Saving Zone 🥖
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Search & Filter Bar Section */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-3">
                <div className="row g-2">
                  <div className="col-md-7">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 rounded-start-3 text-muted">🔍</span>
                      <input
                        type="text"
                        className="form-control border-start-0 py-2 rounded-end-3"
                        placeholder="Lebensmittel suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-5">
                    <select
                      className="form-select py-2 rounded-3 text-secondary fw-semibold"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="Alle">Alle Kategorien (جميع الفئات)</option>
                      <option value="Bäckerei">🥖 Backwaren (مخبوزات)</option>
                      <option value="Obst & Gemüse">🍎 Obst & Gemüse (فواكه وخضار)</option>
                      <option value="Gekochtes">🍲 Gekochte Speisen (وجبات مطبوخة)</option>
                      <option value="Sonstiges">📦 Sonstiges (أخرى)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Listings Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-dark m-0">📍 Verfügbare Lebensmittel</h3>
              <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">
                {filteredListings.length} Angebote
              </span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Laden...</span>
                </div>
                <p className="mt-2 text-muted">Angebote werden geladen...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="card border-0 shadow-sm text-center p-5 rounded-4">
                <div className="fs-1 mb-3">🔍</div>
                <h5 className="fw-bold text-secondary">Keine passenden Angebote gefunden.</h5>
                <p className="text-muted">Versuchen Sie einen anderen Suchbegriff.</p>
                {/* زر إضافة عرض يظهر فقط للـ donor */}
                {currentUser && currentUser.role === 'donor' && (
                  <div>
                    <Link to="/add-food" className="btn btn-outline-success fw-bold px-4 mt-2">
                      Lebensmittel anbieten
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="row g-3">
                {filteredListings.map((item) => (
                  <div key={item.id} className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all overflow-hidden">
                      <div className="card-body p-4 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <span className="badge bg-success-subtle text-success fw-bold fs-6 px-3 py-2 rounded-pill">
                              📦 {item.quantity}
                            </span>
                            
                            <div className="d-flex align-items-center gap-2">
                              <small className="text-danger fw-semibold bg-danger-subtle px-2 py-1 rounded">
                                ⌛ Bis: {new Date(item.expiration_date).toLocaleDateString()}
                              </small>

                              {/* زر الحذف يظهر فقط إذا كان المستخدم الحالي Admin */}
                              {currentUser && currentUser.role === 'admin' && (
                                <button 
                                  onClick={() => handleDelete(item.id)}
                                  className="btn btn-outline-danger btn-sm border-0 py-0 px-1"
                                  title="Angebot löschen (Admin)"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
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
                            <div className="mt-1">
                              <Rating initialRating={item.rating || 5} />
                            </div>
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

          {/* Sidebar Column */}
          <div className="col-lg-4">
            {/* Impact Dashboard */}
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

            {/* Quick Navigation Card */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3">Schnelllinks</h6>
                <div className="list-group list-group-flush">
                  <Link to="/profile" className="list-group-item list-group-item-action border-0 px-0 text-secondary fw-semibold text-decoration-none">
                    👤 Mein Profil
                  </Link>
                  <Link to="/reservations" className="list-group-item list-group-item-action border-0 px-0 text-secondary fw-semibold text-decoration-none">
                    📜 Meine Reservierungen
                  </Link>
                  <Link to="/partners" className="list-group-item list-group-item-action border-0 px-0 text-secondary fw-semibold text-decoration-none">
                    🤝 Soziale Partner
                  </Link>
                  <Link to="/settings" className="list-group-item list-group-item-action border-0 px-0 text-secondary fw-semibold text-decoration-none">
                    ⚙️ Einstellungen
                  </Link>
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