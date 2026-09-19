import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Profile = () => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    return (
        <Container className="py-5">
            <Card className="border-0 shadow-sm p-4 mx-auto" style={{ maxWidth: '600px' }}>
                <h2 className="fw-bold text-success mb-4">Mein Profil</h2>
                {user ? (
                    <div>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>E-Mail:</strong> {user.email}</p>
                        <p><strong>Rolle:</strong> {user.role}</p>
                    </div>
                ) : (
                    <p className="text-muted">Kein Benutzer angemeldet.</p>
                )}
            </Card>
        </Container>
    );
};

export default Profile;