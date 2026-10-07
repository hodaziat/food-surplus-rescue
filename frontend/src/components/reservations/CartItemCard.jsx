import React from 'react';

const CartItemCard = ({ item, isUpdating, onIncrease, onDecrease, onDeleteAll }) => {
  const singlePrice = parseFloat(item.price || 0);
  const itemTotalPrice = singlePrice * item.cartQuantity;
  const isMaxReached = item.maxAvailable !== undefined && item.cartQuantity >= item.maxAvailable;

  return (
    <div className="col-md-12">
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
              {isMaxReached && (
                <small className="text-danger fw-bold d-block mt-1">
                  ⚠️ Alle verfügbaren Portionen reserviert ({item.maxAvailable} Stk.)
                </small>
              )}
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center border rounded-3 p-1 bg-light">
              <button 
                type="button" 
                disabled={isUpdating}
                className="btn btn-light btn-sm fw-bold px-2 py-0 border-0" 
                onClick={() => onDecrease(item)}
              >
                ➖
              </button>
              <span className="fw-bold px-3 text-dark">{item.cartQuantity}</span>
              <button 
                type="button" 
                disabled={isUpdating || isMaxReached}
                className="btn btn-light btn-sm fw-bold px-2 py-0 border-0" 
                onClick={() => onIncrease(item)}
                title={isMaxReached ? "Keine weiteren Portionen verfügbar" : "Portion hinzufügen"}
              >
                ➕
              </button>
            </div>
            <button 
              type="button" 
              disabled={isUpdating}
              className="btn btn-outline-danger btn-sm rounded-3 px-2" 
              onClick={() => onDeleteAll(item)}
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;