import React, { useState } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";

const CheckoutPage = () => {
  const [paidSuccess, setPaidSuccess] = useState(false);

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white text-center">
        <h3 className="fw-bold mb-3 text-success">💳 Spende & Zahlung</h3>
        <p className="text-muted mb-4">Unterstützen Sie unsere Mission in Erlangen sicher über PayPal.</p>

        {paidSuccess ? (
          <div className="alert alert-success rounded-4 p-4 shadow-sm">
            <h4 className="fw-bold mb-2">🎉 Vielen Dank!</h4>
            <p className="mb-0">Die Zahlung wurde erfolgreich abgeschlossen.</p>
          </div>
        ) : (
          <PayPalButtons 
            style={{ layout: "vertical", shape: "pill" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: "10.00", // القيمة الوهمية
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then((details) => {
                setPaidSuccess(true);
                alert(`Zahlung erfolgreich von ${details.payer.name.given_name}!`);
              });
            }}
            onError={(err) => {
              console.error("PayPal Error:", err);
              alert("Ein Fehler ist bei der Zahlung aufgetreten.");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;