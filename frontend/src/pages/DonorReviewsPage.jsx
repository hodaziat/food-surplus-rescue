import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import DonorReviews from '../components/DonorReviews';

const DonorReviewsPage = () => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="warning">Bitte melden Sie sich an, um Ihre Bewertungen zu sehen.</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5" style={{ maxWidth: '800px' }}>
            <div className="mb-4">
                <h2 className="fw-bold text-dark">⭐ Meine Restaurant-Bewertungen</h2>
                <p className="text-muted">Hier können Sie das Feedback Ihrer Kunden einsehen und darauf antworten.</p>
            </div>

            {/* عرض مكون التقييمات الخاص بالمطعم المسجل حالياً */}
            <DonorReviews donorId={user.id} donorName={user.name} />
        </Container>
    );
};

export default DonorReviewsPage;