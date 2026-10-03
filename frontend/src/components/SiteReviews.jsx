import React, { useState, useEffect } from 'react';
import API from '../services/api';

const SiteReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchReviews = async () => {
    try {
      const res = await API.get('/site-reviews');
      setReviews(res.data.reviews || []);
      setAverageRating(res.data.average_rating || 0);
      setTotalReviews(res.data.total_reviews || 0);
    } catch (err) {
      console.error('Fehler beim Laden der Website-Bewertungen:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Bitte melden Sie sich an, um eine Bewertung abzugeben.');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/site-reviews/add', {
        user_id: user.id,
        rating,
        comment
      });
      alert('Vielen Dank für Ihre Bewertung! ⭐');
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
    if (window.confirm('Möchten Sie Ihre Bewertung wirklich löschen?')) {
      try {
        await API.delete(`/site-reviews/${reviewId}`);
        alert('Ihre Bewertung wurde erfolgreich gelöscht.');
        fetchReviews();
      } catch (err) {
        console.error('Fehler beim Löschen:', err);
        alert('Fehler beim Löschen der Bewertung.');
      }
    }
  };

  const isDark = document.body.classList.contains('dark-mode-active');

  return (
    <div className={`py-5 rounded-4 my-5 p-4 shadow-sm ${isDark ? 'bg-dark text-white' : 'bg-light'}`}>
      <div className="container">
        
        {/* ملخص تقييم الموقع */}
        <div className="text-center mb-5">
          <h2 className={`fw-bold ${isDark ? 'text-white' : 'text-dark'}`}>⭐ Was unsere Nutzer über uns sagen</h2>
          <div className="d-flex align-items-center justify-content-center gap-2 my-2">
            <span className="display-5 fw-bold text-success">{averageRating}</span>
            <div className="text-start">
              <div className="fs-4 text-warning">
                {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
              </div>
              <small className={isDark ? 'text-light opacity-75' : 'text-muted'}>
                Basierend auf {totalReviews} Bewertungen
              </small>
            </div>
          </div>
        </div>

        {/* نموذج إضافة تقييم جديد للموقع */}
        {user ? (
          <div className={`card border-0 shadow-sm rounded-4 p-4 mb-5 mx-auto ${isDark ? 'bg-secondary text-white' : ''}`} style={{ maxWidth: '600px' }}>
            <h5 className={`fw-bold mb-3 ${isDark ? 'text-white' : 'text-dark'}`}>✍️ Schreiben Sie eine Bewertung für die Plattform</h5>
            <form onSubmit={handleSubmit}>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Ihre Bewertung:</label>
                <div className="fs-3 text-warning">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      onClick={() => setRating(star)} 
                      style={{ cursor: 'pointer', marginRight: '5px' }}
                    >
                      {star <= rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <textarea
                  rows={3}
                  placeholder="Wie gefällt Ihnen Food Surplus Rescue Erlangen? Hinterlassen Sie ein Feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="form-control rounded-3"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-success fw-bold rounded-3 px-4" 
                disabled={submitting}
              >
                {submitting ? 'Wird gesendet...' : 'Bewertung absenden'}
              </button>
            </form>
          </div>
        ) : (
          <div className="alert alert-info text-center rounded-4 mb-5">
            Bitte <a href="/login" className="fw-bold">melden Sie sich an</a>, um eine Bewertung abzugeben.
          </div>
        )}

        {/* عرض قائمة التقييمات المكتوبة */}
        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : (
          <div className="row g-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="col-md-6 col-lg-4">
                <div className={`card border-0 shadow-sm rounded-4 h-100 p-3 ${isDark ? 'bg-secondary text-white' : ''}`}>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong className={isDark ? 'text-white' : 'text-dark'}>👤 {rev.user_name}</strong>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-warning fw-bold">
                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                          </span>

                          {user && Number(rev.user_id) === Number(user.id) && (
                            <button 
                              type="button"
                              className="btn btn-link text-danger p-0 ms-1 text-decoration-none border-0" 
                              onClick={() => handleDelete(rev.id)}
                              title="Bewertung löschen"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                      <p className={`small mb-2 ${isDark ? 'text-light' : 'text-muted'}`}>{rev.comment}</p>
                    </div>

                    <small className={`d-block text-end mt-2 ${isDark ? 'text-light opacity-75' : 'text-secondary'}`} style={{ fontSize: '0.75rem' }}>
                      📅 {new Date(rev.created_at).toLocaleDateString('de-DE')}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SiteReviews;