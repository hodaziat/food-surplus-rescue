import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // قراءة بيانات المستخدم من الـ LocalStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

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
              <Link className="nav-link fw-semibold" to="/about">Über uns</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/contact">Kontakt</Link>
            </li>
          </ul>

          {/* Right Side Actions */}
          <div className="d-flex align-items-center gap-3">
            
            {/* إذا كان المستخدم مسجل الدخول */}
            {user ? (
              <>
                {/* عرض رابط "إضافة عرض" فقط إذا كان المستخدم Spender/Donor */}
                {user.role === 'donor' && (
                  <Link to="/add-listing" className="btn btn-success btn-sm fw-semibold">
                    ➕ Angebot erstellen
                  </Link>
                )}

                {/* عرض سلة الحجوزات للعميل العادي user */}
                {user.role === 'user' && (
                  <Link to="/reservations" className="btn btn-outline-success btn-sm">
                    🛒 Reservierungen
                  </Link>
                )}

                {/* ترحيب بالمستخدم وزر تسجيل الخروج */}
                <span className="text-muted small fw-semibold">Hallo, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                  Abmelden
                </button>
              </>
            ) : (
              /* إذا لم يكن المستخدم مسجل الدخول */
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