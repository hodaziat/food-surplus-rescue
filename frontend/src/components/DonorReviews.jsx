import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const DonorReviews = ({ donorId, donorName }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [replyInputs, setReplyInputs] = useState({});

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isOwner = user && donorId && (String(user.id) === String(donorId) || String(user.donor_id) === String(donorId));
  const isAdmin = user && (user.role === 'admin' || user.user_role === 'admin');

  const fetchReviews = useCallback(async () => {
    if (!donorId) return;
    try {
      const res = await API.get(`/donor-reviews/${donorId}`);
      setReviews(res.data.reviews || []);
      setAverageRating(res.data.average_rating || 0);
      setTotalReviews(res.data.total_reviews || 0);
    } catch (err) {
      console.error('Fehler beim Laden der Partner-Bewertungen:', err);
    } finally {
      setLoading(false);
    }
  }, [donorId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Bitte melden Sie sich an, um eine Bewertung abzugeben.');
      return;
    }

    if (isOwner) {
      alert('Sie können sich nicht selbst bewerten.');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/donor-reviews/add', {
        donor_id: donorId,
        reviewer_id: user.id,
        rating,
        comment
      });
      alert('Vielen Dank für Ihre Bewertung des Partners! ⭐');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Fehler beim Senden der Bewertung.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Möchten Sie diese Bewertung wirklich löschen?')) {
      try {
        await API.delete(`/donor-reviews/${reviewId}`);
        alert('Bewertung erfolgreich gelöscht.');
        fetchReviews();
      } catch (err) {
        console.error('Fehler beim Löschen:', err);
        alert('Fehler beim Löschen der Bewertung.');
      }
    }
  };

  const handleReplySubmit = async (reviewId) => {
    const replyText = replyInputs[reviewId];
    if (!replyText || !replyText.trim()) {
      alert('Bitte geben Sie eine Antwort ein.');
      return;
    }

    try {
      await API.post(`/donor-reviews/reply/${reviewId}`, {
        donor_id: user.id,
        reply: replyText
      });
      alert('Antwort erfolgreich gespeichert!');
      setReplyInputs({ ...replyInputs, [reviewId]: '' });
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Fehler beim Speichern der Antwort.');
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 mt-4 bg-white">
      <div className="card-body">
        
        {/* رأس القسم */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 border-bottom pb-3 gap-3">
          <div>
            <h5 className="fw-bold text-dark m-0">⭐ Bewertungen für {donorName || 'diesen Partner'}</h5>
            <small className="text-muted">Erfahrungen anderer Nutzer mit diesem Anbieter</small>
          </div>
          <div className="text-md-end bg-light p-2 px-3 rounded-3 d-flex align-items-center gap-3">
            <div>
              <div className="fs-4 fw-bold text-success m-0 lh-1">{averageRating} / 5</div>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Basierend auf {totalReviews} Bewertungen</small>
            </div>
            <div className="text-warning fs-5">
              {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
            </div>
          </div>
        </div>

        {/* نموذج كتابة التقييم */}
        {user && !isOwner && !isAdmin && (
          <form onSubmit={handleSubmit} className="mb-4 bg-light p-4 rounded-4 border-0 shadow-sm">
            <h6 className="fw-bold text-dark mb-3">✍️ Partner bewerten</h6>
            
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Ihre Sterne-Bewertung:</label>
              <div className="fs-3 text-warning">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    onClick={() => setRating(star)} 
                    style={{ cursor: 'pointer', marginRight: '6px' }}
                  >
                    {star <= rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <textarea
                rows={3}
                placeholder="Wie war die Abholung / Qualität der Speisen? Teilen Sie Ihre Erfahrung..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-control rounded-3 border-0 bg-white p-3 shadow-sm"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-success fw-bold rounded-pill px-4 shadow-sm" 
              disabled={submitting}
            >
              {submitting ? 'Wird gesendet...' : 'Bewertung absenden'}
            </button>
          </form>
        )}

        {/* قائمة التقييمات */}
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-muted py-4">Noch keine Bewertungen für diesen Partner vorhanden.</div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-3 rounded-4 bg-light border-0 shadow-sm">
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '32px', height: '32px', fontSize: '13px' }}>
                      {rev.reviewer_name ? rev.reviewer_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <strong className="text-dark">{rev.reviewer_name}</strong>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <span className="text-warning">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </span>
                    
                    {user && (Number(rev.reviewer_id) === Number(user.id) || isAdmin) && (
                      <button 
                        type="button"
                        className="btn btn-link text-danger p-0 border-0 text-decoration-none" 
                        onClick={() => handleDelete(rev.id)}
                        title="Löschen"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-secondary small mb-2 ps-4 fst-italic">"{rev.comment}"</p>
                
                <div className="text-end mb-2">
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    📅 {new Date(rev.created_at).toLocaleDateString('de-DE')}
                  </small>
                </div>

                {/* عرض رد صاحب المطعم */}
                {rev.reply && (
                  <div className="mt-2 bg-white p-3 rounded-3 border-start border-success border-4 shadow-sm ms-md-4">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold text-success small">💬 Antwort vom Partner ({donorName || 'Restaurant'}):</span>
                    </div>
                    <p className="text-secondary small mb-0">{rev.reply}</p>
                  </div>
                )}

                {/* كتابة الرد */}
                {isOwner && !rev.reply && (
                  <div className="mt-3 ms-md-4 bg-white p-3 rounded-3 shadow-sm">
                    <label className="form-label small fw-bold text-success mb-1">Als Partner antworten:</label>
                    <textarea
                      rows={2}
                      placeholder="Schreiben Sie eine freundliche Antwort an den Kunden..."
                      value={replyInputs[rev.id] || ''}
                      onChange={(e) => setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })}
                      className="form-control form-control-sm rounded-3 mb-2 border-0 bg-light p-2"
                    />
                    <button
                      type="button"
                      className="btn btn-success btn-sm fw-bold rounded-pill px-4 shadow-sm"
                      onClick={() => handleReplySubmit(rev.id)}
                    >
                      Antwort senden
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DonorReviews;