import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Dienstleistungen = () => {
    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">Unsere Dienstleistungen</h2>
            <p className="text-center text-muted mb-5">
                Wir verbinden Menschen, um Lebensmittelverschwendung zu reduzieren und Ressourcen sinnvoll zu nutzen.
            </p>
            <Row>
                <Col md={4} className="mb-4">
                    <Card className="h-4 shadow-sm p-3">
                        <Card.Body>
                            <Card.Title>1. Lebensmittel retten</Card.Title>
                            <Card.Text>
                                Lokale Geschäfte und Restaurants können ihr überschüssiges Essen einfach eintragen, anstatt es wegzuwerfen.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="h-4 shadow-sm p-3">
                        <Card.Body>
                            <Card.Title>2. Kostenlose Verteilung</Card.Title>
                            <Card.Text>
                                Bedürftige Personen und Nutzer können frische Lebensmittel in ihrer Nähe finden und sicher reservieren.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="h-4 shadow-sm p-3">
                        <Card.Body>
                            <Card.Title>3. Qualität & Sicherheit</Card.Title>
                            <Card.Text>
                                Unser Admin-System überwacht die Plattform, um sicherzustellen, dass alle Angebote seriös und sicher sind.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dienstleistungen;