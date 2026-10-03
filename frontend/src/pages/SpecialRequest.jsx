import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const SpecialRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    requestedQuantity: '',
    eventDate: '',
    details: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/special-requests', formData).catch(() => {});
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '800px' }}>
      <button 
        type="button" 
        className="btn btn-outline-secondary mb-4 rounded-3" 
        onClick={() => navigate(-1)}
      >
        &larr; Zurück
      </button>

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="bg-success text-white p-4 text-center">
          <h2 className="fw-bold mb-1">🤝 Sonderanfrage für Organisationen</h2>
          <p className="mb-0 opacity-75">
            Für gemeinnützige Vereine, Tafeln und Großveranstaltungen in Erlangen
          </p>
        </div>

        <div className="card-body p-4 p-md-5">
          {submitted ? (
            <div className="alert alert-success text-center rounded-3 p-4">
              <h4 className="alert-heading fw-bold">Vielen Dank für Ihre Anfrage! 🎉</h4>
              <p>
                Ihre Sonderanfrage wurde erfolgreich übermittelt. Unser Team wird sich in Kürze mit Ihnen in Verbindung setzen.
              </p>
              <button 
                type="button" 
                className="btn btn-success mt-2 fw-bold rounded-3 px-4" 
                onClick={() => navigate('/')}
              >
                Zurück zur Startseite
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger rounded-3 mb-3">{error}</div>}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Name der Organisation / Verein</label>
                  <input
                    type="text"
                    className="form-control py-2 rounded-3"
                    name="organizationName"
                    placeholder="z.B. Erlanger Tafel e.V."
                    value={formData.organizationName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Ansprechperson</label>
                  <input
                    type="text"
                    className="form-control py-2 rounded-3"
                    name="contactPerson"
                    placeholder="Vor- und Nachname"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">E-Mail Adresse</label>
                  <input
                    type="email"
                    className="form-control py-2 rounded-3"
                    name="email"
                    placeholder="kontakt@verein.de"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Telefonnummer</label>
                  <input
                    type="tel"
                    className="form-control py-2 rounded-3"
                    name="phone"
                    placeholder="+49 123 456789"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Benötigte Menge (Portionen)</label>
                  <input
                    type="number"
                    className="form-control py-2 rounded-3"
                    name="requestedQuantity"
                    placeholder="z.B. 50"
                    value={formData.requestedQuantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Gewünschtes Datum</label>
                  <input
                    type="date"
                    className="form-control py-2 rounded-3"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Details zur Anfrage / Veranstaltung</label>
                <textarea
                  className="form-control rounded-3"
                  rows={4}
                  name="details"
                  placeholder="Beschreiben Sie kurz Ihren Bedarf oder das Event..."
                  value={formData.details}
                  onChange={handleChange}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-success btn-lg w-100 fw-bold rounded-3"
                disabled={loading}
              >
                {loading ? 'Wird gesendet...' : 'Anfrage Absenden'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialRequest;