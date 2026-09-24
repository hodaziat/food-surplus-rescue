import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = ({ currentUser }) => {
  return (
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
  );
};

export default HeroBanner;