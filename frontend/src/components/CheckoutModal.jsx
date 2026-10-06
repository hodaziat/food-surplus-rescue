import React, { useState } from 'react';

const CheckoutModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  selectedPayment, 
  setSelectedPayment, 
  totalPrice, 
  isProcessing 
}) => {
  const [paypalSuccess, setPaypalSuccess] = useState(false);
  const [simulating, setSimulating] = useState(false);

  if (!show) return null;

  const handleSandboxCheckout = () => {
    setSimulating(true);
    // إظهار رسالة النجاح أولاً
    setTimeout(() => {
      setSimulating(false);
      setPaypalSuccess(true);
      // الانتظار لمدة 1.5 ثانية ليراها المستخدم بوضوح ثم إتمام الطلب
      setTimeout(() => {
        setPaypalSuccess(false);
        onConfirm(); 
      }, 1500);
    }, 1000);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 p-3">
          
          <div className="modal-header border-0 pb-0">
            <h5 className="fw-bold text-dark m-0">💳 Zahlungsmethode wählen</h5>
            <button type="button" className="btn-close shadow-none" onClick={onClose} disabled={isProcessing || simulating}></button>
          </div>

          <div className="modal-body py-4">
            <div className="mb-3 text-secondary small fw-semibold">
              Gesamtsumme: <span className="text-success fs-5 fw-bold">{totalPrice === 0 ? 'Kostenlos (0.00 €)' : `${totalPrice.toFixed(2)} €`}</span>
            </div>

            <p className="text-muted small mb-3">Wählen Sie Ihre Zahlungsmethode:</p>

            {/* خيار الدفع نقداً */}
            <div className={`form-check p-3 rounded-3 mb-2 border ${selectedPayment === 'Barzahlung' ? 'border-success bg-success bg-opacity-10' : 'bg-light'}`}>
              <input 
                className="form-check-input" 
                type="radio" 
                name="paymentMethod" 
                id="barzahlung" 
                value="Barzahlung"
                checked={selectedPayment === 'Barzahlung'}
                onChange={(e) => setSelectedPayment(e.target.value)}
              />
              <label className="form-check-label w-100 d-flex justify-content-between align-items-center cursor-pointer" htmlFor="barzahlung">
                <span className="fw-bold text-dark">💵 Barzahlung bei Abholung</span>
                <span className="text-muted small">Vor Ort bezahlen</span>
              </label>
            </div>

            {/* خيار بايبال Sandbox */}
            <div className={`form-check p-3 rounded-3 mb-2 border ${selectedPayment === 'PayPal' ? 'border-success bg-success bg-opacity-10' : 'bg-light'}`}>
              <input 
                className="form-check-input" 
                type="radio" 
                name="paymentMethod" 
                id="paypal" 
                value="PayPal"
                checked={selectedPayment === 'PayPal'}
                onChange={(e) => setSelectedPayment(e.target.value)}
              />
              <label className="form-check-label w-100 d-flex justify-content-between align-items-center cursor-pointer" htmlFor="paypal">
                <span className="fw-bold text-dark">🅿️ PayPal (Sandbox)</span>
                <span className="text-muted small">Online bezahlen</span>
              </label>
            </div>

            {/* خيار البطاقة */}
            <div className={`form-check p-3 rounded-3 mb-3 border ${selectedPayment === 'Kreditkarte' ? 'border-success bg-success bg-opacity-10' : 'bg-light'}`}>
              <input 
                className="form-check-input" 
                type="radio" 
                name="paymentMethod" 
                id="kreditkarte" 
                value="Kreditkarte"
                checked={selectedPayment === 'Kreditkarte'}
                onChange={(e) => setSelectedPayment(e.target.value)}
              />
              <label className="form-check-label w-100 d-flex justify-content-between align-items-center cursor-pointer" htmlFor="kreditkarte">
                <span className="fw-bold text-dark">💳 EC-Karte / Kreditkarte</span>
                <span className="text-muted small">Visa / Mastercard</span>
              </label>
            </div>

            {/* زر بايبال مع رسالة النجاح الواظحة */}
            {selectedPayment === 'PayPal' && (
              <div className="mt-3 p-3 bg-white rounded-3 border text-center shadow-sm">
                {paypalSuccess ? (
                  <div className="alert alert-success text-center py-2 mb-0 fw-bold small">
                    🎉 Zahlung über PayPal Sandbox erfolgreich!
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn w-100 fw-bold rounded-pill py-2 shadow-sm text-white"
                    style={{ backgroundColor: '#0070ba', borderColor: '#0070ba' }}
                    onClick={handleSandboxCheckout}
                    disabled={simulating}
                  >
                    {simulating ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Verbindung mit PayPal Sandbox...
                      </span>
                    ) : (
                      '🅿️ Mit PayPal (Sandbox) bezahlen'
                    )}
                  </button>
                )}
              </div>
            )}

          </div>

          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose} disabled={isProcessing || simulating}>
              Abbrechen
            </button>
            
            {selectedPayment !== 'PayPal' && (
              <button 
                type="button" 
                className="btn btn-success rounded-pill px-4 fw-bold shadow-sm" 
                onClick={onConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? 'Wird verarbeitet...' : 'Kostenpflichtig bestellen'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;