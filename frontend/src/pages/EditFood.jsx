import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    quantity: '',
    expiration_date: '',
    image_url: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // المحاولة على المسار الأول /food/id وفي حال الفشل يجرّب /foods/id تلقائياً
    API.get(`/food/${id}`)
      .catch(() => API.get(`/foods/${id}`))
      .then((res) => {
        if (!res || !res.data) throw new Error('No data');
        const item = res.data;
        const expDate = item.expiration_date || item.expiry_date 
          ? new Date(item.expiration_date || item.expiry_date).toISOString().split('T')[0] 
          : '';

        setFormData({
          title: item.title || '',
          description: item.description || '',
          price: item.price !== undefined ? item.price : '',
          original_price: item.original_price !== undefined ? item.original_price : '',
          quantity: item.quantity || item.available_quantity || '',
          expiration_date: expDate,
          image_url: item.image_url || ''
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fehler beim Laden des Angebots:', err);
        alert('Fehler beim Laden der Daten.');
        navigate('/');
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // إرسال التحديث لـ /food/id أولاً أو /foods/id
      const payload = {
        ...formData,
        price: parseFloat(formData.price || 0),
        original_price: parseFloat(formData.original_price || 0),
        quantity: parseInt(formData.quantity, 10)
      };

      await API.put(`/food/${id}`, payload).catch(() => API.put(`/foods/${id}`, payload));

      alert('Angebot erfolgreich aktualisiert! 🎉');
      navigate('/');
    } catch (err) {
      console.error('Update failed:', err);
      alert(err.response?.data?.message || 'Fehler beim Aktualisieren.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">Daten werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: '700px' }}>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h3 className="fw-bold text-success mb-4">✏️ Angebot bearbeiten</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Titel / Name des Essens</label>
            <input
              type="text"
              className="form-control rounded-3"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold text-success">Angebotspreis (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control rounded-3"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00 für GRATIS"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold text-muted">Originalpreis (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control rounded-3"
                name="original_price"
                value={formData.original_price}
                onChange={handleChange}
                placeholder="z.B. 8.50"
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Anzahl / Portionen</label>
              <input
                type="number"
                min="1"
                className="form-control rounded-3"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Haltbar bis (Ablaufdatum)</label>
              <input
                type="date"
                className="form-control rounded-3"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Beschreibung & Hinweise</label>
            <textarea
              className="form-control rounded-3"
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-50 fw-bold py-2 rounded-3"
              onClick={() => navigate('/')}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-success w-50 fw-bold py-2 rounded-3"
            >
              {submitting ? 'Speichern...' : 'Speichern & Übernehmen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFood;