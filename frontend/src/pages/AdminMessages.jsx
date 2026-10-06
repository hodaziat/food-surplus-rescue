import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [viewArchived, setViewArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = viewArchived ? '/contact/messages/archived' : '/contact/messages';
      const res = await API.get(endpoint);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      setError('Fehler beim Laden der Nachrichten.');
    } finally {
      setLoading(false);
    }
  }, [viewArchived]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleArchive = async (id) => {
    try {
      await API.put(`/contact/messages/${id}/archive`);
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error(err);
      alert('Fehler beim Archivieren der Nachricht.');
    }
  };

  const handleUnarchive = async (id) => {
    try {
      await API.put(`/contact/messages/${id}/unarchive`);
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error(err);
      alert('Fehler beim Wiederherstellen der Nachricht.');
    }
  };

  return (
    <div className="container py-5">
      {/* رأس الصفحة مع عداد بصري وأزرار التنقل */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 shadow-sm" style={{ width: '55px', height: '55px' }}>
            {viewArchived ? '📁' : '📥'}
          </div>
          <div>
            <h2 className="fw-bold text-dark m-0">
              {viewArchived ? 'Archivierte Nachrichten' : 'Eingegangene Nachrichten'}
            </h2>
            <span className="text-muted small">
              {messages.length} {viewArchived ? 'Nachrichten im Archiv' : 'Neue Nachrichten'}
            </span>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {/* زر الانتقال لصفحة طلبات المؤسسات والجمعيات */}
          <button 
            onClick={() => navigate('/admin/special-requests')} 
            className="btn btn-success btn-sm rounded-pill px-3 shadow-sm fw-semibold"
          >
            🤝 Sonderanfragen anzeigen
          </button>

          <button 
            onClick={() => setViewArchived(!viewArchived)} 
            className="btn btn-outline-secondary btn-sm fw-semibold rounded-pill px-3 shadow-sm"
          >
            {viewArchived ? '📥 Aktive anzeigen' : '📁 Archiv anzeigen'}
          </button>
          
          <button onClick={fetchMessages} className="btn btn-outline-success btn-sm rounded-pill px-3 shadow-sm">
            🔄 Aktualisieren
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Nachrichten werden geladen...</p>
        </div>
      )}

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      {!loading && messages.length === 0 && (
        <div className="card border-0 shadow-sm text-center p-5 rounded-4 bg-light">
          <div className="fs-1 mb-2">{viewArchived ? '📭' : '✨'}</div>
          <h5 className="fw-bold text-secondary">
            {viewArchived ? 'Keine archivierten Nachrichten vorhanden.' : 'Alles erledigt! Keine neuen Nachrichten.'}
          </h5>
        </div>
      )}

      <div className="row g-4">
        {messages.map((msg) => (
          <div className="col-12" key={msg.id}>
            <div className="card border-0 shadow-sm rounded-4 p-4 position-relative overflow-hidden">
              {/* شريط ملون بصري على حافة الكارت */}
              <div 
                className={`position-absolute top-0 start-0 bottom-0 ${viewArchived ? 'bg-secondary' : 'bg-success'}`} 
                style={{ width: '6px' }}
              ></div>

              <div className="d-flex justify-content-between align-items-center mb-3 ps-2">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-light text-success rounded-circle d-flex align-items-center justify-content-center fw-bold border" style={{ width: '40px', height: '40px' }}>
                    {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">{msg.name}</h5>
                    <small className="text-muted">{msg.email}</small>
                  </div>
                </div>
                <span className="badge bg-light text-muted border px-3 py-2 rounded-pill small">
                  🕒 {new Date(msg.created_at).toLocaleString('de-DE')}
                </span>
              </div>

              <div className="ps-2">
                <p className="text-secondary small mb-2">
                  <strong>Betreff:</strong> <span className="text-dark fw-semibold">{msg.subject}</span>
                </p>

                <div className="bg-light p-3 rounded-3 mb-3 text-dark border-0 shadow-inner">
                  {msg.message}
                </div>

                <div className="d-flex gap-2">
                  <a 
                    href={`mailto:${msg.email}?subject=Antwort auf Ihre Anfrage: ${msg.subject}`} 
                    className="btn btn-sm btn-success fw-semibold rounded-pill px-3 shadow-sm"
                  >
                    ✉️ Per E-Mail antworten
                  </a>

                  {viewArchived ? (
                    <button 
                      onClick={() => handleUnarchive(msg.id)}
                      className="btn btn-sm btn-outline-primary fw-semibold rounded-pill px-3 shadow-sm"
                    >
                      📂 Wiederherstellen
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleArchive(msg.id)}
                      className="btn btn-sm btn-outline-secondary fw-semibold rounded-pill px-3 shadow-sm"
                    >
                      📁 Archivieren
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessages;