import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Profile = () => {
    const storedUser = localStorage.getItem('user');
    const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

    // حالة تعديل البيانات الشخصية
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
    const [loadingProfile, setLoadingProfile] = useState(false);

    // حالة تغيير كلمة المرور
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
    const [loadingPassword, setLoadingPassword] = useState(false);

    // قراءة الدور سواء كان مخزناً بـ role أو user_role أو وضع قيمة افتراضية
    const userRole = user?.role || user?.user_role || 'Nutzer';
    const isAdmin = userRole.toLowerCase() === 'admin';

    // 1. معالجة تحديث البيانات الشخصية
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileMsg({ type: '', text: '' });
        setLoadingProfile(true);

        try {
            await API.put(`/auth/profile/${user.id}`, { name, email });
            
            const updatedUser = { ...user, name, email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            localStorage.setItem('username', name);
            setUser(updatedUser);

            setProfileMsg({ type: 'success', text: 'Profil erfolgreich aktualisiert! (تم تحديث الملف الشخصي بنجاح)' });
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            console.error(err);
            setProfileMsg({ 
                type: 'danger', 
                text: err.response?.data?.error || 'Fehler beim Aktualisieren des Profils.' 
            });
        } finally {
            setLoadingProfile(false);
        }
    };

    // 2. معالجة تغيير كلمة المرور
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMsg({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setPasswordMsg({ type: 'danger', text: 'Die neuen Passwörter stimmen nicht überein. (كلمتا المرور الجديدتان غير متطابقتين)' });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMsg({ type: 'danger', text: 'Das Passwort muss mindestens 6 Zeichen lang sein. (يجب أن تتكون كلمة المرور من 6 خانات على الأقل)' });
            return;
        }

        setLoadingPassword(true);

        try {
            await API.put(`/auth/change-password/${user.id}`, {
                currentPassword,
                newPassword
            });

            setPasswordMsg({ type: 'success', text: 'Passwort erfolgreich geändert! (تم تغيير كلمة المرور بنجاح)' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err);
            setPasswordMsg({ 
                type: 'danger', 
                text: err.response?.data?.error || err.response?.data?.message || 'Fehler beim Ändern des Passworts.' 
            });
        } finally {
            setLoadingPassword(false);
        }
    };

    if (!user) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="warning">Kein Benutzer angemeldet. Bitte melden Sie sich an.</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5" style={{ maxWidth: '800px' }}>
            {/* كارت المعلومات العامة */}
            <Card className="border-0 shadow-sm rounded-4 mb-4 p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                        <div 
                            className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3 shadow-sm"
                            style={{ width: '60px', height: '60px' }}
                        >
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h3 className="fw-bold text-dark m-0">{user.name}</h3>
                            <span className="text-muted small">{user.email}</span>
                        </div>
                    </div>
                    <Badge bg={isAdmin ? 'danger' : 'success'} className="px-3 py-2 rounded-pill fs-6">
                        {userRole.toUpperCase()}
                    </Badge>
                </div>
            </Card>

            <Row className="g-4 mb-4">
                {/* 1. قسم تعديل الاسم والإيميل */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
                        <h5 className="fw-bold text-dark mb-3">✏️ Profil bearbeiten</h5>
                        {profileMsg.text && <Alert variant={profileMsg.type}>{profileMsg.text}</Alert>}

                        <Form onSubmit={handleUpdateProfile}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Name (الاسم)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                    className="rounded-3 py-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">E-Mail (البريد الإلكتروني)</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    className="rounded-3 py-2"
                                />
                            </Form.Group>

                            <Button 
                                type="submit" 
                                variant="success" 
                                className="w-100 fw-bold py-2 rounded-3 shadow-sm"
                                disabled={loadingProfile}
                            >
                                {loadingProfile ? 'Speichern...' : 'Speichern (حفظ التعديلات)'}
                            </Button>
                        </Form>
                    </Card>
                </Col>

                {/* 2. قسم تغيير كلمة المرور */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
                        <h5 className="fw-bold text-dark mb-3">🔒 Passwort ändern</h5>
                        {passwordMsg.text && <Alert variant={passwordMsg.type}>{passwordMsg.text}</Alert>}

                        <Form onSubmit={handleChangePassword}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Aktuelles Passwort</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    value={currentPassword} 
                                    onChange={(e) => setCurrentPassword(e.target.value)} 
                                    required 
                                    className="rounded-3 py-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Neues Passwort</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    required 
                                    className="rounded-3 py-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Neues Passwort bestätigen</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required 
                                    className="rounded-3 py-2"
                                />
                            </Form.Group>

                            <Button 
                                type="submit" 
                                variant="outline-success" 
                                className="w-100 fw-bold py-2 rounded-3 shadow-sm"
                                disabled={loadingPassword}
                            >
                                {loadingPassword ? 'Ändern...' : 'Passwort aktualisieren'}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>

            {/* قسم الروابط السريعة (Schnelllinks) */}
            <Card className="border-0 shadow-sm rounded-4 p-4">
                <h5 className="fw-bold text-dark mb-3">🔗 Schnelllinks</h5>
                <ListGroup variant="flush">
                    {isAdmin && (
                        <ListGroup.Item as={Link} to="/admin-messages" className="list-group-item-action border-0 py-2 text-success fw-semibold text-decoration-none">
                            📥 Nachrichten verwalten (إدارة الرسائل)
                        </ListGroup.Item>
                    )}
                    <ListGroup.Item as={Link} to="/admin-reviews" className="list-group-item-action border-0 py-2 text-primary fw-semibold text-decoration-none">
                        🛡️ Bewertungen verwalten (إدارة التقييمات)
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Container>
    );
};

export default Profile;