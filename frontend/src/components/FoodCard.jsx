import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const FoodCard = ({ item, currentUser, handleDelete, onReserveSuccess }) => {
  const storedUser = localStorage.getItem('user');
  const user = currentUser || (storedUser ? JSON.parse(storedUser) : null);
  const navigate = useNavigate();

  const [donorRating, setDonorRating] = useState(null);

  const donorId = item.donor_id || item.user_id;

  // جلب متوسط تقييم المطعم/المتبرع للكرت
  useEffect(() => {
    if (donorId) {
      API.get(`/donor-reviews/${donorId}`)
        .then((res) => {
          setDonorRating(res.data.average_rating || null);
        })
        .catch((err) => {
          console.error('Fehler beim Laden der Partner-Bewertung:', err);
        });
    }
  }, [donorId]);

  const imageUrl = item.image_url 
    ? `http://localhost:5000${item.image_url}` 
    : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80';

  const isOwner = user && (
    user.id === item.donor_id || 
    user.name === item.donor_name || 
    user.name === item.spender
  );

  const isAdmin = user && user.role === 'admin';

  // إضافة الوجبة للسلة بشكل مباشر عند الحجز
  const handleReserve = async () => {
    if (!user) {
      alert('Bitte melden Sie sich an, um zu reservieren.');
      return;
    }

    try {
      await API.post('/reservations/add', {
        food_id: item.id,
        receiver_id: user.id
      });

      alert('In den Warenkorb gelegt! 🛒');
      window.dispatchEvent(new Event('updateCart'));

      if (onReserveSuccess) {
        onReserveSuccess();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Fehler bei der Reservierung.');
    }
  };

  const formattedDate = item.expiration_date || item.expiry_date
    ? new Date(item.expiration_date || item.expiry_date).toLocaleDateString('de-DE')
    : 'k.A.';

  const price = parseFloat(item.price || 0);
  const originalPrice = parseFloat(item.original_price || 0);

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all overflow-hidden">
        
        {/* قسم الصورة */}
        <div style={{ height: '170px', overflow: 'hidden', position: 'relative' }}>
          <img 
            src={imageUrl} 
            alt={item.title} 
            className="w-100 h-100" 
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80';
            }}
          />
          <span className="badge bg-success position-absolute top-0 end-0 m-3 rounded-pill px-3 py-2 shadow-sm">
            📦 {item.quantity} Portionen
          </span>

          {/* عرض السعر للمشتري فقط */}
          {!isOwner && (
            <span className="badge bg-dark position-absolute bottom-0 start-0 m-3 rounded-pill px-3 py-2 shadow-sm fs-6">
              {price === 0 ? (
                <span className="text-warning fw-bold">GRATIS</span>
              ) : (
                <span>
                  {price.toFixed(2)} €
                  {originalPrice > price && (
                    <small className="text-decoration-line-through text-white-50 ms-2" style={{ fontSize: '0.75rem' }}>
                      {originalPrice.toFixed(2)} €
                    </small>
                  )}
                </span>
              )}
            </span>
          )}
        </div>

        <div className="card-body p-3 d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-danger fw-semibold bg-danger-subtle px-2 py-1 rounded">
                ⌛ Bis: {formattedDate}
              </small>

              {isOwner && (
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1">
                  Ihr Angebot
                </span>
              )}
            </div>

            <h5 className="card-title fw-bold text-dark mb-1 text-truncate" title={item.title}>
              {item.title}
            </h5>
            <p className="card-text text-muted mb-3 text-truncate" style={{ fontSize: '0.88rem' }}>
              {item.description || 'Keine weitere Beschreibung vorhanden.'}
            </p>
          </div>

          <div>
            <hr className="my-2 opacity-10" />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <small className="text-secondary fw-semibold text-truncate" style={{ maxWidth: '130px' }}>
                👤 <span className="text-dark">{item.donor_name || item.spender || 'Anonym'}</span>
              </small>

              {/* عرض نجوم تقييم المطعم باختصار */}
              <div className="d-flex align-items-center gap-1">
                <span className="text-warning fw-bold small">
                  {donorRating && Number(donorRating) > 0 ? (
                    <>⭐ {donorRating}</>
                  ) : (
                    <span className="text-muted opacity-75" style={{ fontSize: '0.75rem' }}>
                      Neu
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* الأزرار بعد ضبط صلاحيات الأدمن والصاحب */}
            <div className="d-flex gap-2">
              {isOwner || isAdmin ? (
                <>
                  {/* زر التعديل يظهر فقط لصاحب العرض الأصلي */}
                  {isOwner && (
                    <button 
                      onClick={() => navigate(`/edit-food/${item.id}`)}
                      className="btn btn-outline-warning text-dark fw-bold py-2 rounded-3 flex-fill"
                    >
                      ✏️ Bearbeiten
                    </button>
                  )}

                  {/* زر الحذف يظهر لصاحب العرض وللأدمن أيضاً */}
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-outline-danger fw-bold py-2 rounded-3 flex-fill"
                  >
                    🗑️ Löschen
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate(`/food/${item.id}`)}
                    className="btn btn-outline-success fw-bold py-2 rounded-3 flex-fill"
                  >
                    🔍 Details
                  </button>

                  <button 
                    onClick={handleReserve} 
                    className="btn btn-success fw-bold py-2 rounded-3 flex-fill"
                  >
                    Reservieren
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FoodCard;