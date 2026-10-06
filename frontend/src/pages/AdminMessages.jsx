import React, { useEffect, useState, useCallback } from 'react';
import API from '../services/api';

const AdminMessages = () => {
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

  // دالة أرشفة الرسالة
  const handleArchive = async (id) => {
    try {
      await API.put(`/contact/messages/${id}/archive`);
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error(err);
      alert('Fehler beim Archivieren der Nachricht.');
    }
  };

  // دالة إلغاء الأرشفة (استرجاع الرسالة)
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success">
          {viewArchived ? '📁 Archivierte Nachrichten' : '📥 Eingegangene Nachrichten'}
        </h2>
        <div className="d-flex gap-2">
          <button 
            onClick={() => setViewArchived(!viewArchived)} 
            className="btn btn-outline-secondary btn-sm fw-semibold"
          >
            {viewArchived ? '📥 Aktive Nachrichten anzeigen' : '📁 Archiv anzeigen'}
          </button>
          <button onClick={fetchMessages} className="btn btn-outline-success btn-sm">
            🔄 Aktualisieren
          </button>
        </div>
      </div>

      {loading && <p className="text-muted">Nachrichten werden geladen...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && messages.length === 0 && (
        <div className="alert alert-info rounded-3">
          {viewArchived ? 'Keine archivierten Nachrichten vorhanden.' : 'Keine neuen Nachrichten vorhanden.'}
        </div>
      )}

      <div className="row g-4">
        {messages.map((msg) => (
          <div className="col-12" key={msg.id}>
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold mb-0 text-dark">{msg.name}</h5>
                <small className="text-muted">
                  {new Date(msg.created_at).toLocaleString('de-DE')}
                </small>
              </div>

              <p className="text-muted small mb-2">
                <strong>E-Mail:</strong> <a href={`mailto:${msg.email}`} className="text-success">{msg.email}</a>
              </p>

              <p className="text-secondary small mb-2">
                <strong>Betreff:</strong> {msg.subject}
              </p>

              <div className="bg-light p-3 rounded-3 mb-3 text-dark border">
                {msg.message}
              </div>

              <div className="d-flex gap-2">
                <a 
                  href={`mailto:${msg.email}?subject=Antwort auf Ihre Anfrage: ${msg.subject}`} 
                  className="btn btn-sm btn-success fw-semibold"
                >
                  ✉️ Per E-Mail antworten
                </a>

                {viewArchived ? (
                  <button 
                    onClick={() => handleUnarchive(msg.id)}
                    className="btn btn-sm btn-outline-primary fw-semibold"
                  >
                    📂 Wiederherstellen
                  </button>
                ) : (
                  <button 
                    onClick={() => handleArchive(msg.id)}
                    className="btn btn-sm btn-outline-secondary fw-semibold"
                  >
                    📁 Archivieren
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessages;