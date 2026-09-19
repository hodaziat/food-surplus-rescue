import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Partners = () => {
    return (
        <Container className="py-5">
            <h2 className="fw-bold text-success mb-4">Soziale Partner</h2>
            <Row>
                <Col md={4} className="mb-3">
                    <Card className="border-0 shadow-sm p-3 h-100">
                        <Card.Body>
                            <Card.Title>Tafel Erlangen e.V.</Card.Title>
                            <Card.Text className="text-muted">
                                Unser Hauptpartner bei der Verteilung überschüssiger Lebensmittel an Bedürftige.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="border-0 shadow-sm p-3 h-100">
                        <Card.Body>
                            <Card.Title>Foodsharing Erlangen</Card.Title>
                            <Card.Text className="text-muted">
                                Engagiert gegen Lebensmittelverschwendung durch Rettung von Essbarem.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="border-0 shadow-sm p-3 h-100">
                        <Card.Body>
                            <Card.Title>Stadt Erlangen</Card.Title>
                            <Card.Text className="text-muted">
                                Unterstützung unseres Projekts im Rahmen der lokalen Nachhaltigkeitsinitiativen.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Partners;