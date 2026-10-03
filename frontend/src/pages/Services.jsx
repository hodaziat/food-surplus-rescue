import React from 'react';

const Dienstleistungen = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-success">Unsere Dienstleistungen</h2>
        <p className="text-muted">
          Wir verbinden Menschen, um Lebensmittelverschwendung zu reduzieren und Ressourcen sinnvoll zu nutzen.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4">
            <div className="card-body">
              <h5 className="card-title fw-bold text-dark mb-3">1. Lebensmittel retten</h5>
              <p className="card-text text-muted">
                Lokale Geschäfte und Restaurants können ihr überschüssiges Essen einfach eintragen, anstatt es wegzuwerfen.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4">
            <div className="card-body">
              <h5 className="card-title fw-bold text-dark mb-3">2. Kostenlose Verteilung</h5>
              <p className="card-text text-muted">
                Bedürftige Personen und Nutzer können frische Lebensmittel in ihrer Nähe finden und sicher reservieren.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4">
            <div className="card-body">
              <h5 className="card-title fw-bold text-dark mb-3">3. Qualität & Sicherheit</h5>
              <p className="card-text text-muted">
                Unser Admin-System überwacht die Plattform, um sicherzustellen, dass alle Angebote seriös und sicher sind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dienstleistungen;