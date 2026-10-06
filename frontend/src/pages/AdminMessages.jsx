import React, { useEffect, useState, useCallback } from 'react';
import API from '../services/api';

const AdminMessages = () => {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'archived' | 'special'
  const [messages, setMessages] = useState([]);
  const [specialRequests, setSpecialRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // جلب البيانات بناءً على التبويب النشط
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'special') {
        const res = await API.get('/special-requests');
        setSpecialRequests(Array.isArray(res.data) ? res.data : []);
      } else {
        const endpoint = activeTab === 'archived' ? '/contact/messages/archived' : '/contact/messages';
        const res = await API.get(endpoint);
        setMessages(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error(err);
      setError('Fehler beim Laden der Daten.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // أرشفة الرسائل
  const handleArchive = async (id) => {
    try {
      await API.put(`/contact/messages/${id}/archive`);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error(err);
      alert('Fehler beim Archivieren der Nachricht.');
    }
  };

  // إلغاء أرشفة الرسائل
  const handleUnarchive = async (id) => {
    try {
      await API.put(`/contact/messages/${id}/unarchive`);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error(err);
      alert('Fehler beim Wiederherstellen der Nachricht.');
    }
  };

  // حذف رسالة نهائياً (جديد)
  const handleDeleteMessage = async (id) => {
    if (window.confirm('Möchten Sie diese Nachricht wirklich permanent löschen?')) {
      try {
        await API.delete(`/contact/messages/${id}`);
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      } catch (err) {
        console.error(err);
        alert('Fehler beim Löschen der Nachricht.');
      }
    }
  };

  // حذف طلب خاص
  const handleDeleteSpecialRequest = async (id) => {
    if (window.confirm('Möchten Sie diese Sonderanfrage wirklich löschen?')) {
      try {
        await API.delete(`/special-requests/${id}`);
        setSpecialRequests((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error(err);
        alert('Fehler beim Löschen der Anfrage.');
      }
    }
  };

  return (
    <div className="container py-5">
      {/* العنوان الرئيسي والتنقل السلس عبر الأزرار */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 border-bottom pb-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 shadow-sm" style={{ width: '55px', height: '55px' }}>
            {activeTab === 'active' && '📥'}
            {activeTab === 'archived' && '📁'}
            {activeTab === 'special' && '🤝'}
          </div>
          <div>
            <h2 className="fw-bold text-dark m-0">
              {activeTab === 'active' && 'Eingegangene Nachrichten'}
              {activeTab === 'archived' && 'Archivierte Nachrichten'}
              {activeTab === 'special' && 'Sonderanfragen für Organisationen'}
            </h2>
            <span className="text-muted small">
              {activeTab === 'special'
                ? `${specialRequests.length} Anfragen von Vereinen & Tafeln`
                : `${messages.length} ${activeTab === 'archived' ? 'Nachrichten im Archiv' : 'Neue Nachrichten'}`}
            </span>
          </div>
        </div>

        {/* أزرار التبديل السريع */}
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`btn btn-sm rounded-pill px-3 shadow-sm fw-semibold ${
              activeTab === 'active' ? 'btn-success' : 'btn-outline-secondary'
            }`}
          >
            📥 Eingegangene
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('special')}
            className={`btn btn-sm rounded-pill px-3 shadow-sm fw-semibold ${
              activeTab === 'special' ? 'btn-success' : 'btn-outline-secondary'
            }`}
          >
            🤝 Sonderanfragen
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('archived')}
            className={`btn btn-sm rounded-pill px-3 shadow-sm fw-semibold ${
              activeTab === 'archived' ? 'btn-success' : 'btn-outline-secondary'
            }`}
          >
            📁 Archiv
          </button>

          <button
            type="button"
            onClick={fetchData}
            className="btn btn-outline-success btn-sm rounded-pill px-3 shadow-sm ms-lg-2"
          >
            🔄 Aktualisieren
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Daten werden geladen...</p>
        </div>
      )}

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      {/* عرض الرسائل العامة والمؤرشفة */}
      {!loading && activeTab !== 'special' && (
        <>
          {messages.length === 0 ? (
            <div className="card border-0 shadow-sm text-center p-5 rounded-4 bg-light">
              <div className="fs-1 mb-2">{activeTab === 'archived' ? '📭' : '✨'}</div>
              <h5 className="fw-bold text-secondary">
                {activeTab === 'archived'
                  ? 'Keine archivierten Nachrichten vorhanden.'
                  : 'Alles erledigt! Keine neuen Nachrichten.'}
              </h5>
            </div>
          ) : (
            <div className="row g-4">
              {messages.map((msg) => (
                <div className="col-12" key={msg.id}>
                  <div className="card border-0 shadow-sm rounded-4 p-4 position-relative overflow-hidden">
                    <div
                      className={`position-absolute top-0 start-0 bottom-0 ${
                        activeTab === 'archived' ? 'bg-secondary' : 'bg-success'
                      }`}
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
                        🕒 {msg.created_at ? new Date(msg.created_at).toLocaleString('de-DE') : '-'}
                      </span>
                    </div>

                    <div className="ps-2">
                      <p className="text-secondary small mb-2">
                        <strong>Betreff:</strong> <span className="text-dark fw-semibold">{msg.subject}</span>
                      </p>

                      <div className="bg-light p-3 rounded-3 mb-3 text-dark border-0">
                        {msg.message}
                      </div>

                      <div className="d-flex gap-2">
                        <a
                          href={`mailto:${msg.email}?subject=Antwort auf Ihre Anfrage: ${msg.subject}`}
                          className="btn btn-sm btn-success fw-semibold rounded-pill px-3 shadow-sm"
                        >
                          ✉️ Per E-Mail antworten
                        </a>

                        {activeTab === 'archived' ? (
                          <>
                            <button
                              onClick={() => handleUnarchive(msg.id)}
                              className="btn btn-sm btn-outline-primary fw-semibold rounded-pill px-3 shadow-sm"
                            >
                              📂 Wiederherstellen
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="btn btn-sm btn-outline-danger fw-semibold rounded-pill px-3 shadow-sm"
                            >
                              🗑 Löschen
                            </button>
                          </>
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
          )}
        </>
      )}

      {/* عرض الطلبات الخاصة للمؤسسات */}
      {!loading && activeTab === 'special' && (
        <>
          {specialRequests.length === 0 ? (
            <div className="card border-0 shadow-sm text-center p-5 rounded-4 bg-light">
              <div className="fs-1 mb-2">✨</div>
              <h5 className="fw-bold text-secondary">Keine Sonderanfragen vorhanden.</h5>
            </div>
          ) : (
            <div className="row g-4">
              {specialRequests.map((req) => {
                const orgName = req.organization_name || req.organizationName || 'Organisation';
                const contactPerson = req.contact_person || req.contactPerson || '-';
                const qty = req.requested_quantity || req.requestedQuantity || 0;
                const eventDate = req.event_date || req.eventDate;
                const createdAt = req.created_at || req.createdAt;

                return (
                  <div className="col-12" key={req.id}>
                    <div className="card border-0 shadow-sm rounded-4 p-4 position-relative overflow-hidden">
                      <div className="position-absolute top-0 start-0 bottom-0 bg-success" style={{ width: '6px' }}></div>

                      <div className="d-flex justify-content-between align-items-center mb-3 ps-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-light text-success rounded-circle d-flex align-items-center justify-content-center fw-bold border" style={{ width: '40px', height: '40px' }}>
                            {orgName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="fw-bold mb-0 text-dark">{orgName}</h5>
                            <small className="text-muted">Ansprechperson: {contactPerson}</small>
                          </div>
                        </div>
                        <span className="badge bg-success text-white px-3 py-2 rounded-pill fs-6">
                          📦 {qty} Portionen
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
                              <strong>Gewünschtes Datum:</strong> <span className="text-dark fw-semibold">{eventDate ? new Date(eventDate).toLocaleDateString('de-DE') : '-'}</span>
                            </p>
                          </div>
                          <div className="col-md-4 text-md-end">
                            <small className="text-muted">
                              🕒 Eingegangen am: {createdAt ? new Date(createdAt).toLocaleString('de-DE') : '-'}
                            </small>
                          </div>
                        </div>

                        <div className="bg-light p-3 rounded-3 mb-3 text-dark border-0">
                          <strong>Details / Veranstaltung:</strong>
                          <p className="mb-0 mt-1 text-secondary">{req.details || 'Keine Details angegeben.'}</p>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <a
                            href={`mailto:${req.email}?subject=Antwort auf Ihre Sonderanfrage: ${orgName}`}
                            className="btn btn-sm btn-success fw-semibold rounded-pill px-3 shadow-sm"
                          >
                            ✉️ Per E-Mail antworten
                          </a>

                          <button
                            onClick={() => handleDeleteSpecialRequest(req.id)}
                            className="btn btn-sm btn-outline-danger fw-semibold rounded-pill px-3 shadow-sm"
                          >
                            🗑 Löschen
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminMessages;