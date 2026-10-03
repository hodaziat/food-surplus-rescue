import React, { useState } from 'react';

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm p-4 mx-auto rounded-4" style={{ maxWidth: '600px' }}>
        <h2 className="fw-bold text-success mb-4">⚙️ Einstellungen</h2>

        {saved && (
          <div className="alert alert-success rounded-3 py-2 small mb-3">
            Einstellungen erfolgreich gespeichert!
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <div className="form-check form-switch mb-4">
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

          <button type="submit" className="btn btn-success w-100 fw-bold py-2 rounded-3 shadow-sm">
            Änderungen speichern
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;