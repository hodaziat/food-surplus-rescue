import React from 'react';

const Datenschutz = () => {
  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h2 className="fw-bold text-success mb-4">🔒 Datenschutzerklärung</h2>
        
        <h5 className="fw-bold text-dark mt-3">1. Datenschutz auf einen Blick</h5>
        <p className="text-muted">
          Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung.
        </p>

        <h5 className="fw-bold text-dark mt-4">2. Verantwortliche Stelle</h5>
        <p className="text-muted">
          Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
          <strong>Food Surplus Rescue Erlangen</strong><br />
          Erlangen, Deutschland<br />
          E-Mail: support@foodsurplusrescue.de
        </p>

        <h5 className="fw-bold text-dark mt-4">3. Erfassung von Daten auf unserer Website</h5>
        <p className="text-muted">
          Wir erfassen personenbezogene Daten (z. B. Name, E-Mail-Adresse), wenn Sie sich registrieren, Angebote erstellen oder Reservierungen vornehmen. Diese Daten werden ausschließlich zur Bereitstellung unserer Dienste verwendet.
        </p>

        <h5 className="fw-bold text-dark mt-4">4. Ihre Rechte</h5>
        <p className="text-muted">
          Sie haben jederzeit das Recht auf kostenlose Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
        </p>
      </div>
    </div>
  );
};

export default Datenschutz;