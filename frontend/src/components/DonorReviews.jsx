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

  // حالة لتخزين النصوص المؤقتة لردود صاحب المطعم لكل تقييم
  const [replyInputs, setReplyInputs] = useState({});

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // التحقق مما إذا كان المستخدم الحالي هو صاحب المطعم المعني أو مشرف (Admin)
  const isOwner = user && Number(user.id) === Number(donorId);
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

  // دالة إرسال رد صاحب المطعم
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
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div>
            <h5 className="fw-bold text-dark m-0">⭐ Bewertungen für {donorName || 'diesen Partner'}</h5>
            <small className="text-muted">Erfahrungen anderer Nutzer mit diesem Anbieter</small>
          </div>
          <div className="text-end">
            <div className="fs-4 fw-bold text-success m-0">{averageRating} / 5</div>
            <div className="text-warning small">
              {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
              <span className="text-muted ms-1">({totalReviews})</span>
            </div>
          </div>
        </div>

        {/* نموذج كتابة التقييم (لا يظهر لصاحب المطعم) */}
        {user && !isOwner && !isAdmin && (
          <form onSubmit={handleSubmit} className="mb-4 bg-light p-3 rounded-3">
            <h6 className="fw-bold text-dark mb-2">✍️ Partner bewerten</h6>
            
            <div className="mb-2">
              <span className="fs-4 text-warning">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    onClick={() => setRating(star)} 
                    style={{ cursor: 'pointer', marginRight: '4px' }}
                  >
                    {star <= rating ? '★' : '☆'}
                  </span>
                ))}
              </span>
            </div>

            <div className="mb-3">
              <textarea
                rows={2}
                placeholder="Wie war die Abholung / Qualität der Speisen?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-control rounded-3"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-success btn-sm fw-bold rounded-3 px-3" 
              disabled={submitting}
            >
              {submitting ? 'Senden...' : 'Bewertung absenden'}
            </button>
          </form>
        )}

        {/* قائمة التقييمات */}
        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-success" role="status"></div>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-muted text-center my-3 small">Noch keine Bewertungen für diesen Partner vorhanden.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="border-bottom pb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-dark small">👤 {rev.reviewer_name}</strong>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-warning small">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </span>
                    
                    {/* زر الحذف يظهر لصاحب التقييم أو للأدمن */}
                    {user && (Number(rev.reviewer_id) === Number(user.id) || isAdmin) && (
                      <button 
                        type="button"
                        className="btn btn-link text-danger p-0 border-0 text-decoration-none" 
                        style={{ fontSize: '0.8rem' }}
                        onClick={() => handleDelete(rev.id)}
                        title="Löschen"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-muted small mb-1">{rev.comment}</p>
                <small className="text-secondary opacity-75 d-block text-end" style={{ fontSize: '0.7rem' }}>
                  📅 {new Date(rev.created_at).toLocaleDateString('de-DE')}
                </small>

                {/* عرض رد صاحب المطعم إذا وجد */}
                {rev.reply && (
                  <div className="mt-2 bg-light p-2 rounded-3 border-start border-success border-4 ms-3">
                    <small className="fw-bold text-success d-block">💬 Antwort vom Partner:</small>
                    <small className="text-muted">{rev.reply}</small>
                  </div>
                )}

                {/* زر وصندوق كتابة الرد يظهر حصراً لصاحب المطعم المالك لهذه الصفحة (وليس للأدمن) */}
                {isOwner && !rev.reply && (
                  <div className="mt-2 ms-3">
                    <textarea
                      rows={1}
                      placeholder="Antwort als Partner schreiben..."
                      value={replyInputs[rev.id] || ''}
                      onChange={(e) => setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })}
                      className="form-control form-control-sm rounded-3 mb-1"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm rounded-3"
                      style={{ fontSize: '0.75rem' }}
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