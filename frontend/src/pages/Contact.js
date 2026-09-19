import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const Contact = () => {
    const [validated, setValidated] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setSubmitted(true);
        }
        setValidated(true);
    };

    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold text-success">Kontaktieren Sie uns</h2>
                <p className="text-muted">
                    Haben Sie Fragen, Anregungen oder möchten Sie mehr über unser Projekt erfahren? Schreiben Sie uns!
                </p>
            </div>
            
            <Row className="g-4">
                {/* معلومات التواصل ببطاقة ملونة وخلفية متناسقة */}
                <Col md={5}>
                    <Card className="border-0 shadow-lg h-100 bg-success text-white rounded-4 overflow-hidden">
                        <Card.Body className="p-4 d-flex flex-column justify-content-between">
                            <div>
                                <Card.Title className="fw-bold mb-4">Kontaktdaten</Card.Title>
                                <p className="mb-3"><strong>Adresse:</strong> Berliner Ring 45, 91052 Erlangen</p>
                                <p className="mb-3"><strong>Telefon:</strong> +49 9131 456789</p>
                                <p className="mb-3"><strong>E-Mail:</strong> kontakt@foodsurplus-erlangen.de</p>
                            </div>
                            <div className="mt-4 pt-3 border-top border-light opacity-75">
                                <small>Wir sind bestrebt, alle Anfragen so schnell wie möglich zu beantworten.</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* نموذج الإرسال بتصميم أنيق */}
                <Col md={7}>
                    <Card className="border-0 shadow-lg rounded-4 p-2">
                        <Card.Body className="p-4">
                            {submitted ? (
                                <div className="alert alert-success text-center py-4 rounded-3">
                                    <h4 className="alert-heading">Vielen Dank!</h4>
                                    <p className="mb-0">Ihre Nachricht wurde erfolgreich gesendet.</p>
                                </div>
                            ) : (
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formName">
                                        <Form.Label className="fw-semibold">Name</Form.Label>
                                        <Form.Control required type="text" placeholder="Geben Sie Ihren Namen ein" className="py-2" />
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie Ihren Namen ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label className="fw-semibold">E-Mail-Adresse</Form.Label>
                                        <Form.Control required type="email" placeholder="name@example.com" className="py-2" />
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie eine gültige E-Mail-Adresse ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formMessage">
                                        <Form.Label className="fw-semibold">Nachricht</Form.Label>
                                        <Form.Control required as="textarea" rows={4} placeholder="Ihre Nachricht..." className="py-2" />
                                        <Form.Control.Feedback type="invalid">
                                            Bitte schreiben Sie eine Nachricht.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Button variant="success" type="submit" className="w-100 py-2 fw-bold shadow-sm">
                                        Nachricht senden
                                    </Button>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Contact;