import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Allgemeine Anfrage',
    message: ''
  });
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedUsername = localStorage.getItem('username');

      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          name: userObj.name || storedUsername || '',
          email: userObj.email || ''
        }));
      } else if (storedUsername) {
        setFormData((prev) => ({
          ...prev,
          name: storedUsername
        }));
      }
    } catch (e) {
      console.error('Fehler beim Laden der Benutzerdaten:', e);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await API.post('/contact', formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Fehler beim Senden der Nachricht.');
    } finally {
      setLoading(false);
      setValidated(true);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-success">Kontaktieren Sie uns</h2>
        <p className="text-muted">
          Haben Sie Fragen, Anregungen oder möchten Sie mehr über unser Projekt erfahren? Schreiben Sie uns!
        </p>
      </div>
      
      <div className="row g-4">
        {/* بطاقة معلومات التواصل */}
        <div className="col-md-5">
          <div className="card border-0 shadow-lg h-100 bg-success text-white rounded-4 overflow-hidden">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title fw-bold mb-4">Kontaktdaten</h5>
                
                <p className="mb-3">
                  <strong>Adresse:</strong>{' '}
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Berliner+Ring+45,+91052+Erlangen" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white text-decoration-underline"
                  >
                    Berliner Ring 45, 91052 Erlangen
                  </a>
                </p>

                {/* رقم الهاتف مع رابط واتساب */}
                <p className="mb-3">
                  <strong>Telefon:</strong>{' '}
                <a 
                href="https://api.whatsapp.com/send?phone=499131456789" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white text-decoration-underline"
                >
                  +49 9131 456789 (WhatsApp)
                </a>
                </p>

                <p className="mb-3">
                  <strong>E-Mail:</strong>{' '}
                  <a href="mailto:kontakt@foodsurplus-erlangen.de" className="text-white text-decoration-underline">
                    kontakt@foodsurplus-erlangen.de
                  </a>
                </p>
              </div>

              <div className="mt-4">
                <p className="mb-2 fw-semibold small">Folgen Sie uns:</p>
                <div className="d-flex gap-2">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline-light btn-sm rounded-pill px-3 fw-bold"
                  >
                    Facebook
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline-light btn-sm rounded-pill px-3 fw-bold"
                  >
                    Instagram
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top border-light opacity-75">
                <small>Wir sind bestrebt, alle Anfragen so schnell wie möglich zu beantworten.</small>
              </div>
            </div>
          </div>
        </div>

        {/* نموذج الإرسال */}
        <div className="col-md-7">
          <div className="card border-0 shadow-lg rounded-4 p-2">
            <div className="card-body p-4">
              {submitted ? (
                <div className="alert alert-success text-center py-4 rounded-3">
                  <h4 className="alert-heading">Vielen Dank!</h4>
                  <p className="mb-0">Ihre Nachricht wurde erfolgreich gesendet.</p>
                </div>
              ) : (
                <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger rounded-3 mb-3">{error}</div>}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Geben Sie Ihren Namen ein" 
                      className="form-control py-2 rounded-3" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <div className="invalid-feedback">
                      Bitte geben Sie Ihren Namen ein.
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">E-Mail-Adresse</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="name@example.com" 
                      className="form-control py-2 rounded-3" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="invalid-feedback">
                      Bitte geben Sie eine gültige E-Mail-Adresse ein.
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Nachricht</label>
                    <textarea 
                      required 
                      rows={4} 
                      placeholder="Ihre Nachricht..." 
                      className="form-control py-2 rounded-3" 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    <div className="invalid-feedback">
                      Bitte schreiben Sie eine Nachricht.
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-success w-100 py-2 fw-bold shadow-sm rounded-3"
                    disabled={loading}
                  >
                    {loading ? 'Wird gesendet...' : 'Nachricht senden'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;