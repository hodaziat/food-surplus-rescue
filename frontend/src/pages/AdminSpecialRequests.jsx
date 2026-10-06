import React, { useEffect, useState, useCallback } from 'react';
import API from '../services/api';

const AdminSpecialRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/special-requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError('Fehler beim Laden der Sonderanfragen.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="container py-5">
      {/* رأس الصفحة مع عداد بصري */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 shadow-sm" style={{ width: '55px', height: '55px' }}>
            🤝
          </div>
          <div>
            <h2 className="fw-bold text-dark m-0">
              Sonderanfragen für Organisationen
            </h2>
            <span className="text-muted small">
              {requests.length} Anfragen von Vereinen & Tafeln
            </span>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button onClick={fetchRequests} className="btn btn-outline-success btn-sm rounded-pill px-3 shadow-sm">
            🔄 Aktualisieren
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Sonderanfragen werden geladen...</p>
        </div>
      )}

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      {!loading && requests.length === 0 && (
        <div className="card border-0 shadow-sm text-center p-5 rounded-4 bg-light">
          <div className="fs-1 mb-2">✨</div>
          <h5 className="fw-bold text-secondary">
            Keine Sonderanfragen vorhanden.
          </h5>
        </div>
      )}

      <div className="row g-4">
        {requests.map((req) => (
          <div className="col-12" key={req.id}>
            <div className="card border-0 shadow-sm rounded-4 p-4 position-relative overflow-hidden">
              {/* شريط ملون على حافة الكارت */}
              <div 
                className="position-absolute top-0 start-0 bottom-0 bg-success" 
                style={{ width: '6px' }}
              ></div>

              <div className="d-flex justify-content-between align-items-center mb-3 ps-2">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-light text-success rounded-circle d-flex align-items-center justify-content-center fw-bold border" style={{ width: '40px', height: '40px' }}>
                    {req.organization_name ? req.organization_name.charAt(0).toUpperCase() : 'O'}
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">{req.organization_name}</h5>
                    <small className="text-muted">Ansprechperson: {req.contact_person}</small>
                  </div>
                </div>
                <span className="badge bg-success text-white px-3 py-2 rounded-pill fs-6">
                  📦 {req.requested_quantity} Portionen
                </span>
              </div>

              <div className="ps-2">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <p className="text-secondary small mb-1">
                      <strong>E-Mail:</strong> <a href={`mailto:${req.email}`} className="text-decoration-none">{req.email}</a>
                    </p>
                    <p className="text-secondary small mb-0">
                      <strong>Telefon:</strong> {req.phone || 'Keine Angabe'}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="text-secondary small mb-0">
                      <strong>Gewünschtes Datum:</strong> <span className="text-dark fw-semibold">{new Date(req.event_date).toLocaleDateString('de-DE')}</span>
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <small className="text-muted">
                      🕒 Eingegangen am: {new Date(req.created_at).toLocaleString('de-DE')}
                    </small>
                  </div>
                </div>

                <div className="bg-light p-3 rounded-3 mb-3 text-dark border-0">
                  <strong>Details / Veranstaltung:</strong>
                  <p className="mb-0 mt-1 text-secondary">{req.details || 'Keine Details angegeben.'}</p>
                </div>

                <div className="d-flex gap-2">
                  <a 
                    href={`mailto:${req.email}?subject=Antwort auf Ihre Sonderanfrage: ${req.organization_name}`} 
                    className="btn btn-sm btn-success fw-semibold rounded-pill px-3 shadow-sm"
                  >
                    ✉️ Per E-Mail antworten
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSpecialRequests;