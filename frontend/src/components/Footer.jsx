import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto shadow-lg">
      <div className="container">
        <div className="row g-4">
          
          {/* 1. About Section */}
          <div className="col-md-3">
            <h5 className="fw-bold text-success mb-3">🌱 Food Surplus Rescue</h5>
            <p className="text-white opacity-75" style={{ fontSize: '0.88rem' }}>
              Gemeinsam gegen Lebensmittelverschwendung in Erlangen. Wir verbinden Spender mit Menschen, die frische Lebensmittel retten möchten.
            </p>
          </div>

          {/* 2. Schnelllinks (الروابط السريعة المضافة) */}
          <div className="col-md-3">
            <h6 className="fw-bold text-white mb-3">🔗 Schnelllinks</h6>
            <ul className="list-unstyled mb-0" style={{ fontSize: '0.88rem' }}>
              <li className="mb-2">
                <Link to="/" className="text-white opacity-75 text-decoration-none hover-success">
                  Startseite
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-white opacity-75 text-decoration-none hover-success">
                  Dienstleistungen
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/reservations" className="text-white opacity-75 text-decoration-none hover-success">
                  Meine Reservierungen
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/partners" className="text-white opacity-75 text-decoration-none hover-success">
                  Soziale Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Working Hours */}
          <div className="col-md-3">
            <h6 className="fw-bold text-white mb-3">⏰ Öffnungszeiten</h6>
            <p className="text-white opacity-75 mb-1" style={{ fontSize: '0.88rem' }}>
              <strong>Mo - Fr:</strong> 09:00 - 18:00 Uhr
            </p>
            <p className="text-white opacity-75 mb-1" style={{ fontSize: '0.88rem' }}>
              <strong>Samstag:</strong> 10:00 - 15:00 Uhr
            </p>
            <p className="text-white opacity-75" style={{ fontSize: '0.88rem' }}>
              <strong>Sonntag:</strong> Geschlossen
            </p>
          </div>

          {/* 4. Social Media & Contact */}
          <div className="col-md-3">
            <h6 className="fw-bold text-white mb-3">📞 Kontakt & Info</h6>
            <p className="text-white opacity-75 mb-1" style={{ fontSize: '0.88rem' }}>
              📍 Berliner Ring 45, Erlangen
            </p>
            <p className="text-white opacity-75 mb-1" style={{ fontSize: '0.88rem' }}>
              📞 +49 9131 456789
            </p>
            <p className="text-white opacity-75 mb-3" style={{ fontSize: '0.88rem' }}>
              ✉️ kontakt@foodsurplus-erlangen.de
            </p>
            <div className="d-flex gap-2 fs-6">
              <a href="#facebook" className="text-success text-decoration-none small">Facebook</a>
              <a href="#instagram" className="text-success text-decoration-none small">Instagram</a>
            </div>
          </div>

        </div>

        <hr className="my-4 border-secondary opacity-50" />

        <div className="text-center text-white opacity-75" style={{ fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} Food Surplus Rescue Erlangen. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
};

export default Footer;