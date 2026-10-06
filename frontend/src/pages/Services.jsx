import React from 'react';
import { Link } from 'react-router-dom';

const Dienstleistungen = () => {
  return (
    <div className="container py-5">
      {/* رأس الصفحة الترحيبية */}
      <div className="text-center mb-5 mx-auto" style={{ maxWidth: '800px' }}>
        <h2 className="fw-bold text-success display-6 mb-3">Unsere Dienstleistungen & Vision</h2>
        <p className="text-muted lead">
          Wir verbinden lokale Unternehmen, Restaurants und engagierte Menschen in Erlangen, um Lebensmittelverschwendung aktiv zu reduzieren und wertvolle Ressourcen sinnvoll zu nutzen.
        </p>
      </div>

      {/* بطاقات الخدمات الرئيسية */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4 bg-light">
            <div className="card-body">
              <div className="fs-1 mb-3 text-success">🥗</div>
              <h5 className="card-title fw-bold text-dark mb-3">1. Lebensmittel retten</h5>
              <p className="card-text text-secondary">
                Lokale Geschäfte, Bäckereien und Restaurants können ihr überschüssiges, aber qualitativ einwandfreies Essen unkompliziert auf unserer Plattform eintragen, anstatt es am Ende des Tages wegzuwerfen. So schützen wir gemeinsam die Umwelt und das Klima in Erlangen.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4 bg-light">
            <div className="card-body">
              <div className="fs-1 mb-3 text-success">🤝</div>
              <h5 className="card-title fw-bold text-dark mb-3">2. Kostenlose Verteilung</h5>
              <p className="card-text text-secondary">
                Bedürftige Personen, Studierende und Nutzer können frische Lebensmittel in ihrer direkten Umgebung finden, sicher reservieren und unkompliziert abholen. Transparenz und gegenseitige Hilfe stehen bei uns an erster Stelle.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100 rounded-4 bg-light">
            <div className="card-body">
              <div className="fs-1 mb-3 text-success">🛡️</div>
              <h5 className="card-title fw-bold text-dark mb-3">3. Qualität & Sicherheit</h5>
              <p className="card-text text-secondary">
                Unser Admin-System und engagiertes Team überwachen die Plattform kontinuierlich. Wir stellen sicher, dass alle angebotenen Lebensmittel den Richtlinien entsprechen und die Übergaben absolut seriös und sicher ablaufen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* قسم إضافي جذاب يربط بالطلبات الخاصة للجمعيات */}
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-success text-white text-position-relative overflow-hidden text-center">
        <div className="card-body position-relative z-1">
          <div className="display-4 mb-3">🏢</div>
          <h3 className="fw-bold mb-3 text-white">Sonderanfragen für Vereine & Tafeln</h3>
          <p className="lead mx-auto mb-4 text-white-50" style={{ maxWidth: '700px' }}>
            Sie organisieren ein großes Event, unterstützen eine gemeinnützige Aktion oder leiten eine soziale Einrichtung in Erlangen? Wir bieten maßgeschneiderte Unterstützung bei größeren Mengen.
          </p>
          <Link 
            to="/special-request" 
            className="btn btn-light btn-lg fw-bold text-success rounded-pill px-5 shadow py-3"
          >
            Jetzt Sonderanfrage stellen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dienstleistungen;