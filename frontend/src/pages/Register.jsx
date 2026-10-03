import React, { useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/register', formData);
      
      localStorage.setItem('token', res.data.token || 'true');
      const userName = res.data.user?.name || res.data.user?.email || formData.name || 'User';
      localStorage.setItem('username', userName);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      window.location.href = '/';
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      setError(backendMessage || 'Registrierung fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '85vh', paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h3 className="fw-bold text-dark text-center mb-3">📝 Konto erstellen</h3>
              <p className="text-muted text-center small mb-4">Werden Sie Teil unserer Food-Saving-Community!</p>
              
              {error && <div className="alert alert-danger rounded-3 small py-2">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Name</label>
                  <input
                    type="text"
                    className="form-control py-2 rounded-3"
                    placeholder="Ihr Name oder Firmenname"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">E-Mail-Adresse</label>
                  <input
                    type="email"
                    className="form-control py-2 rounded-3"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Passwort</label>
                  <input
                    type="password"
                    className="form-control py-2 rounded-3"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Rolle</label>
                  <select
                    className="form-select py-2 rounded-3"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="user">Verbraucher / Kunde (Consumer)</option>
                    <option value="donor">Spender / Restaurant (Donor)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success w-100 fw-bold py-2 rounded-3 shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Registrieren...' : 'Registrieren'}
                </button>
              </form>

              <hr className="my-4 opacity-10" />

              <p className="text-center small text-muted mb-0">
                Bereits ein Konto? <Link to="/login" className="fw-bold text-success text-decoration-none">Hier anmelden</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;