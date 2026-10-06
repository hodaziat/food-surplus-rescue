import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDummyPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaidSuccess(true);
    }, 1000);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white text-center">
        <h3 className="fw-bold mb-3 text-success">💳 Spende & Zahlung (Testmodus)</h3>
        <p className="text-muted mb-4">Unterstützen Sie unsere Mission in Erlangen sicher.</p>

        {paidSuccess ? (
          <div className="alert alert-success rounded-4 p-4 shadow-sm">
            <h4 className="fw-bold mb-2">🎉 Vielen Dank!</h4>
            <p className="mb-3">Die Zahlung wurde erfolgreich abgeschlossen.</p>
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-success fw-bold rounded-pill px-4"
            >
              Zurück zur Startseite
            </button>
          </div>
        ) : (
          <div>
            <div className="p-3 mb-4 bg-light rounded-3 border">
              <span className="text-secondary fw-semibold">Betrag: </span>
              <span className="fw-bold fs-5 text-dark">10.00 EUR</span>
            </div>
            
            <button
              onClick={handleDummyPayment}
              disabled={loading}
              className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm"
              style={{ fontSize: '1.1rem' }}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Wird verarbeitet...
                </span>
              ) : (
                'Mit PayPal (Test) bezahlen'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;