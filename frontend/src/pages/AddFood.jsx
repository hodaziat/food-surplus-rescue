import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddFood = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    expiration_date: '',
    price: '0',
    original_price: '0'
  });
  const [isPaid, setIsPaid] = useState(false); // التحكم في نوع العرض (مجاني أو بمبلغ)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOfferTypeChange = (paid) => {
    setIsPaid(paid);
    if (!paid) {
      setFormData((prev) => ({ ...prev, price: '0', original_price: '0' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      setError('Bitte melden Sie sich zuerst an, um ein Angebot zu erstellen.');
      return;
    }

    const data = new FormData();
    data.append('donor_id', user.id);
    data.append('title', formData.title);
    data.append('quantity', formData.quantity);
    data.append('expiration_date', formData.expiration_date);
    data.append('description', formData.description);
    data.append('price', isPaid ? formData.price : '0');
    data.append('original_price', isPaid ? formData.original_price : '0');

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await API.post('/food/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
                    placeholder="z.B. Überraschungstüte Backwaren"
                    required
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* خيار تحديد نوع العرض: مجاني أم بمبلغ */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Angebotsart</label>
                  <div className="d-flex gap-3">
                    <div 
                      className={`form-check flex-fill border p-3 rounded-3 cursor-pointer ${!isPaid ? 'border-success bg-success-subtle' : ''}`}
                      onClick={() => handleOfferTypeChange(false)}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="offerType"
                        id="freeOffer"
                        checked={!isPaid}
                        onChange={() => handleOfferTypeChange(false)}
                      />
                      <label className="form-check-label fw-bold cursor-pointer" htmlFor="freeOffer">
                        🎁 Kostenlos (Gratis)
                      </label>
                    </div>

                    <div 
                      className={`form-check flex-fill border p-3 rounded-3 cursor-pointer ${isPaid ? 'border-success bg-success-subtle' : ''}`}
                      onClick={() => handleOfferTypeChange(true)}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="offerType"
                        id="paidOffer"
                        checked={isPaid}
                        onChange={() => handleOfferTypeChange(true)}
                      />
                      <label className="form-check-label fw-bold cursor-pointer" htmlFor="paidOffer">
                        🏷️ Vergünstigter Preis
                      </label>
                    </div>
                  </div>
                </div>

                {/* حقول السعر والسعر الأصلي تظهر عند اختيار "Vergünstigter Preis" */}
                {isPaid && (
                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Verkaufspreis (€)</label>
                      <input
                        type="number"
                        step="0.50"
                        min="0.50"
                        className="form-control py-2 rounded-3"
                        placeholder="z.B. 3.50"
                        value={formData.price}
                        required={isPaid}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">Originalpreis (€)</label>
                      <input
                        type="number"
                        step="0.50"
                        min="0.50"
                        className="form-control py-2 rounded-3"
                        placeholder="z.B. 10.00"
                        value={formData.original_price}
                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* حقل اختيار الصورة مع المعاينة */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">📷 Foto des Angebots (Optional)</label>
                  <input
                    type="file"
                    className="form-control py-2 rounded-3"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-2 text-center">
                      <img 
                        src={imagePreview} 
                        alt="Vorschau" 
                        className="img-fluid rounded-3 shadow-sm" 
                        style={{ maxHeight: '160px', objectFit: 'cover' }} 
                      />
                    </div>
                  )}
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