import React from 'react';

const OrderCard = ({ order, onDownloadPDF }) => {
  const isExpired = new Date(order.expiration_date) < new Date();
  const itemPrice = parseFloat(order.price || 0);
  const donationVal = parseFloat(order.donation_amount || 0);
  const orderTotal = itemPrice + donationVal;

  return (
    <div className="col-md-12">
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
              onClick={() => onDownloadPDF(order, orderTotal, donationVal)}
            >
              📄 Beleg herunterladen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;