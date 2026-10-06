import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { downloadReservationPDF } from '../utils/pdfGenerator';
import CheckoutModal from '../components/CheckoutModal';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('cart');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Barzahlung');
  const [isProcessing, setIsProcessing] = useState(false);
  const [latestReceipt, setLatestReceipt] = useState(null);

  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(0); // حالة اختيار التبرع من السلة

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

  const cartItems = reservations.filter((item) => item.status === 'pending' || !item.status);
  const confirmedOrders = reservations.filter((item) => item.status === 'confirmed');

  const groupedCartItems = Object.values(
    cartItems.reduce((acc, item) => {
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
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      await API.post('/reservations/add', {
        food_id: item.food_id,
        receiver_id: user.id
      });

      await fetchReservations();
      window.dispatchEvent(new Event('updateCart'));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Leider sind keine weiteren Portionen verfügbar.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async (item) => {
    if (isUpdating || !item.reservationIds || item.reservationIds.length === 0) return;
    setIsUpdating(true);

    const resIdToDelete = item.reservationIds[item.reservationIds.length - 1];

    try {
      await API.delete(`/reservations/${resIdToDelete}`);
      await fetchReservations();
      window.dispatchEvent(new Event('updateCart'));
    } catch (err) {
      console.error(err);
      alert('Fehler beim Verringern der Menge.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAllOfItem = async (item) => {
    if (isUpdating) return;
    if (window.confirm('Möchten Sie diese Position komplett entfernen?')) {
      setIsUpdating(true);
      try {
        for (const resId of item.reservationIds) {
          await API.delete(`/reservations/${resId}`);
        }
        await fetchReservations();
        window.dispatchEvent(new Event('updateCart'));
      } catch (err) {
        console.error(err);
        alert('Fehler beim Entfernen.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const originalTotalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
  const subTotal = originalTotalPrice + selectedDonation;
  const finalTotalPrice = Math.max(0, subTotal - appliedDiscount);

  const handleApplyWelcomeCoupon = () => {
    setAppliedDiscount(5.0);
    setIsCouponApplied(true);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    const firstItem = cartItems[0];
    const receiptData = {
      id: firstItem ? (firstItem.reservation_id || firstItem.id) : '123',
      foodTitle: firstItem ? (firstItem.title || 'Lebensmittel-Paket') : 'Lebensmittel-Paket',
      quantity: cartItems.length,
      totalPrice: finalTotalPrice,
      totalDonation: selectedDonation,
      paymentMethod: selectedPayment
    };

    try {
      await Promise.all(
        cartItems.map((item) =>
          API.put(`/reservations/checkout/${item.reservation_id || item.id}`, {
            payment_method: selectedPayment,
            payment_status: selectedPayment === 'Barzahlung' ? 'Pending' : 'Paid',
            status: 'confirmed',
            donation_amount: selectedDonation // إرسال التبرع المختار
          }).catch((err) => console.log('Checkout single note:', err))
        )
      );

      if (isCouponApplied && user?.id) {
        try {
          await API.put(`/auth/profile/${user.id}`, {
            name: user.name,
            email: user.email,
            is_coupon_used: true
          });

          const updatedUser = { ...user, is_coupon_used: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (couponErr) {
          console.error('Coupon Error:', couponErr);
        }
      }

    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLatestReceipt(receiptData);
      setShowCheckoutModal(false);
      setIsProcessing(false);
      setAppliedDiscount(0);
      setIsCouponApplied(false);
      setSelectedDonation(0);
      setActiveTab('orders');
      
      window.dispatchEvent(new Event('updateCart'));
      fetchReservations();
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">Reservierungen werden geladen...</p>
      </div>
    );
  }

  const hasWelcomeCoupon = user && user.welcome_coupon && !user.is_coupon_used;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success m-0">📋 Meine Reservierungen & Bestellungen</h2>
      </div>

      <div className="d-flex gap-2 border-bottom pb-3 mb-4">
        <button 
          type="button"
          className={`btn fw-bold px-4 py-2 rounded-3 shadow-sm ${
            activeTab === 'cart' 
              ? 'btn-success text-white' 
              : 'btn-outline-secondary bg-white text-dark'
          }`}
          onClick={() => setActiveTab('cart')}
        >
          🛒 Warenkorb ({cartItems.length})
        </button>

        <button 
          type="button"
          className={`btn fw-bold px-4 py-2 rounded-3 shadow-sm ${
            activeTab === 'orders' 
              ? 'btn-success text-white' 
              : 'btn-outline-secondary bg-white text-dark'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          🛍️ Meine Bestellungen ({confirmedOrders.length})
        </button>
      </div>

      {activeTab === 'cart' && (
        <>
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
                  onClick={() => { setLatestReceipt(null); setActiveTab('orders'); }}
                >
                  Zu meinen Bestellungen
                </button>
              </div>
            </div>
          ) : groupedCartItems.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 text-center rounded-4">
              <div className="fs-1 mb-2">📜</div>
              <h5 className="fw-bold text-secondary">Ihr Warenkorb ist leer.</h5>
              <p className="text-muted">Besuchen Sie die Startseite, um verfügbare Angebote zu entdecken.</p>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="row g-3">
                  {groupedCartItems.map((item) => {
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
                                <button 
                                  type="button" 
                                  disabled={isUpdating}
                                  className="btn btn-light btn-sm fw-bold px-2 py-0 border-0" 
                                  onClick={() => handleDecrease(item)}
                                >
                                  ➖
                                </button>
                                <span className="fw-bold px-3 text-dark">{item.cartQuantity}</span>
                                <button 
                                  type="button" 
                                  disabled={isUpdating}
                                  className="btn btn-light btn-sm fw-bold px-2 py-0 border-0" 
                                  onClick={() => handleIncrease(item)}
                                >
                                  ➕
                                </button>
                              </div>
                              <button 
                                type="button" 
                                disabled={isUpdating}
                                className="btn btn-outline-danger btn-sm rounded-3 px-2" 
                                onClick={() => handleDeleteAllOfItem(item)}
                              >
                                🗑
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-lg-4">
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
                  
                  {/* قائمة منسدلة لاختيار التبرع مباشرة من السلة */}
                  <div className="mb-3">
                    <label className="fw-semibold text-dark small mb-1">❤️ Spende für soziale Projekte:</label>
                    <select 
                      className="form-select form-select-sm rounded-3 shadow-sm"
                      value={selectedDonation}
                      onChange={(e) => setSelectedDonation(parseFloat(e.target.value))}
                    >
                      <option value={0}>Keine Spende (0,00 €)</option>
                      <option value={1}>1,00 € Spende</option>
                      <option value={2}>2,00 € Spende</option>
                      <option value={5}>5,00 € Spende</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Speisen-Wert:</span>
                    <span className="fw-semibold">{originalTotalPrice.toFixed(2)} €</span>
                  </div>

                  {selectedDonation > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Spende:</span>
                      <span className="fw-semibold">+ {selectedDonation.toFixed(2)} €</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Gesamtstückzahl:</span>
                    <span className="fw-semibold">{cartItems.length} Stk.</span>
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
        </>
      )}

      {activeTab === 'orders' && (
        <div>
          {confirmedOrders.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 text-center rounded-4">
              <div className="fs-1 mb-2">🛍️</div>
              <h5 className="fw-bold text-secondary">Keine vergangenen Bestellungen vorhanden.</h5>
              <p className="text-muted">Ihre bestätigten Käufe werden hier angezeigt.</p>
            </div>
          ) : (
            <div className="row g-3">
              {confirmedOrders.map((order) => {
                const isExpired = new Date(order.expiration_date) < new Date();
                const itemPrice = parseFloat(order.price || 0);
                const donationVal = parseFloat(order.donation_amount || 0);
                const orderTotal = itemPrice + donationVal;

                return (
                  <div key={order.reservation_id || order.id} className="col-md-12">
                    <div className="card border-0 shadow-sm rounded-4 p-3">
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={order.image_url ? `http://localhost:5000${order.image_url}` : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80'} 
                            alt={order.title} 
                            className="rounded-3" 
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          />
                          <div>
                            <h5 className="fw-bold text-dark mb-1">{order.title}</h5>
                            <div className="text-muted small mb-1">
                              Zahlungsmethode: <strong>{order.payment_method || 'Online'}</strong>
                            </div>
                            <div className="text-success fw-bold">
                              {orderTotal.toFixed(2)} € {donationVal > 0 && <span className="text-muted small fw-normal">(inkl. {donationVal.toFixed(2)} € Spende)</span>}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex flex-column align-items-end gap-2">
                          {!isExpired ? (
                            <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill shadow-sm">
                              🛍 Bereit zur Abholung (Bezahlt)
                            </span>
                          ) : (
                            <span className="badge bg-secondary fs-6 px-3 py-2 rounded-pill">
                              ✅ Abgeholt / Abgeschlossen
                            </span>
                          )}

                          <button 
                            className="btn btn-sm btn-outline-success rounded-3 fw-bold mt-1"
                            onClick={() => downloadReservationPDF({
                              id: order.reservation_id || order.id,
                              foodTitle: order.title,
                              quantity: 1,
                              totalPrice: orderTotal,
                              totalDonation: donationVal,
                              paymentMethod: order.payment_method || 'Online'
                            })}
                          >
                            📄 Beleg herunterladen
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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