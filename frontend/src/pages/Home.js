import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import FoodMap from '../components/FoodMap';
import FoodFilter from '../components/FoodFilter';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

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

  const handleDelete = async (id) => {
    if (window.confirm('Möchten Sie dieses Angebot wirklich löschen?')) {
      try {
        await API.delete(`/food/${id}`);
        setListings(listings.filter((item) => item.id !== id));
      } catch (err) {
        console.error('Fehler beim Löschen:', err);
        alert('Fehler beim Löschen des Angebots.');
      }
    }
  };

  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Alle' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* 1. قسم الترحيب */}
      <HeroBanner currentUser={currentUser} />

      <div className="container" id="listings-section">
        <div className="row g-4">
          
          <div className="col-lg-8">
            
            {/* 2. الخريطة التفاعلية */}
            <FoodMap />

            {/* 3. شريط البحث والفلاتر */}
            <FoodFilter 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
            />

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
                  /* 4. بطاقة المنتج المنفصلة */
                  <FoodCard 
                    key={item.id} 
                    item={item} 
                    currentUser={currentUser} 
                    handleDelete={handleDelete} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
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