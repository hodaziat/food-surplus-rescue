import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Navbar = () => {
  const [reservationCount, setReservationCount] = useState(0);

  // دالة جلب عدد عناصر السلة (الطلبات غير المدفوعة/المعلقة فقط)
  const fetchReservationCount = useCallback(async () => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.id) {
      setReservationCount(0);
      return;
    }

    try {
      const res = await API.get(`/reservations/user/${user.id}`);
      if (Array.isArray(res.data)) {
        // تصفية العناصر لحساب السلة فقط (status === 'pending') واستثناء المشتريات التأكيدية
        const pendingCartItems = res.data.filter(
          (item) => item.status === 'pending' || !item.status
        );
        setReservationCount(pendingCartItems.length);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Reservierungsanzahl:', err);
    }
  }, []);

  useEffect(() => {
    fetchReservationCount();

    const handleCartUpdate = () => {
      fetchReservationCount();
    };

    // الاستماع لحدث نافذة المتصفح المباشر
    window.addEventListener('updateCart', handleCartUpdate);

    // الاستماع لقناة BroadcastChannel المباشرة
    let channel;
    try {
      channel = new BroadcastChannel('cart_channel');
      channel.onmessage = () => {
        fetchReservationCount();
      };
    } catch (e) {
      console.log(e);
    }

    return () => {
      window.removeEventListener('updateCart', handleCartUpdate);
      if (channel) channel.close();
    };
  }, [fetchReservationCount]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        
        {/* Logo / Brand */}
        <Link className="navbar-brand fw-bold text-success d-flex align-items-center gap-2" to="/">
          🌱 Food Surplus Rescue Erlangen
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">Startseite</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/services">Dienstleistungen</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-success" to="/special-request">
                🤝 Sonderanfragen
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/about">Über uns</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/contact">Kontakt</Link>
            </li>
          </ul>

          {/* Right Side Actions */}
          <div className="d-flex align-items-center gap-3">
            
            {user ? (
              <>
                {user.role === 'donor' && (
                  <Link to="/add-listing" className="btn btn-success btn-sm fw-semibold">
                    ➕ Angebot erstellen
                  </Link>
                )}

                {user.role === 'user' && (
                  <Link to="/reservations" className="btn btn-outline-success btn-sm position-relative">
                    🛒 Reservierungen
                    {reservationCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {reservationCount}
                      </span>
                    )}
                  </Link>
                )}

                <span className="text-muted small fw-semibold">Hallo, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-dark btn-sm">
                  Anmelden
                </Link>
                <Link to="/register" className="btn btn-success btn-sm">
                  Registrieren
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;