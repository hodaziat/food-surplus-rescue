import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackToHomeButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // إذا كنا في الصفحة الرئيسية، فلن يظهر الزر أبداً
  if (location.pathname === '/' || location.pathname === '/home') {
    return null;
  }

  return (
    <div className="mb-3">
      <button 
        type="button"
        onClick={() => navigate('/')} 
        className="btn btn-outline-secondary btn-sm fw-bold rounded-3 shadow-sm d-flex align-items-center gap-2 px-3 py-2"
        style={{ width: 'fit-content' }}
      >
        <span>⬅️</span>
        <span>Zurück zur Startseite</span>
      </button>
    </div>
  );
};

export default BackToHomeButton;