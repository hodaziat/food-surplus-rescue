import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { downloadReservationPDF } from '../utils/pdfGenerator';
import CheckoutModal from '../components/CheckoutModal';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Barzahlung');
  const [isProcessing, setIsProcessing] = useState(false);
  const [latestReceipt, setLatestReceipt] = useState(null);

  // حالات الكوبون والخصم
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (parseErr) {
    console.error('Error parsing stored user:', parseErr);
  }

  const fetchReservations = useCallback(async () => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get(`/reservations/user/${user.id}`);
      setReservations(res.data || []);
    } catch (err) {
      console.error('Fehler beim Laden der Reservierungen:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const groupedReservations = Object.values(
    reservations.reduce((acc, item) => {
      const fId = item.food_id;
      if (!acc[fId]) {
        acc[fId] = {
          ...item,
          cartQuantity: 1,
          reservationIds: [item.reservation_id || item.id]
        };
      } else {
        acc[fId].cartQuantity += 1;
        acc[fId].reservationIds.push(item.reservation_id || item.id);
      }
      return acc;
    }, {})
  );

  const handleIncrease = async (item) => {
    try {
      const foodRes = await API.get('/food');
      const currentFood = foodRes.data.find((f) => String(f.id) === String(item.food_id));
      const availableQty = currentFood ? parseInt(String(currentFood.quantity).replace(/\D/g, ''), 10) : 0;

      if (availableQty <= 0) {
        alert('Leider sind keine weiteren Portionen dieses Angebots verfügbar.');
        return;
      }

      await API.post('/reservations/add', {
        food_id: item.food_id,
        receiver_id: user.id,
        requested_quantity: 1
      });

      fetchReservations();
      window.dispatchEvent(new Event('updateCart'));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Fehler beim Hinzufügen der Portion.');
    }
  };

  const handleDecrease = async (item) => {
    const resIdToDelete = item.reservationIds[item.reservationIds.length - 1];

    try {
      await API.delete(`/reservations/${resIdToDelete}`);
      fetchReservations();
      window.dispatchEvent(new Event('updateCart'));
    } catch (err) {
      console.error(err);
      alert('Fehler beim Verringern der Menge.');
    }
  };

  const handleDeleteAllOfItem = async (item) => {
    if (window.confirm('Möchten Sie diese Position komplett entfernen?')) {
      try {
        await Promise.all(item.reservationIds.map((resId) => API.delete(`/reservations/${resId}`)));
        fetchReservations();
        window.dispatchEvent(new Event('updateCart'));
      } catch (err) {
        console.error(err);
        alert('Fehler beim Entfernen.');
      }
    }
  };

  // حساب السعر الأصلي والمجموع بعد الخصم
  const originalTotalPrice = reservations.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
  const finalTotalPrice = Math.max(0, originalTotalPrice - appliedDiscount);

  // دالة تطبيق الكوبون الترحيبي
  const handleApplyWelcomeCoupon = () => {
    const DISCOUNT_AMOUNT = 5.0; // قيمة الخصم (5 يورو)
    setAppliedDiscount(DISCOUNT_AMOUNT);
    setIsCouponApplied(true);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    const firstItem = reservations[0];
    const receiptData = {
      id: firstItem ? (firstItem.reservation_id || firstItem.id) : '123',
      foodTitle: firstItem ? (firstItem.title || 'Lebensmittel-Paket') : 'Lebensmittel-Paket',
      quantity: reservations.length,
      totalPrice: finalTotalPrice,
      paymentMethod: selectedPayment
    };

    try {
      // 1. معالجة الحجوزات وإتمام الشراء
      await Promise.all(
        reservations.map((item) =>
          API.put(`/reservations/checkout/${item.reservation_id || item.id}`, {
            payment_method: selectedPayment,
            payment_status: selectedPayment === 'Barzahlung' ? 'Pending' : 'Paid',
            status: 'confirmed'
          }).catch((err) => console.log('Single checkout note:', err))
        )
      );

      // 2. إذا تم استخدام الكوبون، نحدث حالة الكوبون إلى "مستخدم"
      if (isCouponApplied && user?.id) {
        try {
          await API.put(`/auth/profile/${user.id}`, {
            name: user.name,
            email: user.email,
            is_coupon_used: true
          });

          // تحديث بيانات المستخدم في LocalStorage ليتعرف النظام على أن الكوبون استُهلك
          const updatedUser = { ...user, is_coupon_used: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (couponErr) {
          console.error('Fehler beim Aktualisieren des Gutscheinstatus:', couponErr);
        }
      }

    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLatestReceipt(receiptData);
      setShowCheckoutModal(false);
      setReservations([]);
      setIsProcessing(false);
      setAppliedDiscount(0);
      setIsCouponApplied(false);
      
      // تحديث شريط الملاحة وحذف العناصر من السلة مباشرة
      window.dispatchEvent(new Event('updateCart'));
      fetchReservations();
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">Warenkorb wird geladen...</p>
      </div>
    );
  }

  // تحقق مما إذا كان الكوبون الترحيبي متاحاً وغير مستخدم بعد
  const hasWelcomeCoupon = user && user.welcome_coupon && !user.is_coupon_used;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success m-0">🛒 Mein Warenkorb</h2>
        <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">
          {reservations.length} Artikel insgesamt
        </span>
      </div>

      {latestReceipt ? (
        <div className="card border-0 shadow-sm p-5 text-center rounded-4 bg-light">
          <div className="fs-1 mb-2">🎉</div>
          <h4 className="fw-bold text-success mb-3">Kauf erfolgreich abgeschlossen!</h4>
          <p className="text-muted mb-4">Vielen Dank, dass Sie Lebensmittel retten. Sie können Ihren offiziellen Beleg jetzt herunterladen.</p>
          
          <div className="d-flex justify-content-center gap-3">
            <button 
              className="btn btn-success btn-lg px-4 py-2 shadow-sm fw-bold"
              onClick={() => downloadReservationPDF(latestReceipt)}
            >
              📄 PDF Beleg herunterladen
            </button>
            <button 
              className="btn btn-outline-secondary btn-lg px-4 py-2 fw-bold"
              onClick={() => setLatestReceipt(null)}
            >
              Weiter einkaufen
            </button>
          </div>
        </div>
      ) : groupedReservations.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center rounded-4">
          <div className="fs-1 mb-2">📜</div>
          <h5 className="fw-bold text-secondary">Ihr Warenkorb ist leer.</h5>
          <p className="text-muted">Besuchen Sie die Startseite, um verfügbare Angebote zu entdecken.</p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="row g-3">
              {groupedReservations.map((item) => {
                const singlePrice = parseFloat(item.price || 0);
                const itemTotalPrice = singlePrice * item.cartQuantity;

                return (
                  <div key={item.food_id} className="col-md-12">
                    <div className="card border-0 shadow-sm rounded-4 p-3">
                      <div className="card-body p-0 d-flex flex-row align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={item.image_url ? `http://localhost:5000${item.image_url}` : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80'} 
                            alt={item.title} 
                            className="rounded-3" 
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          />
                          <div>
                            <h5 className="fw-bold text-dark mb-1">{item.title}</h5>
                            <div className="text-success fw-bold fs-6">
                              {singlePrice === 0 ? 'GRATIS' : `${singlePrice.toFixed(2)} € (Gesamt: ${itemTotalPrice.toFixed(2)} €)`}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex align-items-center border rounded-3 p-1 bg-light">
                            <button type="button" className="btn btn-light btn-sm fw-bold px-2 py-0 border-0" onClick={() => handleDecrease(item)}>➖</button>
                            <span className="fw-bold px-3 text-dark">{item.cartQuantity}</span>
                            <button type="button" className="btn btn-light btn-sm fw-bold px-2 py-0 border-0" onClick={() => handleIncrease(item)}>➕</button>
                          </div>
                          <button type="button" className="btn btn-outline-danger btn-sm rounded-3 px-2" onClick={() => handleDeleteAllOfItem(item)}>🗑</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-lg-4">
            {/* بطاقة عرض وتطبيق الكوبون للزبون الجديد فقط */}
            {hasWelcomeCoupon && (
              <div className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-success bg-opacity-10 border-success">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-success small">🎁 Willkommens-Gutschein!</span>
                  <span className="badge bg-success">{user.welcome_coupon}</span>
                </div>
                <p className="text-muted small mb-2">Erhalten Sie 5,00 € Rabatt auf Ihre erste Bestellung.</p>
                {!isCouponApplied ? (
                  <button 
                    type="button" 
                    className="btn btn-sm btn-success w-100 fw-bold rounded-3"
                    onClick={handleApplyWelcomeCoupon}
                  >
                    Gutschein anwenden (-5,00 €)
                  </button>
                ) : (
                  <div className="alert alert-success py-1 px-2 mb-0 small text-center fw-bold">
                    ✓ Gutschein angewendet!
                  </div>
                )}
              </div>
            )}

            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold text-dark mb-3">Zusammenfassung</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Anzahl Positionen:</span>
                <span className="fw-semibold">{groupedReservations.length}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Gesamtstückzahl:</span>
                <span className="fw-semibold">{reservations.length} Stk.</span>
              </div>
              
              {isCouponApplied && (
                <div className="d-flex justify-content-between mb-2 text-success fw-bold">
                  <span>Willkommens-Rabatt:</span>
                  <span>- {appliedDiscount.toFixed(2)} €</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-3 fs-5 fw-bold">
                <span>Gesamtsumme:</span>
                <span className="text-success">{finalTotalPrice === 0 ? 'Kostenlos' : `${finalTotalPrice.toFixed(2)} €`}</span>
              </div>
              <hr className="my-3 opacity-10" />
              <button type="button" className="btn btn-success w-100 fw-bold py-3 rounded-3 shadow-sm" onClick={() => setShowCheckoutModal(true)}>
                💳 Kauf abschließen
              </button>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal 
        show={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={handleCheckout}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
        totalPrice={finalTotalPrice}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default Reservations;