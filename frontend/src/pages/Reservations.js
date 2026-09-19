import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Reservations = () => {
    return (
        <Container className="py-5">
            <h2 className="fw-bold text-success mb-4">Meine Reservierungen</h2>
            <Card className="border-0 shadow-sm p-4 text-center text-muted">
                <p>Sie haben noch keine Lebensmittel reserviert.</p>
            </Card>
        </Container>
    );
};

export default Reservations;