import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem('emailNotifications') === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lang') || 'de';
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode-active');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode-active');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('lang', language);
    localStorage.setItem('emailNotifications', emailNotifications);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={`container py-5 ${darkMode ? 'text-white' : ''}`}>
      <div className={`card border-0 shadow-sm p-4 mx-auto rounded-4 settings-card ${darkMode ? 'bg-secondary text-white' : ''}`} style={{ maxWidth: '600px' }}>
        <h2 className="fw-bold text-success mb-4">⚙️ Einstellungen</h2>

        {saved && (
          <div className="alert alert-success rounded-3 py-2 small mb-3">
            Einstellungen erfolgreich gespeichert!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 1. إشعارات البريد */}
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="notificationsCheck"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            <label className="form-check-label fw-semibold" htmlFor="notificationsCheck">
              E-Mail Benachrichtigungen aktivieren
            </label>
          </div>

          {/* 2. الوضع الداكن */}
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="darkModeCheck"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <label className="form-check-label fw-semibold" htmlFor="darkModeCheck">
              Dunkler Modus (Dark Mode)
            </label>
          </div>

          {/* 3. اختيار اللغة */}
          <div className="mb-4">
            <label className="form-label fw-semibold small">Sprache / Language</label>
            <select 
              className={`form-select py-2 rounded-3 ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="de">Deutsch (Standard)</option>
              <option value="en">English</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold py-2 rounded-3 shadow-sm">
            Änderungen speichern
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;