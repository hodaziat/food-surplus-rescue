import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddFood = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    expiration_date: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      setError('Bitte melden Sie sich zuerst an, um ein Angebot zu erstellen.');
      return;
    }

    try {
      await API.post('/food/add', {
        ...formData,
        donor_id: user.id
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Fehler beim Hinzufügen des Lebensmittels.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '90vh', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h3 className="fw-bold text-dark mb-3 text-center">🍲 Lebensmittel anbieten</h3>
              <p className="text-muted text-center mb-4">Teilen Sie überschüssige Lebensmittel mit Ihrer Gemeinschaft.</p>
              
              {error && <div className="alert alert-danger rounded-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Titel / Name des Lebensmittels</label>
                  <input
                    type="text"
                    className="form-control py-2 rounded-3"
                    placeholder="z.B. Frisch gebackenes Brot"
                    required
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Menge</label>
                  <input
                    type="text"
                    className="form-control py-2 rounded-3"
                    placeholder="z.B. 3 Portionen, 2 kg"
                    required
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Ablaufdatum / Abholfrist</label>
                  <input
                    type="datetime-local"
                    className="form-control py-2 rounded-3"
                    required
                    onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Beschreibung (Optional)</label>
                  <textarea
                    className="form-control rounded-3"
                    rows="3"
                    placeholder="Zusätzliche Infos wie Abholort oder Allergene..."
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-success w-100 fw-bold py-2 rounded-3 shadow-sm">
                  Angebot veröffentlichen
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;