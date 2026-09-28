import React from 'react';

const About = () => {
  return (
    <div className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '85vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            {/* Header with subtle badge */}
            <div className="text-center mb-5">
              <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill mb-3 fw-bold">
                🌱 Über uns & Projekt
              </span>
              <h1 className="fw-bold text-dark mb-3">Gemeinsam gegen Lebensmittelverschwendung</h1>
              <p className="text-muted fs-5">
                Nachhaltigkeit, Gemeinschaft und Innovation in Erlangen.
              </p>
            </div>

            {/* Card 1: Mission (with hover effect) */}
            <div className="card shadow-sm border-0 p-4 mb-4 rounded-4 bg-white" 
                 style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-4px)';
                   e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.08)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                 }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="fs-3 bg-success bg-opacity-10 p-3 rounded-circle text-success">🎯</div>
                <h3 className="fw-bold text-dark m-0">Unsere Mission</h3>
              </div>
              <p className="text-secondary mb-0" style={{ lineHeight: '1.8' }}>
                Jedes Jahr werden tonnenweise frische und genießbare Lebensmittel weggeworfen, während gleichzeitig Menschen in unserer Gemeinschaft auf Unterstützung angewiesen sind. Unsere Plattform <strong>Food Surplus Rescue</strong> schließt diese Lücke. Wir verbinden lokale Bäckereien, Restaurants und Supermärkte direkt mit umweltbewussten Bürgern, um überschüssiges Essen zu retten.
              </p>
            </div>

            {/* Card 2: How it works */}
            <div className="card shadow-sm border-0 p-4 mb-4 rounded-4 bg-white"
                 style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-4px)';
                   e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.08)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                 }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="fs-3 bg-success bg-opacity-10 p-3 rounded-circle text-success">⚙️</div>
                <h3 className="fw-bold text-dark m-0">Wie es funktioniert</h3>
              </div>
              <ul className="text-secondary ps-3 mb-0" style={{ lineHeight: '1.9' }}>
                <li><strong>Anbieter (Spender):</strong> Restaurants oder Läden stellen übrig gebliebene Lebensmittel unkompliziert ein.</li>
                <li><strong>Nutzer:</strong> Bürger aus Erlangen durchstöbern die Plattform und entdecken Angebote in ihrer Nähe.</li>
                <li><strong>Retten & Abholen:</strong> Lebensmittel werden online reserviert und vor Ort abgeholt – unkompliziert und nachhaltig.</li>
              </ul>
            </div>

            {/* Card 3: Academic Badge */}
            <div className="card border-0 p-4 rounded-4 text-white shadow" 
                 style={{ background: 'linear-gradient(135deg, #198754, #146c43)' }}>
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="fs-3 bg-white bg-opacity-25 p-3 rounded-circle text-white">🎓</div>
                <h4 className="fw-bold m-0">Akademisches Projekt</h4>
              </div>
              <p className="text-white opacity-75 mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                Dieses Projekt wurde im Rahmen des Studiums entwickelt, um moderne Webtechnologien (MERN Stack, Bootstrap) praktisch anzuwenden und einen echten ökologischen Beitrag in Erlangen zu leisten.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;