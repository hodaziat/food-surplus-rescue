import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner, Badge, Button } from 'react-bootstrap';
import API from '../services/api';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchReservations = async () => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get(`/reservations/user/${user.id}`);
      setReservations(res.data);
    } catch (err) {
      console.error('Fehler beim Laden der Reservierungen:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // دالة الحذف بالمعرف الصحيح للحجز
  const handleDeleteReservation = async (item) => {
    // تحديد رقم الحجز بشكل آمن سواء كان reservation_id أو id
    const resId = item.reservation_id || item.id;

    if (window.confirm('Möchten Sie diese Reservierung wirklich stornieren?')) {
      try {
        // 1. تحديث واجهة السلة فوراً قبل إرسال الطلب لاستجابة فائقة السرعة
        setReservations((prev) => prev.filter((r) => (r.reservation_id || r.id) !== resId));

        // 2. إرسال طلب الحذف للسيرفر
        await API.delete(`/reservations/${resId}`);
        
        // 3. إطلاق حدث تحديث العداد في Navbar
        window.dispatchEvent(new Event('updateCart'));

      } catch (err) {
        console.error('Fehler beim Stornieren:', err);
        alert(err.response?.data?.error || 'Fehler beim Stornieren der Reservierung.');
        // إرجاع البيانات في حال حدث خطأ بالسيرفر
        fetchReservations();
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted">Reservierungen werden geladen...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-success mb-4">🛒 Meine Reservierungen</h2>

      {reservations.length === 0 ? (
        <Card className="border-0 shadow-sm p-5 text-center rounded-4">
          <div className="fs-1 mb-2">📜</div>
          <h5 className="fw-bold text-secondary">Sie haben noch keine Lebensmittel reserviert.</h5>
          <p className="text-muted">Besuchen Sie die Startseite, um verfügbare Angebote zu entdecken.</p>
        </Card>
      ) : (
        <Row className="g-3">
          {reservations.map((item) => (
            <Col key={item.reservation_id || item.id} md={6} lg={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100 p-3">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge bg="success" className="px-3 py-2 rounded-pill">
                        Reserviert
                      </Badge>
                      <small className="text-muted">
                        📅 {new Date(item.reserved_at || Date.now()).toLocaleDateString('de-DE')}
                      </small>
                    </div>
                    <h5 className="fw-bold text-dark mt-2">{item.title}</h5>
                    <p className="text-muted small">
                      {item.description || 'Keine weitere Beschreibung vorhanden.'}
                    </p>
                  </div>
                  <div>
                    <hr className="my-2 opacity-10" />
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-success fw-bold">
                        ✅ Abholbereit
                      </small>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDeleteReservation(item)}
                      >
                        🗑️ Stornieren
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Reservations;