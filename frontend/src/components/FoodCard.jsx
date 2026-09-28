import React from 'react';
import Rating from './Rating';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const FoodCard = ({ item, currentUser, handleDelete, onReserveSuccess }) => {
  // قراءة بيانات المستخدم الحالي من localStorage في حال عدم إرساله كـ Prop
  const storedUser = localStorage.getItem('user');
  const user = currentUser || (storedUser ? JSON.parse(storedUser) : null);
  const navigate = useNavigate();

  // التحقق هل المستخدم الحالي هو صاحب الوجبة (المتبرع)
  const isOwner = user && (
    user.id === item.donor_id || 
    user.name === item.donor_name || 
    user.name === item.spender
  );

  // دالة التعامل مع الحجز
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
      alert('Reservierung erfolgreich!');

      // إطلاق حدث لتحديث عداد السلة في الـ Navbar فوراً بدون إعادة تحميل الصفحة
      window.dispatchEvent(new Event('updateCart'));

      if (onReserveSuccess) {
        onReserveSuccess();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Fehler bei der Reservierung.');
    }
  };

  // تنسيق التاريخ بشكل آمن
  const formattedDate = item.expiration_date || item.expiry_date
    ? new Date(item.expiration_date || item.expiry_date).toLocaleDateString('de-DE')
    : 'k.A.';

  return (
    <div className="col-md-6 mb-4">
      <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all overflow-hidden">
        <div className="card-body p-4 d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <span className="badge bg-success-subtle text-success fw-bold fs-6 px-3 py-2 rounded-pill">
                📦 {item.quantity}
              </span>
              
              <div className="d-flex align-items-center gap-2">
                <small className="text-danger fw-semibold bg-danger-subtle px-2 py-1 rounded">
                  ⌛ Bis: {formattedDate}
                </small>

                {user && user.role === 'admin' && (
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-outline-danger btn-sm border-0 py-0 px-1"
                    title="Angebot löschen (Admin)"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
            <h4 className="card-title fw-bold text-dark mb-2">{item.title}</h4>
            <p className="card-text text-muted mb-3" style={{ fontSize: '0.95rem' }}>
              {item.description || 'Keine weitere Beschreibung vorhanden.'}
            </p>
          </div>

          <div>
            <hr className="my-3 opacity-10" />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <small className="text-secondary fw-semibold">
                👤 Spender: <span className="text-dark">{item.donor_name || item.spender || 'Anonym'}</span>
              </small>
              <div className="mt-1">
                <Rating initialRating={item.rating || 5} />
              </div>
            </div>

            {/* الأزرار: زر التفاصيل + زر الحجز */}
            <div className="d-flex gap-2">
              <button 
                onClick={() => navigate(`/food/${item.id}`)}
                className="btn btn-outline-success fw-bold py-2 rounded-3 flex-fill"
              >
                🔍 Details
              </button>

              {isOwner ? (
                <button className="btn btn-secondary fw-bold py-2 rounded-3 flex-fill" disabled>
                  Ihr Angebot
                </button>
              ) : (
                <button 
                  onClick={handleReserve} 
                  className="btn btn-success fw-bold py-2 rounded-3 flex-fill"
                >
                  Reservieren
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;