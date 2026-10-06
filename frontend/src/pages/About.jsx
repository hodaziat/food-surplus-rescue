import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <div className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '85vh' }}>
      <Container>
        
        {/* البانر الرئيسي مع صورة تعبيرية */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5 text-white position-relative">
          <div 
            className="p-5 d-flex flex-column justify-content-center align-items-center text-center" 
            style={{ 
              background: 'linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url("https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
              minHeight: '340px'
            }}
          >
            <span className="badge bg-success text-white px-3 py-2 rounded-pill mb-3 fw-bold shadow-sm">
              🌱 Über uns & Vision
            </span>
            <h1 className="fw-bold display-6 mb-2">Gemeinsam gegen Lebensmittelverschwendung</h1>
            <p className="lead opacity-75 mb-0" style={{ fontSize: '1.1rem', maxWidth: '600px' }}>
              Nachhaltigkeit, Gemeinschaft und technologischer Fortschritt hand in hand für eine bessere Zukunft in Erlangen.
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-9">
            
            {/* قسم إحصائيات بصري مريح للعين */}
            <Row className="g-3 mb-5 text-center">
              <Col md={4}>
                <div className="p-4 bg-white rounded-4 shadow-sm border-0 h-100">
                  <div className="fs-2 mb-1">🌍</div>
                  <h3 className="fw-bold text-success mb-0">100%</h3>
                  <small className="text-muted">Nachhaltig & Lokal</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-4 bg-white rounded-4 shadow-sm border-0 h-100">
                  <div className="fs-2 mb-1">🤝</div>
                  <h3 className="fw-bold text-success mb-0">Stark</h3>
                  <small className="text-muted">Gemeinschaft in Erlangen</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-4 bg-white rounded-4 shadow-sm border-0 h-100">
                  <div className="fs-2 mb-1">💚</div>
                  <h3 className="fw-bold text-success mb-0">Zero</h3>
                  <small className="text-muted">Verschwendung als Ziel</small>
                </div>
              </Col>
            </Row>

            {/* Card 1: Mission */}
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

            {/* قسم اقتباس ملهم (Quote Section) */}
            <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 bg-white text-center border-start border-success border-4">
              <p className="fst-italic text-secondary mb-2" style={{ fontSize: '1.05rem' }}>
                "Jedes gerettete Lebensmittel ist ein kleiner Schritt für unsere Umwelt und ein großer Gewinn für unsere soziale Verantwortung."
              </p>
              <span className="fw-bold text-success small">- Team Food Surplus Rescue</span>
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
      </Container>
    </div>
  );
};

export default About;