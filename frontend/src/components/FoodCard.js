import React from 'react';
import Rating from './Rating';

const FoodCard = ({ item, currentUser, handleDelete }) => {
  return (
    <div className="col-md-6">
      <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all overflow-hidden">
        <div className="card-body p-4 d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <span className="badge bg-success-subtle text-success fw-bold fs-6 px-3 py-2 rounded-pill">
                📦 {item.quantity}
              </span>
              
              <div className="d-flex align-items-center gap-2">
                <small className="text-danger fw-semibold bg-danger-subtle px-2 py-1 rounded">
                  ⌛ Bis: {new Date(item.expiration_date).toLocaleDateString()}
                </small>

                {currentUser && currentUser.role === 'admin' && (
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
                👤 Spender: <span className="text-dark">{item.donor_name || 'Anonym'}</span>
              </small>
              <div className="mt-1">
                <Rating initialRating={item.rating || 5} />
              </div>
            </div>
            <button className="btn btn-success w-100 fw-bold py-2 rounded-3">
              Reservieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;