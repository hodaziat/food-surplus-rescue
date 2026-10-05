import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await API.post('/auth/login', formData);
      
      localStorage.setItem('token', res.data.token || 'true');
      const userName = res.data.user?.name || res.data.user?.email || 'User';
      localStorage.setItem('username', userName);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // 👈 تسجيل وقت الدخول بالملي ثانية لحساب الانتهاء تلقائياً
      localStorage.setItem('loginTime', Date.now().toString());

      if (onLogin) {
        onLogin(userName);
      }

      navigate('/');
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      setError(backendMessage || 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.');
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
              <h3 className="fw-bold text-dark text-center mb-3">🔑 Anmelden</h3>
              <p className="text-muted text-center small mb-4">Willkommen zurück! Bitte melden Sie sich an.</p>
              
              {error && <div className="alert alert-danger rounded-3 small py-2">{error}</div>}

              <form onSubmit={handleSubmit}>
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

                <div className="mb-4">
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

                <button 
                  type="submit" 
                  className="btn btn-success w-100 fw-bold py-2 rounded-3 shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Anmelden...' : 'Anmelden'}
                </button>
              </form>

              <hr className="my-4 opacity-10" />

              <p className="text-center small text-muted mb-0">
                Noch kein Konto? <Link to="/register" className="fw-bold text-success text-decoration-none">Jetzt registrieren</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;