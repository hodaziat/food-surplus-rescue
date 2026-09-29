import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    expiration_date: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // جلب بيانات الوجبة الحالية لملء النموذج بها
  useEffect(() => {
    API.get('/food')
      .then((res) => {
        const food = res.data.find((item) => String(item.id) === String(id));
        if (food) {
          setFormData({
            title: food.title || '',
            description: food.description || '',
            quantity: food.quantity || '',
            expiration_date: food.expiration_date ? food.expiration_date.split('T')[0] : ''
          });
          if (food.image_url) {
            setImagePreview(`http://localhost:5000${food.image_url}`);
          }
        } else {
          setError('Angebot nicht gefunden.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Fehler beim Laden der Daten.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('quantity', formData.quantity);
    data.append('expiration_date', formData.expiration_date);
    data.append('description', formData.description);

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await API.put(`/food/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Angebot erfolgreich aktualisiert!');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Fehler beim Aktualisieren.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '90vh', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h3 className="fw-bold text-dark mb-3 text-center">✏️ Angebot bearbeiten</h3>

              {error && <div className="alert alert-danger rounded-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Titel</label>
                  <input
                    type="text"
                    className="form-control py-2 rounded-3"
                    value={formData.title}
                    required
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">📷 Foto (Optional)</label>
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
                        style={{ maxHeight: '150px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Menge</label>
                  <input
                    type="text"
                    className="form-control py-2 rounded-3"
                    value={formData.quantity}
                    required
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Ablaufdatum</label>
                  <input
                    type="date"
                    className="form-control py-2 rounded-3"
                    value={formData.expiration_date}
                    required
                    onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Beschreibung</label>
                  <textarea
                    className="form-control rounded-3"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="button" onClick={() => navigate('/')} className="btn btn-outline-secondary w-50 fw-bold rounded-3">
                    Abbrechen
                  </button>
                  <button type="submit" className="btn btn-success w-50 fw-bold rounded-3">
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFood;