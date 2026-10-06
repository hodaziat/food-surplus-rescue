import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto shadow-lg border-top border-success border-3">
      <div className="container">
        <div className="row g-4 mb-4 align-items-stretch">
          
          {/* 1. Über uns */}
          <div className="col-lg-3 col-md-6 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold text-success mb-3">🌱 Food Surplus Rescue</h5>
              <p className="text-white-50 lh-base mb-3" style={{ fontSize: '0.88rem' }}>
                Gemeinsam gegen Lebensmittelverschwendung in Erlangen. Wir verbinden lokale Spender mit Menschen, die frische Lebensmittel retten möchten.
              </p>
            </div>
            <div className="p-2 rounded-3 bg-dark border border-success border-opacity-50 text-center shadow-sm">
              <span className="text-white fw-bold small">
                🌍 <span className="text-success">Rettet Essen</span>, schützt das Klima!
              </span>
            </div>
          </div>

          {/* 2. Schnelllinks */}
          <div className="col-lg-3 col-md-6 d-flex flex-column justify-content-between">
            <div>
              <h6 className="fw-bold text-white mb-3 border-start border-success border-3 ps-2">🔗 Schnelllinks</h6>
              <ul className="list-unstyled mb-0" style={{ fontSize: '0.88rem' }}>
                <li className="mb-2">
                  <Link to="/" className="text-white-50 text-decoration-none hover-success transition-all">
                    ▶ Startseite
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/services" className="text-white-50 text-decoration-none hover-success transition-all">
                    ▶ Dienstleistungen
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/reservations" className="text-white-50 text-decoration-none hover-success transition-all">
                    ▶ Meine Reservierungen
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/partners" className="text-white-50 text-decoration-none hover-success transition-all">
                    ▶ Soziale Partner
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/datenschutz" className="text-white-50 text-decoration-none hover-success transition-all">
                    🔒 Datenschutzerklärung
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Öffnungszeiten & Abholung */}
          <div className="col-lg-3 col-md-6 d-flex flex-column justify-content-between">
            <div>
              <h6 className="fw-bold text-white mb-3 border-start border-success border-3 ps-2">⏰ Öffnungszeiten & Abholung</h6>
              <p className="text-white-50 mb-1" style={{ fontSize: '0.88rem' }}>
                <strong className="text-white">Mo - Fr:</strong> 09:00 - 18:00 Uhr
              </p>
              <p className="text-white-50 mb-1" style={{ fontSize: '0.88rem' }}>
                <strong className="text-white">Samstag:</strong> 10:00 - 15:00 Uhr
              </p>
              <p className="text-white-50 mb-3" style={{ fontSize: '0.88rem' }}>
                <strong className="text-white">Sonntag:</strong> Geschlossen
              </p>
            </div>
            <div className="text-white-50 small bg-dark p-2 rounded border border-secondary border-opacity-20" style={{ fontSize: '0.8rem' }}>
              ℹ️ Abholzeiten richten sich nach den Angaben des jeweiligen Partners.
            </div>
          </div>

          {/* 4. Kontakt & Social Media */}
          <div className="col-lg-3 col-md-6 d-flex flex-column justify-content-between">
            <div>
              <h6 className="fw-bold text-white mb-3 border-start border-success border-3 ps-2">📞 Kontakt & Info</h6>
              
              {/* العنوان مع رابط خرائط جوجل */}
              <p className="text-white-50 mb-1" style={{ fontSize: '0.88rem' }}>
                📍{' '}
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Berliner+Ring+45,+91052+Erlangen" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white-50 text-decoration-underline"
                >
                  Berliner Ring 45, 91052 Erlangen
                </a>
              </p>

              {/* رقم الهاتف مع رابط واتساب مباشر */}
              <p className="text-white-50 mb-1" style={{ fontSize: '0.88rem' }}>
                📞{' '}
                <a 
                  href="https://wa.me/499131456789" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white-50 text-decoration-underline"
                >
                  +49 9131 456789
                </a>
              </p>

              {/* البريد الإلكتروني مع رابط Mailto */}
              <p className="text-white-50 mb-3" style={{ fontSize: '0.88rem' }}>
                ✉️{' '}
                <a href="mailto:kontakt@foodsurplus-erlangen.de" className="text-white-50 text-decoration-underline">
                  kontakt@foodsurplus-erlangen.de
                </a>
              </p>
            </div>

            <div>
              <span className="text-white-50 d-block small mb-2">Folgen Sie uns:</span>
              <div className="d-flex gap-2">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-sm btn-outline-success fw-bold px-3 rounded-pill"
                >
                  Facebook
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-sm btn-outline-success fw-bold px-3 rounded-pill"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="row">
          <div className="col-12 text-center">
            <p className="text-white-50 mb-1" style={{ fontSize: '0.85rem' }}>
              &copy; {new Date().getFullYear()} Food Surplus Rescue Erlangen. Alle Rechte vorbehalten.
            </p>
            <div>
              <Link to="/datenschutz" className="text-success text-decoration-none small hover-underline">
                Datenschutzerklärung
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;