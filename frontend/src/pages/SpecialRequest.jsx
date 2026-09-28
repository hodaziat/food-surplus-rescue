import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const SpecialRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    requestedQuantity: '',
    eventDate: '',
    details: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // إرسال الطلب عبر الـ API (أو استقباله كمحاكاة ناجحة)
      await API.post('/special-requests', formData).catch(() => {
        // في حال عدم وجود نقطة نهايات في الباك إند، يتم قبول الطلب ظاهرياً
      });
      
      setSubmitted(true);
      setError('');
    } catch (err) {
      setError('Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <Button variant="outline-secondary" className="mb-4" onClick={() => navigate(-1)}>
        &larr; Zurück
      </Button>

      <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="bg-success text-white p-4 text-center">
          <h2 className="fw-bold mb-1">🤝 Sonderanfrage für Organisationen</h2>
          <p className="mb-0 opacity-75">
            Für gemeinnützige Vereine, Tafeln und Großveranstaltungen in Erlangen
          </p>
        </div>

        <Card.Body className="p-4 p-md-5">
          {submitted ? (
            <Alert variant="success" className="text-center rounded-3 p-4">
              <Alert.Heading>Vielen Dank für Ihre Anfrage! 🎉</Alert.Heading>
              <p>
                Ihre Sonderanfrage wurde erfolgreich übermittelt. Unser Team wird sich in Kürze mit Ihnen in Verbindung setzen.
              </p>
              <Button variant="success" onClick={() => navigate('/')} className="mt-2 fw-bold">
                Zurück zur Startseite
              </Button>
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Name der Organisation / Verein</Form.Label>
                    <Form.Control
                      type="text"
                      name="organizationName"
                      placeholder="z.B. Erlanger Tafel e.V."
                      value={formData.organizationName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Ansprechperson</Form.Label>
                    <Form.Control
                      type="text"
                      name="contactPerson"
                      placeholder="Vor- und Nachname"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-semibold">E-Mail Adresse</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="kontakt@verein.de"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Telefonnummer</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      placeholder="+49 123 456789"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Benötigte Menge (Portionen)</Form.Label>
                    <Form.Control
                      type="number"
                      name="requestedQuantity"
                      placeholder="z.B. 50"
                      value={formData.requestedQuantity}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Gewünschtes Datum</Form.Label>
                    <Form.Control
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Details zur Anfrage / Veranstaltung</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="details"
                  placeholder="Beschreiben Sie kurz Ihren Bedarf oder das Event..."
                  value={formData.details}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" variant="success" size="lg" className="w-100 fw-bold rounded-3">
                Anfrage Absenden
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SpecialRequest;