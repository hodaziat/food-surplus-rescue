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
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold mb-2">💬 Community Feedback</span>
          <h2 className={`fw-bold ${isDark ? 'text-white' : 'text-dark'}`}>Was unsere Nutzer über uns sagen</h2>
          <div className="d-flex align-items-center justify-content-center gap-3 my-3">
            <span className="display-4 fw-bold text-success">{averageRating}</span>
            <div className="text-start">
              <div className="fs-4 text-warning">
                {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
              </div>
              <small className={isDark ? 'text-light opacity-75' : 'text-muted fw-semibold'}>
                Basierend auf {totalReviews} echten Bewertungen
              </small>
            </div>
          </div>
        </div>

        {/* نموذج إضافة تقييم جديد للموقع */}
        {user ? (
          <div className={`card border-0 shadow-sm rounded-4 p-4 p-md-4 mb-5 mx-auto ${isDark ? 'bg-secondary text-white' : 'bg-white'}`} style={{ maxWidth: '650px' }}>
            <h5 className={`fw-bold mb-3 ${isDark ? 'text-white' : 'text-dark'}`}>✍️ Schreiben Sie eine Bewertung für die Plattform</h5>
            <form onSubmit={handleSubmit}>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Ihre Bewertung wählen:</label>
                <div className="fs-3 text-warning">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      onClick={() => setRating(star)} 
                      style={{ cursor: 'pointer', marginRight: '6px', transition: 'transform 0.2s' }}
                      className="rating-star"
                    >
                      {star <= rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <textarea
                  rows={3}
                  placeholder="Wie gefällt Ihnen Food Surplus Rescue Erlangen? Teilen Sie Ihre Erfahrung..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="form-control rounded-3 border-0 bg-light p-3"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-success fw-bold rounded-pill px-5 shadow-sm py-2" 
                disabled={submitting}
              >
                {submitting ? 'Wird gesendet...' : 'Bewertung absenden'}
              </button>
            </form>
          </div>
        ) : (
          <div className="alert alert-success border-0 shadow-sm text-center rounded-4 mb-5 p-3 bg-opacity-10 text-success fw-semibold">
            Bitte <a href="/login" className="fw-bold text-success text-decoration-underline">melden Sie sich an</a>, um eine Bewertung abzugeben.
          </div>
        )}

        {/* عرض قائمة التقييمات المكتوبة بكرات عصرية وأنيقة */}
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-muted py-4">Noch keine Bewertungen vorhanden. Seien Sie der Erste!</div>
        ) : (
          <div className="row g-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="col-md-6 col-lg-4">
                <div className={`card border-0 shadow-sm rounded-4 h-100 p-3 position-relative overflow-hidden ${isDark ? 'bg-secondary text-white' : 'bg-white'}`}>
                  {/* شريط تجميلي علوي للكرت */}
                  <div className="position-absolute top-0 start-0 w-100 bg-success" style={{ height: '4px' }}></div>
                  
                  <div className="card-body d-flex flex-column justify-content-between p-3">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '38px', height: '38px', fontSize: '15px' }}>
                            {rev.user_name ? rev.user_name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <h6 className={`fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>{rev.user_name}</h6>
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>Verifizierter Nutzer</small>
                          </div>
                        </div>

                        {user && Number(rev.user_id) === Number(user.id) && (
                          <button 
                            type="button"
                            className="btn btn-link text-danger p-0 text-decoration-none border-0" 
                            onClick={() => handleDelete(rev.id)}
                            title="Bewertung löschen"
                          >
                            🗑️
                          </button>
                        )}
                      </div>

                      <div className="mb-2 text-warning fs-6">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </div>

                      <p className={`small mb-3 fst-italic ${isDark ? 'text-light' : 'text-secondary'}`}>
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2 border-opacity-10">
                      <span className="badge bg-light text-secondary border fw-normal" style={{ fontSize: '0.65rem' }}>Erlangen</span>
                      <small className={`text-muted`} style={{ fontSize: '0.7rem' }}>
                        📅 {new Date(rev.created_at).toLocaleDateString('de-DE')}
                      </small>
                    </div>
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