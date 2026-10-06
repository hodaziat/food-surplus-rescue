import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import API from '../services/api';

const DonorOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    let user = null;
    try {
        const storedUser = localStorage.getItem('user');
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch (parseErr) {
        console.error('Error parsing stored user:', parseErr);
    }
    
    const isDonor = user && (
        user.role === 'donor' || 
        user.user_role === 'donor' || 
        user.role === 'admin' || 
        user.role === 'restaurant'
    );

    const userId = user?.id;

    const fetchDonorOrders = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        
        try {
            const res = await API.get(`/reservations/donor-orders/${userId}`);
            setOrders(res.data || []);
        } catch (err) {
            console.error('Fehler beim Laden der Bestellungen:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchDonorOrders();
    }, [fetchDonorOrders]);

    const handleCancelOrder = async (reservationId) => {
        if (window.confirm('Möchten Sie diese Reservierung wirklich stornieren?')) {
            try {
                await API.delete(`/reservations/${reservationId}`);
                alert('Reservierung erfolgreich storniert.');
                fetchDonorOrders();
            } catch (err) {
                console.error(err);
                alert('Fehler beim Stornieren der Reservierung.');
            }
        }
    };

    if (!isDonor) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="danger">Zugriff verweigert: Nur Partner/Gastronomen können diese Seite einsehen.</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5" style={{ maxWidth: '1000px' }}>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold text-dark">📋 Eingegangene Reservierungen</h2>
                    <p className="text-muted">Hier sehen Sie alle Abholanfragen und Reservierungen von Nutzern für Ihre Speisen.</p>
                </div>
                <Badge bg="success" className="px-3 py-2 fs-6 rounded-pill">
                    {orders.length} Reservierungen
                </Badge>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status"></div>
                </div>
            ) : orders.length === 0 ? (
                <Alert variant="info" className="text-center rounded-4 py-4">
                    Keine aktiven Reservierungen vorhanden.
                </Alert>
            ) : (
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0 align-middle">
                            <thead className="bg-light border-bottom">
                                <tr>
                                    <th className="py-3 ps-3"># ID</th>
                                    <th className="py-3">👤 Kunde</th>
                                    <th className="py-3">🍲 Angebot</th>
                                    <th className="py-3">📝 Beschreibung</th>
                                    <th className="py-3">📅 Reserviert am</th>
                                    <th className="py-3 text-end pe-3">Aktion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((ord) => {
                                    const dateObj = ord.reserved_at ? new Date(ord.reserved_at) : null;
                                    const formattedDate = dateObj && !isNaN(dateObj) 
                                        ? `${dateObj.toLocaleDateString('de-DE')} - ${dateObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}` 
                                        : 'k.A.';

                                    return (
                                        <tr key={ord.reservation_id}>
                                            <td className="ps-3 fw-bold text-success">#{ord.reservation_id}</td>
                                            <td>
                                                <div className="fw-bold text-dark">{ord.customer_name || 'Anonym'}</div>
                                                <small className="text-muted">{ord.customer_email || ''}</small>
                                            </td>
                                            <td>
                                                <span className="fw-semibold text-dark">{ord.food_title}</span>
                                                {parseFloat(ord.price) > 0 && (
                                                    <Badge bg="outline-success" className="text-success border border-success ms-2">
                                                        {parseFloat(ord.price).toFixed(2)} €
                                                    </Badge>
                                                )}
                                            </td>
                                            <td>
                                                <small className="text-secondary">{ord.food_description || 'Keine Beschreibung'}</small>
                                            </td>
                                            <td>
                                                <small className="text-muted">{formattedDate}</small>
                                            </td>
                                            <td className="text-end pe-3">
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm" 
                                                    className="rounded-3"
                                                    onClick={() => handleCancelOrder(ord.reservation_id)}
                                                >
                                                    Stornieren ❌
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default DonorOrdersPage;