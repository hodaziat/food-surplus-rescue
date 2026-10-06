import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Navbar = () => {
  const [reservationCount, setReservationCount] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isDonor = user && (user.role === 'donor' || user.user_role === 'donor');

  const fetchReservationCount = useCallback(async () => {
    if (!user || !user.id || isDonor) {
      setReservationCount(0);
      return;
    }

    try {
      const res = await API.get(`/reservations/user/${user.id}`);
      if (Array.isArray(res.data)) {
        const pendingCartItems = res.data.filter(
          (item) => item.status === 'pending' || !item.status
        );
        setReservationCount(pendingCartItems.length);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Reservierungsanzahl:', err);
    }
  }, [user, isDonor]);

  useEffect(() => {
    fetchReservationCount();

    const handleCartUpdate = () => {
      fetchReservationCount();
    };

    window.addEventListener('updateCart', handleCartUpdate);

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

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        
        {/* Logo / Brand */}
        <Link className="navbar-brand fw-bold text-success d-flex align-items-center gap-2" to="/" onClick={closeNav}>
          🌱 Food Surplus Rescue Erlangen
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/" onClick={closeNav}>Startseite</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/services" onClick={closeNav}>Dienstleistungen</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-success" to="/special-request" onClick={closeNav}>
                🤝 Sonderanfragen
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/about" onClick={closeNav}>Über uns</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/contact" onClick={closeNav}>Kontakt</Link>
            </li>
          </ul>

          {/* Right Side Actions */}
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                {isDonor ? (
                  <Link to="/add-food" className="btn btn-success btn-sm fw-semibold" onClick={closeNav}>
                    ➕ Angebot erstellen
                  </Link>
                ) : (
                  <Link to="/reservations" className="btn btn-outline-success btn-sm position-relative" onClick={closeNav}>
                    🛒 Reservierungen
                    {reservationCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {reservationCount}
                      </span>
                    )}
                  </Link>
                )}

                <span className="text-muted small fw-semibold ms-2">
                  Hallo, {user.name}
                </span>

                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-dark btn-sm" onClick={closeNav}>
                  Anmelden
                </Link>
                <Link to="/register" className="btn btn-success btn-sm" onClick={closeNav}>
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