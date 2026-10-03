import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FoodMap from '../components/FoodMap';
import DonorReviews from '../components/DonorReviews';
import api from '../services/api';

function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب بيانات الوجبة مباشرة بالـ ID
    api.get(`/food/${id}`)
      .then((res) => {
        setFood(res.data || null);
        setLoading(false);
      })
      .catch(() => {
        // Fallback في حال جلب القائمة كاملة
        api.get('/food')
          .then((res) => {
            const found = res.data.find((item) => String(item.id) === String(id));
            setFood(found || null);
          })
          .catch((err) => {
            console.error('Error fetching food details:', err);
          })
          .finally(() => setLoading(false));
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="container my-5 text-center">
        <h4>Angebot nicht gefunden!</h4>
        <button className="btn btn-success mt-3 rounded-3 fw-bold" onClick={() => navigate('/')}>
          Zurück zur Startseite
        </button>
      </div>
    );
  }

  const formattedDate = food.expiration_date || food.expiry_date
    ? new Date(food.expiration_date || food.expiry_date).toLocaleDateString('de-DE')
    : 'k.A.';

  const imageUrl = food.image_url 
    ? `http://localhost:5000${food.image_url}` 
    : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';

  const donorId = food.donor_id || food.user_id;
  const donorName = food.donor_name || food.spender || 'Anonym';

  return (
    <div className="container my-4">
      <button className="btn btn-outline-secondary mb-3 rounded-3" onClick={() => navigate(-1)}>
        &larr; Zurück
      </button>

      <div className="row g-4">
        {/* تفاصيل الوجبة والصورة + قسم تقييم المطعم */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div style={{ height: '280px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
              <img 
                src={imageUrl} 
                alt={food.title} 
                className="w-100 h-100" 
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold text-dark mb-0">{food.title}</h2>
                <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">
                  📦 Menge: {food.quantity}
                </span>
              </div>

              <p className="text-muted mb-3">
                👤 <strong>Spender:</strong> {donorName}
              </p>

              <div className="bg-light p-3 rounded-3 mb-3">
                <small className="text-danger fw-semibold">
                  ⌛ Haltbar bis: {formattedDate}
                </small>
              </div>

              <hr />

              <h5 className="fw-bold mb-2">Beschreibung:</h5>
              <p className="text-secondary mb-4">
                {food.description || 'Keine weitere Beschreibung vorhanden.'}
              </p>

              <hr />

              <h5 className="fw-bold mb-2">Abholort:</h5>
              <p className="text-secondary">📍 {food.location || 'Erlangen Stadtmitte'}</p>

              <button 
                className="btn btn-success btn-lg w-100 mt-3 fw-bold py-2 rounded-3"
                onClick={() => navigate('/')}
              >
                Jetzt Reservieren (auf Startseite)
              </button>
            </div>
          </div>

          {/* قسم تقييم المتبرع */}
          {donorId && (
            <DonorReviews donorId={donorId} donorName={donorName} />
          )}
        </div>

        {/* الخريطة */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-white border-bottom-0 pt-3 px-3">
              <h5 className="fw-bold mb-0">Abholort auf der Karte</h5>
            </div>
            <div className="card-body p-0" style={{ height: '350px' }}>
              <FoodMap foodListings={[food]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;