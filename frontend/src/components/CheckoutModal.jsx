import React from 'react';

const CheckoutModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  selectedPayment, 
  setSelectedPayment, 
  totalPrice, 
  isProcessing 
}) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow p-2">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">💳 Zahlungsmethode wählen</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body py-3">
            <p className="mb-3">
              <strong>Gesamtsumme:</strong> {' '}
              <span className="fs-5 fw-bold text-success">
                {totalPrice === 0 ? 'Kostenlos (0.00 €)' : `${totalPrice.toFixed(2)} €`}
              </span>
            </p>

            <h6 className="fw-bold mb-2">Wählen Sie Ihre Zahlungsmethode:</h6>

            <div className="d-flex flex-column gap-2 mb-3">
              <div className={`border p-3 rounded-3 d-flex align-items-center justify-content-between ${selectedPayment === 'Barzahlung' ? 'border-success bg-success-subtle' : ''}`}>
                <div className="form-check m-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="barzahlung"
                    name="payment"
                    checked={selectedPayment === 'Barzahlung'}
                    onChange={() => setSelectedPayment('Barzahlung')}
                  />
                  <label className="form-check-label fw-bold" htmlFor="barzahlung">
                    💵 Barzahlung bei Abholung
                  </label>
                </div>
                <small className="text-muted">Vor Ort bezahlen</small>
              </div>

              <div className={`border p-3 rounded-3 d-flex align-items-center justify-content-between ${selectedPayment === 'PayPal' ? 'border-primary bg-primary-subtle' : ''}`}>
                <div className="form-check m-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="paypal"
                    name="payment"
                    checked={selectedPayment === 'PayPal'}
                    onChange={() => setSelectedPayment('PayPal')}
                  />
                  <label className="form-check-label fw-bold" htmlFor="paypal">
                    🟦 PayPal
                  </label>
                </div>
                <small className="text-muted">Online bezahlen</small>
              </div>

              <div className={`border p-3 rounded-3 d-flex align-items-center justify-content-between ${selectedPayment === 'Kreditkarte' ? 'border-info bg-info-subtle' : ''}`}>
                <div className="form-check m-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="kreditkarte"
                    name="payment"
                    checked={selectedPayment === 'Kreditkarte'}
                    onChange={() => setSelectedPayment('Kreditkarte')}
                  />
                  <label className="form-check-label fw-bold" htmlFor="kreditkarte">
                    💳 EC-Karte / Kreditkarte
                  </label>
                </div>
                <small className="text-muted">Visa / Mastercard</small>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-light rounded-3 fw-semibold" onClick={onClose}>
              Abbrechen
            </button>
            <button type="button" className="btn btn-success rounded-3 fw-bold px-4" onClick={onConfirm} disabled={isProcessing}>
              {isProcessing ? 'Wird verarbeitet...' : 'Kostenpflichtig bestellen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;