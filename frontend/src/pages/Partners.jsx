import React from 'react';
import { Link } from 'react-router-dom';

const Partners = () => {
  return (
    <div className="container py-5">
      {/* رأس الصفحة الترحيبية */}
      <div className="text-center mb-5 mx-auto" style={{ maxWidth: '800px' }}>
        <h2 className="fw-bold text-success display-6 mb-3">🤝 Unsere Soziale Partner</h2>
        <p className="text-muted lead">
          Gemeinsam stark für Nachhaltigkeit, Klimaschutz und soziale Unterstützung in Erlangen. Durch die enge Zusammenarbeit mit unseren Partnern maximieren wir unsere Wirkung vor Ort.
        </p>
      </div>

      {/* بطاقات الشركاء الرئيسية (5 شركاء) */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4 bg-light">
            <div className="card-body">
              <div className="fs-1 mb-3 text-success">🏢</div>
              <h5 className="card-title fw-bold text-dark mb-3">Tafel Erlangen e.V.</h5>
              <p className="card-text text-secondary">
                Unser Hauptpartner bei der Verteilung überschüssiger Lebensmittel an Bedürftige. Die Tafel leistet unschätzbare Arbeit in der Region, um Menschen in schwierigen Lebenslagen direkt zu unterstützen.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4 bg-light">
            <div className="card-body">
              <div className="fs-1 mb-3 text-success">🌱</div>
              <h5 className="card-title fw-bold text-dark mb-3">Foodsharing Erlangen</h5>
              <p className="card-text text-secondary">
                Engagiert gegen Lebensmittelverschwendung durch Rettung von Essbarem. Diese Initiative verbindet ehrenamtliche Helfer mit lokalen Betrieben, um Lebensmittel vor der Tonne zu bewahren.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4 bg-light">
            <div className="card-body">
              <div className="fs-1 mb-3 text-success">🏛</div>
              <h5 className="card-title fw-bold text-dark mb-3">Stadt Erlangen</h5>
              <p className="card-text text-secondary">
                Unterstützung unseres Projekts im Rahmen der lokalen Nachhaltigkeitsinitiativen. Die Stadt fördert aktiv Maßnahmen zum Umweltschutz und zur Ressourcenschonung.
              </p>
            </div>
          </div>
        </div>

        {/* الشريك الرابع الجديد */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4 bg-light">
            <div className="card-body">
              <div className="fs-1 mb-3 text-success">🥖</div>
              <h5 className="card-title fw-bold text-dark mb-3">Bäckerei & Café Erlangen Süd</h5>
              <p className="card-text text-secondary">
                Unser lokaler Bäckerei-Partner, der täglich frische Backwarenüberschüsse bereitstellt, damit diese direkt an bedürftige Familien und Studenten verteilt werden können.
              </p>
            </div>
          </div>
        </div>

        {/* الشريك الخامس الجديد */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4 bg-light">
            <div className="card-body">
              <div className="fs-1 mb-3 text-success">🌍</div>
              <h5 className="card-title fw-bold text-dark mb-3">Nachhaltigkeits-Initiative Erlangen</h5>
              <p className="card-text text-secondary">
                Ein Zusammenschluss von Freiwilligen und Studenten, die sich für umweltfreundliche Projekte, Zero-Waste-Aktionen und den bewussten Umgang mit Lebensmitteln in der Universitätsstadt einsetzen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* قسم سفلي توضيحي */}
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-success text-white text-center">
        <div className="card-body">
          <div className="display-4 mb-3">🤝</div>
          <h3 className="fw-bold mb-3 text-white">Möchten Sie auch Partner werden?</h3>
          <p className="lead mx-auto mb-4 text-white-50" style={{ maxWidth: '700px' }}>
            Betreiben Sie ein Restaurant, ein Geschäft oder eine soziale Einrichtung in Erlangen und möchten sich unserer Mission anschließen? Wir freuen uns über jede Kooperation!
          </p>
          <Link 
            to="/contact" 
            className="btn btn-light btn-lg fw-bold text-success rounded-pill px-5 shadow py-3"
          >
            Kontaktieren Sie uns
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Partners;