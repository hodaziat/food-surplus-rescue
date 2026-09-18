import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        
        {/* Logo / Brand */}
        <Link className="navbar-brand fw-bold text-success d-flex align-items-center gap-2" to="/">
          🌱 Food Surplus Rescue
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

          {/* Right Side Actions (Cart/Reservations & Login/Signup) */}
          <div className="d-flex align-items-center gap-3">
            
            {/* سلة الحجوزات */}
            <Link to="/reservations" className="btn btn-outline-success btn-sm">
              🛒 Reservierungen
            </Link>

            {/* أزرار التسجيل */}
            <Link to="/login" className="btn btn-outline-dark btn-sm">
              Anmelden
            </Link>

            <Link to="/register" className="btn btn-success btn-sm">
              Registrieren
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;