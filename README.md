# 🍏 Food Surplus Rescue Erlangen

Food Surplus Rescue Erlangen ist eine Full-Stack-Webanwendung, die entwickelt wurde, um Lebensmittelverschwendung in Erlangen zu reduzieren. Sie verbindet lokale Lebensmittelspender (Restaurants, Supermärkte und Bäckereien) direkt mit Endkunden sowie sozialen Organisationen und Tafeln, um frische, überschüssige Lebensmittel vor der Entsorgung zu retten.

---

## 🚀 Technologie-Stack

### **Frontend:**
* **React 19** (`react-scripts`)
* **React Router v6** (für Routing und geschützte Routen / Protected Routes)
* **Bootstrap 5 & React-Bootstrap** (für ein modernes, responsives UI-Design)
* **Leaflet & React-Leaflet** (für interaktive Karten und Standortanzeigen)
* **jspdf** (für den Export von Belegen und Quittungen als PDF)

### **Backend:**
* **Node.js & Express.js** (für die RESTful API und Server-Logik)
* **PostgreSQL** (relationale Datenbank für Benutzer, Angebote, Reservierungen und Nachrichten)
* **`pg` (node-postgres)** (für Pool-Verbindungen und transaktionssichere Datenbankabfragen zur Vermeidung von Race Conditions)

---

## ✨ Hauptfunktionen & Implementierte Features

1. **Intelligentes Warenkorb- und Reservierungssystem:**
   * Dynamische Berechnung der verfügbaren Mengen (`available_quantity`), wobei aktive Reservierungen anderer Benutzer berücksichtigt werden.
   * Transaktionssicherer Checkout-Prozess mit automatischer Bestandsreduzierung in der PostgreSQL-Datenbank.
   * Automatische Ausblendung des Warenkorbs für Spender (`donor`) und Administratoren.

2. **Einheitliches Admin-Dashboard (AdminMessages & AdminSpecialRequests):**
   * Zentralisiertes Tab-basiertes Administrationspanel zur Vermeidung von White-Screen-Feitern und für flüssige Navigation:
     * **📥 Eingegangene Nachrichten:** Empfang und Verwaltung direkter Kontaktanfragen mit E-Mail-Antwortfunktion.
     * **📁 Archiv:** Übersicht archivierter Nachrichten mit Optionen zur Wiederherstellung oder **permanentem Löschen**.
     * **🤝 Sonderanfragen:** Verwaltung spezieller Lebensmittel- und Großmengenanfragen von sozialen Vereinen und Tafeln.

3. **Sicherheit & Authentifizierung:**
   * Token-basierte Authentifizierung (JWT) mit Client-seitiger Sitzungsvalidierung (Ablaufprüfung nach 1 Stunde Inaktivität / `ONE_HOUR_MS`).
   * Schutz sensibler Routen (`ProtectedRoute`) für Admins und registrierte Benutzer.

---

## 📂 Projektstruktur

```text
food-surplus-rescue-erlangen/
├── backend/
│   ├── config/              # Datenbankkonfiguration (db.js)
│   ├── controllers/         # Geschäftslogik (foodController, reservationsController, etc.)
│   ├── models/              # Datenmodelle (Contact.js, etc.)
│   ├── routes/              # API-Routen (contactRoutes.js, specialRequests, etc.)
│   └── server.js            # Einstiegspunkt des Node.js-Servers
│
└── frontend/
    ├── src/
    │   ├── components/      # Wiederverwendbare UI-Komponenten (Navbar, Footer, ChatWidget)
    │   ├── pages/           # Anwendungsseiten (Home, AdminMessages, CheckoutPage, etc.)
    │   ├── services/        # Axios-API-Konfiguration (api.js)
    │   ├── App.jsx          # Zentraler Router und Auth-Logik
    │   └── index.js         # React-Einstiegspunkt
    └── package.json