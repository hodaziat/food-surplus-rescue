import React, { useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' // القيمة الافتراضية للعميل
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // استخدام window.location.href لتحديث الصفحة بالكامل وتفعيل الـ Navbar فوراً
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Registrierung fehlgeschlagen.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Konto erstellen</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>E-Mail-Adresse:</label>
          <input
            type="email"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Passwort:</label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Rolle:</label>
          <select
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">Verbraucher / Kunde (Consumer)</option>
            <option value="donor">Spender / Restaurant (Donor)</option>
          </select>
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#198754', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Registrieren
        </button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Bereits ein Konto? <Link to="/login">Hier anmelden</Link>
      </p>
    </div>
  );
};

export default Register;