import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Button, Alert, Badge, Form, Tabs, Tab } from 'react-bootstrap';
import API from '../services/api';

const AdminReviewsPage = () => {
    const [siteReviews, setSiteReviews] = useState([]);
    const [donorReviews, setDonorReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyInputs, setReplyInputs] = useState({});

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isAdmin = user && (user.role === 'admin' || user.user_role === 'admin');

    const fetchData = useCallback(async () => {
        try {
            // جلب تقييمات الموقع وتقييمات المطاعم معاً
            const [siteRes, donorRes] = await Promise.all([
                API.get('/site-reviews'),
                API.get('/donor-reviews/all')
            ]);
            setSiteReviews(siteRes.data.reviews || []);
            setDonorReviews(donorRes.data.reviews || []);
        } catch (err) {
            console.error('Fehler beim Laden der Admin-Bewertungen:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // حذف تقييم الموقع
    const handleDeleteSiteReview = async (id) => {
        if (window.confirm('Möchten Sie diese Website-Bewertung wirklich löschen?')) {
            try {
                await API.delete(`/site-reviews/${id}`);
                alert('Bewertung erfolgreich gelöscht.');
                fetchData();
            } catch (err) {
                console.error(err);
                alert('Fehler beim Löschen.');
            }
        }
    };

    // حذف تقييم المطعم
    const handleDeleteDonorReview = async (id) => {
        if (window.confirm('Möchten Sie diese Partner-Bewertung wirklich löschen?')) {
            try {
                await API.delete(`/donor-reviews/${id}`);
                alert('Partner-Bewertung erfolgreich gelöscht.');
                fetchData();
            } catch (err) {
                console.error(err);
                alert('Fehler beim Löschen.');
            }
        }
    };

    // رد الأدمن على تقييم الموقع
    const handleReplySubmit = async (reviewId) => {
        const replyText = replyInputs[reviewId];
        if (!replyText || !replyText.trim()) {
            alert('Bitte geben Sie eine Antwort ein.');
            return;
        }

        try {
            await API.post(`/site-reviews/reply/${reviewId}`, {
                admin_id: user.id,
                reply: replyText
            });
            alert('Antwort erfolgreich gespeichert!');
            setReplyInputs({ ...replyInputs, [reviewId]: '' });
            fetchData();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Fehler beim Speichern der Antwort.');
        }
    };

    if (!isAdmin) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="danger">Nicht autorisiert: Nur Administratoren haben Zugriff auf diese Seite.</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5" style={{ maxWidth: '950px' }}>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold text-dark">🛡️ Admin-Bewertungsverwaltung</h2>
                    <p className="text-muted">Verwalten Sie hier zentral alle Website- und Partner-Bewertungen.</p>
                </div>
                <Badge bg="danger" className="px-3 py-2 fs-6 rounded-pill">
                    Super Admin
                </Badge>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status"></div>
                </div>
            ) : (
                <Tabs defaultActiveKey="site" className="mb-4">
                    
                    {/* تبويب تقييمات الموقع */}
                    <Tab eventKey="site" title={`🌐 Website-Bewertungen (${siteReviews.length})`}>
                        {siteReviews.length === 0 ? (
                            <Alert variant="info" className="text-center rounded-4 mt-3">Keine Website-Bewertungen vorhanden.</Alert>
                        ) : (
                            <div className="d-flex flex-column gap-3 mt-3">
                                {siteReviews.map((rev) => (
                                    <Card key={rev.id} className="border-0 shadow-sm rounded-4 p-3">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <strong className="text-dark">👤 {rev.user_name}</strong>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="text-warning fw-bold">
                                                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                                    </span>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm" 
                                                        className="rounded-3 px-2 py-0"
                                                        onClick={() => handleDeleteSiteReview(rev.id)}
                                                    >
                                                        🗑️ Löschen
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-muted mb-2">{rev.comment}</p>
                                            <small className="text-secondary opacity-75 d-block mb-3" style={{ fontSize: '0.75rem' }}>
                                                📅 {new Date(rev.created_at).toLocaleDateString('de-DE')}
                                            </small>

                                            {rev.reply && (
                                                <div className="mt-2 bg-light p-3 rounded-3 border-start border-success border-4 ms-3 mb-2">
                                                    <small className="fw-bold text-success d-block">💬 Antwort vom Administrator:</small>
                                                    <small className="text-muted">{rev.reply}</small>
                                                </div>
                                            )}

                                            {!rev.reply && (
                                                <div className="mt-3 ms-3">
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={1}
                                                        placeholder="Als Administrator antworten..."
                                                        value={replyInputs[rev.id] || ''}
                                                        onChange={(e) => setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })}
                                                        className="rounded-3 mb-2 form-control-sm"
                                                    />
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="fw-bold rounded-3 px-3"
                                                        onClick={() => handleReplySubmit(rev.id)}
                                                    >
                                                        Antwort senden
                                                    </Button>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Tab>

                    {/* تبويب تقييمات المطاعم (للأدمن للحذف فقط بدون رد) */}
                    <Tab eventKey="donors" title={`🍽️ Partner-Bewertungen (${donorReviews.length})`}>
                        {donorReviews.length === 0 ? (
                            <Alert variant="info" className="text-center rounded-4 mt-3">Keine Partner-Bewertungen vorhanden.</Alert>
                        ) : (
                            <div className="d-flex flex-column gap-3 mt-3">
                                {donorReviews.map((rev) => (
                                    <Card key={rev.id} className="border-0 shadow-sm rounded-4 p-3">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div>
                                                    <strong className="text-dark">👤 {rev.reviewer_name}</strong>
                                                    <span className="text-muted small ms-2">➔ bewertet Partner: <strong>{rev.donor_name}</strong></span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="text-warning fw-bold">
                                                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                                    </span>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm" 
                                                        className="rounded-3 px-2 py-0"
                                                        onClick={() => handleDeleteDonorReview(rev.id)}
                                                    >
                                                        🗑️ Löschen
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-muted mb-2">{rev.comment}</p>
                                            <small className="text-secondary opacity-75 d-block" style={{ fontSize: '0.75rem' }}>
                                                📅 {new Date(rev.created_at).toLocaleDateString('de-DE')}
                                            </small>

                                            {rev.reply && (
                                                <div className="mt-2 bg-light p-2 rounded-3 border-start border-success border-4 ms-3">
                                                    <small className="fw-bold text-success d-block">💬 Antwort vom Partner ({rev.donor_name}):</small>
                                                    <small className="text-muted">{rev.reply}</small>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Tab>

                </Tabs>
            )}
        </Container>
    );
};

export default AdminReviewsPage;