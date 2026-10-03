import React from 'react';

const Partners = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-success">🤝 Soziale Partner</h2>
        <p className="text-muted">
          Gemeinsam stark für Nachhaltigkeit und soziale Unterstützung in Erlangen.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4">
            <div className="card-body">
              <h5 className="card-title fw-bold text-dark mb-3">Tafel Erlangen e.V.</h5>
              <p className="card-text text-muted">
                Unser Hauptpartner bei der Verteilung überschüssiger Lebensmittel an Bedürftige.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4">
            <div className="card-body">
              <h5 className="card-title fw-bold text-dark mb-3">Foodsharing Erlangen</h5>
              <p className="card-text text-muted">
                Engagiert gegen Lebensmittelverschwendung durch Rettung von Essbarem.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4">
            <div className="card-body">
              <h5 className="card-title fw-bold text-dark mb-3">Stadt Erlangen</h5>
              <p className="card-text text-muted">
                Unterstützung unseres Projekts im Rahmen der lokalen Nachhaltigkeitsinitiativen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;