import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top px-4 py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold text-success fs-3 d-flex align-items-center" to="/">
          <span className="me-2">🍲</span> Food Rescuing Hub
        </Link>
        <div className="d-flex align-items-center">
          {token ? (
            <>
              <span className="me-3 fw-semibold text-secondary">Hallo, {user?.name}</span>
              <Link to="/add-food" className="btn btn-success fw-bold me-2 px-3">
                + Angebot erstellen
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-danger px-3">
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-success me-2 fw-semibold px-3">
                Anmelden
              </Link>
              <Link to="/register" className="btn btn-success fw-semibold px-3">
                Registrieren
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;