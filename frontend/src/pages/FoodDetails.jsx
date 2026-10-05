import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FoodMap from '../components/FoodMap';
import DonorReviews from '../components/DonorReviews';
import api from '../services/api';

function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);

  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (parseErr) {
    console.error('Error parsing stored user:', parseErr);
  }

  // جلب بيانات الوجبة بالـ ID
  const fetchFoodDetails = useCallback(() => {
    api.get(`/food/${id}`)
      .then((res) => {
        setFood(res.data || null);
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
          });
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchFoodDetails();
  }, [fetchFoodDetails]);

  // تحويل استخراج الكمية المتاحة إلى رقم نقي بأسلوب آمن
  const parseQuantity = (qty) => {
    if (typeof qty === 'number') return qty;
    if (!qty) return 0;
    const parsed = parseInt(String(qty).replace(/\D/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const availableQty = food ? parseQuantity(food.quantity) : 0;

  // تنفيذ الحجز المباشر وتحديث البيانات
  const handleReserve = async () => {
    if (!user) {
      alert('Bitte melden Sie sich an, um zu reservieren.');
      navigate('/login');
      return;
    }

    if (availableQty <= 0) {
      alert('Leider ist dieses Angebot ausverkauft!');
      return;
    }

    setIsReserving(true);

    try {
      await api.post('/reservations/add', {
        food_id: food.id,
        receiver_id: user.id,
        requested_quantity: 1
      });

      alert('Erfolgreich reserviert und dem Warenkorb hinzugefügt! 🛒');
      
      // إطلاق حدث تحديث السلة في الترويسة Navbar
      window.dispatchEvent(new Event('updateCart'));

      // 1. تحديث متزامن للكمية محلياً فوراً
      setFood((prevFood) => ({
        ...prevFood,
        quantity: Math.max(0, availableQty - 1)
      }));

      // 2. إعادة جلب البيانات لتضمين أحدث التغيرات من السيرفر
      fetchFoodDetails();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Fehler bei der Reservierung.');
    } finally {
      setIsReserving(false);
    }
  };

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

  const isOwner = user && (
    Number(user.id) === Number(food.donor_id) || 
    Number(user.id) === Number(food.user_id) ||
    user.name === food.donor_name || 
    user.name === food.spender
  );

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
                <span className={`badge ${availableQty > 0 ? 'bg-success' : 'bg-danger'} fs-6 px-3 py-2 rounded-pill`}>
                  📦 Menge: {availableQty > 0 ? `${availableQty} Portionen` : 'Ausverkauft'}
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

              {/* زر الحجز المباشر المحدث */}
              {!isOwner ? (
                <button 
                  className="btn btn-success btn-lg w-100 mt-3 fw-bold py-2 rounded-3"
                  onClick={handleReserve}
                  disabled={isReserving || availableQty <= 0}
                >
                  {isReserving ? 'Wird reserviert...' : availableQty <= 0 ? 'Ausverkauft' : 'Jetzt Reservieren 🛒'}
                </button>
              ) : (
                <div className="alert alert-info text-center mt-3 rounded-3 mb-0">
                  Dies ist Ihr eigenes Angebot.
                </div>
              )}
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