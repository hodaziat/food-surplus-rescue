import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto shadow-lg">
      <div className="container">
        <div className="row g-4">
          
          {/* About Section */}
          <div className="col-md-4">
            <h5 className="fw-bold text-success mb-3">🌱 Food Surplus Rescue</h5>
            <p className="text-white opacity-75" style={{ fontSize: '0.9rem' }}>
              Gemeinsam gegen Lebensmittelverschwendung in Erlangen. Wir verbinden Spender mit Menschen, die frische Lebensmittel retten möchten.
            </p>
          </div>

          {/* Working Hours */}
          <div className="col-md-4">
            <h6 className="fw-bold text-white mb-3">⏰ Öffnungszeiten</h6>
            <p className="text-white opacity-75 mb-1" style={{ fontSize: '0.9rem' }}>
              <strong>Montag - Freitag:</strong> 09:00 - 18:00 Uhr
            </p>
            <p className="text-white opacity-75 mb-1" style={{ fontSize: '0.9rem' }}>
              <strong>Samstag:</strong> 10:00 - 15:00 Uhr
            </p>
            <p className="text-white opacity-75" style={{ fontSize: '0.9rem' }}>
              <strong>Sonntag:</strong> Geschlossen
            </p>
          </div>

          {/* Social Media & Contact */}
          <div className="col-md-4">
            <h6 className="fw-bold text-white mb-3">📞 Kontakt & Info</h6>
            <p className="text-white opacity-75 mb-1" style={{ fontSize: '0.9rem' }}>
              📍 Adresse: Berliner Ring 45, 91052 Erlangen
            </p>
            <p className="text-white opacity-75 mb-1" style={{ fontSize: '0.9rem' }}>
              📞 Telefon: +49 9131 456789
            </p>
            <p className="text-white opacity-75 mb-3" style={{ fontSize: '0.9rem' }}>
              ✉️ E-Mail: kontakt@foodsurplus-erlangen.de
            </p>
            <div className="d-flex gap-3 fs-6">
              <a href="#facebook" className="text-success text-decoration-none">🌐 Facebook</a>
              <a href="#instagram" className="text-success text-decoration-none">📸 Instagram</a>
              <a href="#twitter" className="text-success text-decoration-none">💬 Twitter</a>
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