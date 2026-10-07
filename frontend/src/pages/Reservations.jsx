import React from 'react';
import { downloadReservationPDF } from '../utils/pdfGenerator';
import CheckoutModal from '../components/CheckoutModal';
import CartItemCard from '../components/reservations/CartItemCard';
import OrderCard from '../components/reservations/OrderCard';
import { useReservations } from '../hooks/useReservations';

const Reservations = () => {
  const {
    loading,
    isUpdating,
    activeTab,
    setActiveTab,
    showCheckoutModal,
    setShowCheckoutModal,
    selectedPayment,
    setSelectedPayment,
    isProcessing,
    latestReceipt,
    setLatestReceipt,
    selectedDonation,
    setSelectedDonation,
    user,
    cartItems,
    confirmedOrders,
    groupedCartItems,
    originalTotalPrice,
    finalTotalPrice,
    hasWelcomeCoupon,
    handleIncrease,
    handleDecrease,
    handleDeleteAllOfItem,
    handleApplyWelcomeCoupon,
    handleCheckout
  } = useReservations();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">Reservierungen werden geladen...</p>
      </div>
    );
  }

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
                  {groupedCartItems.map((item) => (
                    <CartItemCard 
                      key={item.food_id}
                      item={item}
                      isUpdating={isUpdating}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                      onDeleteAll={handleDeleteAllOfItem}
                    />
                  ))}
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
                    <button 
                      type="button" 
                      className="btn btn-sm btn-success w-100 fw-bold rounded-3"
                      onClick={handleApplyWelcomeCoupon}
                    >
                      Gutschein anwenden (-5,00 €)
                    </button>
                  </div>
                )}

                <div className="card border-0 shadow-sm rounded-4 p-4">
                  <h5 className="fw-bold text-dark mb-3">Zusammenfassung</h5>
                  
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
              <div className="fs-1 mb-2">🛍</div>
              <h5 className="fw-bold text-secondary">Keine vergangenen Bestellungen vorhanden.</h5>
              <p className="text-muted">Ihre bestätigten Käufe werden hier angezeigt.</p>
            </div>
          ) : (
            <div className="row g-3">
              {confirmedOrders.map((order) => (
                <OrderCard 
                  key={order.reservation_id || order.id}
                  order={order}
                  onDownloadPDF={(ord, orderTotal, donationVal) => downloadReservationPDF({
                    id: ord.reservation_id || ord.id,
                    foodTitle: ord.title,
                    quantity: 1,
                    totalPrice: orderTotal,
                    totalDonation: donationVal,
                    paymentMethod: ord.payment_method || 'Online'
                  })}
                />
              ))}
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