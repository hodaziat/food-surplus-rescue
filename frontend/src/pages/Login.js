import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Anmelden</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Anmelden
        </button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Noch kein Konto? <Link to="/register">Jetzt registrieren</Link>
      </p>
    </div>
  );
};

export default Login;