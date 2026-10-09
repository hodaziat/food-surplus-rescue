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

        // تحديث دوري كل 3 ثوانٍ
        const interval = setInterval(() => {
            fetchDonorOrders();
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchDonorOrders]);

    // دالة حذف الطلب المكتمل أو المنتهي من جهة المطعم
    const handleDeleteCompletedOrder = async (reservationId) => {
        if (window.confirm('Möchten Sie diese abgeschlossene Bestellung wirklich aus der Historie löschen?')) {
            try {
                await API.delete(`/reservations/completed/${reservationId}`);
                alert('Bestellung erfolgreich gelöscht.');
                fetchDonorOrders();
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Fehler beim Löschen der Bestellung.');
            }
        }
    };

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
                                    let formattedDate = 'k.A.';
                                    if (ord.reserved_at) {
                                        const str = String(ord.reserved_at);
                                        const parts = str.split('T');
                                        if (parts.length >= 2) {
                                            const dateParts = parts[0].split('-'); 
                                            const timeParts = parts[1].split(':'); 
                                            if (dateParts.length === 3 && timeParts.length >= 2) {
                                                formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]} ${timeParts[0]}:${timeParts[1]}`;
                                            }
                                        } else {
                                            const d = new Date(ord.reserved_at);
                                            formattedDate = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
                                        }
                                    }

                                    const now = new Date();
                                    const expDate = ord.expiration_date ? new Date(ord.expiration_date) : null;

                                    const isExpiredOrCompleted = 
                                        ord.status === 'completed' || 
                                        ord.status === 'abgeholt' ||
                                        ord.is_expired === true ||
                                        !ord.expiration_date ||
                                        (expDate && expDate <= now);

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
                                                {isExpiredOrCompleted ? (
                                                    <div className="d-flex justify-content-end align-items-center gap-2">
                                                        <Badge bg="secondary" className="px-3 py-2 rounded-pill fw-semibold">
                                                            Abgeschlossen ✅
                                                        </Badge>
                                                        {/* زر الحذف يظهر للمطعم فقط عندما ينتهي الطلب أو يتم استلامه */}
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm" 
                                                            className="rounded-3"
                                                            onClick={() => handleDeleteCompletedOrder(ord.reservation_id)}
                                                        >
                                                            🗑️ Löschen
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm" 
                                                        className="rounded-3"
                                                        onClick={() => handleCancelOrder(ord.reservation_id)}
                                                    >
                                                        Stornieren ❌
                                                    </Button>
                                                )}
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