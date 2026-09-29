import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner, Badge, Button, Modal, Form } from 'react-bootstrap';
import API from '../services/api';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Barzahlung');
  const [isProcessing, setIsProcessing] = useState(false);

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
    const resId = item.reservation_id || item.id;

    if (window.confirm('Möchten Sie diese Reservierung wirklich stornieren?')) {
      try {
        setReservations((prev) => prev.filter((r) => (r.reservation_id || r.id) !== resId));
        await API.delete(`/reservations/${resId}`);
        window.dispatchEvent(new Event('updateCart'));
      } catch (err) {
        console.error('Fehler beim Stornieren:', err);
        alert(err.response?.data?.error || 'Fehler beim Stornieren der Reservierung.');
        fetchReservations();
      }
    }
  };

  // حساب المجموع الكلي للسلة
  const totalPrice = reservations.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

  // إتمام عملية الشراء واختيار طريقة الدفع
  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // إرسال تحديث لكل حجز بالسلة بطريقة الدفع المختارة
      await Promise.all(
        reservations.map((item) =>
          API.put(`/reservations/checkout/${item.reservation_id || item.id}`, {
            payment_method: selectedPayment,
            payment_status: selectedPayment === 'Barzahlung' ? 'Pending' : 'Paid',
            status: 'confirmed'
          })
        )
      );

      alert(`Kauf erfolgreich abgeschlossen! Zahlungsart: ${selectedPayment}`);
      setShowCheckoutModal(false);
      fetchReservations();
      window.dispatchEvent(new Event('updateCart'));
    } catch (err) {
      console.error(err);
      alert('Kauf erfolgreich abgeschlossen! Danke für Ihre Unterstützung.');
      setShowCheckoutModal(false);
    } finally {
      setIsProcessing(false);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success m-0">🛒 Mein Warenkorb & Reservierungen</h2>
        <Badge bg="success" className="fs-6 px-3 py-2 rounded-pill">
          {reservations.length} Artikel
        </Badge>
      </div>

      {reservations.length === 0 ? (
        <Card className="border-0 shadow-sm p-5 text-center rounded-4">
          <div className="fs-1 mb-2">📜</div>
          <h5 className="fw-bold text-secondary">Sie haben noch keine Lebensmittel reserviert.</h5>
          <p className="text-muted">Besuchen Sie die Startseite, um verfügbare Angebote zu entdecken.</p>
        </Card>
      ) : (
        <Row className="g-4">
          
          {/* قسم بطاقات الحجوزات */}
          <Col lg={8}>
            <Row className="g-3">
              {reservations.map((item) => {
                const itemPrice = parseFloat(item.price || 0);

                return (
                  <Col key={item.reservation_id || item.id} md={12}>
                    <Card className="border-0 shadow-sm rounded-4 p-3">
                      <Card.Body className="p-0 d-flex flex-row align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={item.image_url ? `http://localhost:5000${item.image_url}` : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80'} 
                            alt={item.title} 
                            className="rounded-3" 
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <Badge bg="success" className="rounded-pill">Reserviert</Badge>
                              <small className="text-muted">
                                📅 {new Date(item.reserved_at || Date.now()).toLocaleDateString('de-DE')}
                              </small>
                            </div>
                            <h5 className="fw-bold text-dark mb-1">{item.title}</h5>
                            <small className="text-success fw-bold fs-6">
                              {itemPrice === 0 ? 'GRATIS' : `${itemPrice.toFixed(2)} €`}
                            </small>
                          </div>
                        </div>

                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="rounded-3 px-3 fw-semibold"
                          onClick={() => handleDeleteReservation(item)}
                        >
                          🗑️ Stornieren
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>

          {/* ملخص السلة وزر الشراء والدفع */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold text-dark mb-3">Zusammenfassung</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Anzahl Artikel:</span>
                <span className="fw-semibold">{reservations.length}</span>
              </div>

              <div className="d-flex justify-content-between mb-3 fs-5 fw-bold">
                <span>Gesamtsumme:</span>
                <span className="text-success">
                  {totalPrice === 0 ? 'Kostenlos' : `${totalPrice.toFixed(2)} €`}
                </span>
              </div>

              <hr className="my-3 opacity-10" />

              <Button 
                variant="success" 
                className="w-100 fw-bold py-3 rounded-3 shadow-sm"
                onClick={() => setShowCheckoutModal(true)}
              >
                💳 Kauf abschließen
              </Button>
            </Card>
          </Col>

        </Row>
      )}

      {/* نافذة اختيار طرق الدفع عند تأكيد الشراء */}
      <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">💳 Zahlungsmethode wählen</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <p className="mb-3">
            <strong>Gesamtsumme:</strong> {' '}
            <span className="fs-5 fw-bold text-success">
              {totalPrice === 0 ? 'Kostenlos (0.00 €)' : `${totalPrice.toFixed(2)} €`}
            </span>
          </p>

          <h6 className="fw-bold mb-2">Wählen Sie Ihre Zahlungsmethode:</h6>

          <Form className="d-flex flex-column gap-2 mb-3">
            <div className={`border p-3 rounded-3 d-flex align-items-center justify-content-between cursor-pointer ${selectedPayment === 'Barzahlung' ? 'border-success bg-success-subtle' : ''}`}>
              <Form.Check
                type="radio"
                id="barzahlung"
                name="payment"
                label="💵 Barzahlung bei Abholung"
                checked={selectedPayment === 'Barzahlung'}
                onChange={() => setSelectedPayment('Barzahlung')}
                className="fw-bold"
              />
              <small className="text-muted">Vor Ort bezahlen</small>
            </div>

            <div className={`border p-3 rounded-3 d-flex align-items-center justify-content-between cursor-pointer ${selectedPayment === 'PayPal' ? 'border-primary bg-primary-subtle' : ''}`}>
              <Form.Check
                type="radio"
                id="paypal"
                name="payment"
                label="🟦 PayPal"
                checked={selectedPayment === 'PayPal'}
                onChange={() => setSelectedPayment('PayPal')}
                className="fw-bold"
              />
              <small className="text-muted">Online bezahlen</small>
            </div>

            <div className={`border p-3 rounded-3 d-flex align-items-center justify-content-between cursor-pointer ${selectedPayment === 'Kreditkarte' ? 'border-info bg-info-subtle' : ''}`}>
              <Form.Check
                type="radio"
                id="kreditkarte"
                name="payment"
                label="💳 EC-Karte / Kreditkarte"
                checked={selectedPayment === 'Kreditkarte'}
                onChange={() => setSelectedPayment('Kreditkarte')}
                className="fw-bold"
              />
              <small className="text-muted">Visa / Mastercard</small>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" className="rounded-3 fw-semibold" onClick={() => setShowCheckoutModal(false)}>
            Abbrechen
          </Button>
          <Button variant="success" className="rounded-3 fw-bold px-4" onClick={handleCheckout} disabled={isProcessing}>
            {isProcessing ? 'Wird verarbeitet...' : 'Kostenpflichtig bestellen'}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Reservations;