import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import FoodMap from '../components/FoodMap';
import DonorReviews from '../components/DonorReviews';
import api from '../services/api';

function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب جميع الوجبات والبحث عن الوجبة المطلوبة بنفس الـ ID
    api.get('/food')
      .then((res) => {
        const found = res.data.find((item) => String(item.id) === String(id));
        setFood(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching food details:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  if (!food) {
    return (
      <Container className="my-5 text-center">
        <h4>Angebot nicht gefunden!</h4>
        <Button variant="success" className="mt-3" onClick={() => navigate('/')}>
          Zurück zur Startseite
        </Button>
      </Container>
    );
  }

  const formattedDate = food.expiration_date || food.expiry_date
    ? new Date(food.expiration_date || food.expiry_date).toLocaleDateString('de-DE')
    : 'k.A.';

  // مسار الصورة المرفوعة
  const imageUrl = food.image_url 
    ? `http://localhost:5000${food.image_url}` 
    : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';

  // معرف المطعم/المتبرع واسمه
  const donorId = food.donor_id || food.user_id;
  const donorName = food.donor_name || food.spender || 'Anonym';

  return (
    <Container className="my-4">
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
        &larr; Zurück
      </Button>

      <Row className="g-4">
        {/* تفاصيل الوجبة والصورة + قسم تقييم المطعم بالكامل */}
        <Col md={7}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
            {/* عرض صورة الوجبة */}
            <div style={{ height: '280px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
              <img 
                src={imageUrl} 
                alt={food.title} 
                className="w-100 h-100" 
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold text-dark mb-0">{food.title}</h2>
                <Badge bg="success" className="fs-6 px-3 py-2 rounded-pill">
                  📦 Menge: {food.quantity}
                </Badge>
              </div>

              <p className="text-muted mb-3">
                👤 <strong>Spender:</strong> {donorName}
              </p>

              <div className="bg-light p-3 rounded-3 mb-3">
                <small className="text-danger fw-semibold">
                  ⌛ Haltbar bis: {formattedDate}
                </small>
              </div>

              <hr />

              <h5 className="fw-bold mb-2">Beschreibung:</h5>
              <p className="text-secondary mb-4">
                {food.description || 'Keine weitere Beschreibung vorhanden.'}
              </p>

              <hr />

              <h5 className="fw-bold mb-2">Abholort:</h5>
              <p className="text-secondary">📍 {food.location || 'Erlangen Stadtmitte'}</p>

              <Button 
                variant="success" 
                size="lg" 
                className="w-100 mt-3 fw-bold py-2 rounded-3"
                onClick={() => navigate('/')}
              >
                Jetzt Reservieren (auf Startseite)
              </Button>
            </Card.Body>
          </Card>

          {/* قسم تقييم المطعم المخصص بالنجوم والتعليقات والنموذج */}
          {donorId && (
            <DonorReviews donorId={donorId} donorName={donorName} />
          )}
        </Col>

        {/* الخريطة */}
        <Col md={5}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-bottom-0 pt-3 px-3">
              <h5 className="fw-bold mb-0">Abholort auf der Karte</h5>
            </Card.Header>
            <Card.Body style={{ height: '350px', padding: 0 }}>
              <FoodMap foodListings={[food]} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default FoodDetails;