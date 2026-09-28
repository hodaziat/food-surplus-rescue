import React from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

const Settings = () => {
    return (
        <Container className="py-5">
            <Card className="border-0 shadow-sm p-4 mx-auto" style={{ maxWidth: '600px' }}>
                <h2 className="fw-bold text-success mb-4">Einstellungen</h2>
                <Form>
                    <Form.Group className="mb-3" controlId="notificationsCheck">
                        <Form.Check type="checkbox" label="E-Mail Benachrichtigungen aktivieren" defaultChecked />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="darkModeCheck">
                        <Form.Check type="checkbox" label="Dunkler Modus (Dark Mode)" />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100">
                        Änderungen speichern
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default Settings;