# 🍏 Food Surplus Rescue Erlangen

[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_Express-339933?logo=nodedotjs)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Container-Docker_Compose-2496ED?logo=docker)](https://www.docker.com/)

**Food Surplus Rescue Erlangen** ist eine umfassende Full-Stack-Webanwendung zur Reduzierung von Lebensmittelverschwendung in der Stadt Erlangen. Die Plattform verbindet lokale Spender (Gastronomen, Bäckereien und Supermärkte) direkt mit Endkunden sowie sozialen Organisationen und der Tafel Erlangen.

---

## 📑 Inhaltsverzeichnis
- [🚀 Technologie-Stack](#-technologie-stack)
- [👥 Benutzerrollen & Berechtigungen](#-benutzerrollen--berechtigungen)
- [✨ Hauptfunktionen](#-hauptfunktionen)
- [📊 Datenbankstruktur (PostgreSQL Schema)](#-datenbankstruktur-postgresql-schema)
- [🔌 API-Endpunkte](#-api-endpunkte)
- [🔑 Umgebungsvariablen (.env)](#-umgebungsvariablen-env)
- [🛠️ Installation & Ausführung](#️-installation--ausführung)
  - [Option A: Docker Compose (Empfohlen)](#option-a-docker-compose-empfohlen)
  - [Option B: Manuelle lokale Einrichtung](#option-b-manuelle-lokale-einrichtung)
- [📂 Projektstruktur](#-projektstruktur)
- [📄 Lizenz](#-lizenz)

---

## 🚀 Technologie-Stack

### **Frontend:**
- **React 19** (`react-scripts`)
- **React Router v6** (für Routing und geschützte Routen / Protected Routes)
- **Bootstrap 5 & React-Bootstrap** (für ein modernes, responsives UI-Design)
- **Leaflet & React-Leaflet** (für interaktive Karten und Standortanzeigen)
- **jsPDF** (für den Export von Belegen und Quittungen als PDF)
- **Axios** (für API-Anfragen an das Backend)

### **Backend:**
- **Node.js & Express.js** (für die RESTful API und Server-Logik)
- **PostgreSQL** (relationale Datenbank für Benutzer, Angebote, Reservierungen und Nachrichten)
- **`pg` (node-postgres)** (für Pool-Verbindungen und transaktionssichere Datenbankabfragen)
- **JWT (JSON Web Tokens) & Bcrypt.js** (für Authentifizierung und Passwort-Hashing)

### **DevOps & Containerisierung:**
- **Docker & Docker Compose** (für eine isolierte, konsistente Entwicklungsumgebung von Frontend, Backend und Datenbank)

---

## 👥 Benutzerrollen & Berechtigungen

1. **Kunde (`customer` / `user`):**
   * Stöbern in verfügbaren Lebensmitteln auf der Karte & Liste.
   * Reservieren von Speisen im Warenkorb.
   * Checkout & Generierung eines PDF-Abholbelegs.
   * Einsehen und Bereinigen der eigenen Bestellhistorie.

2. **Spender / Gastronom (`donor` / `restaurant`):**
   * Erstellen, Bearbeiten und Löschen von Lebensmittelangeboten.
   * Übersicht aller eingegangenen Reservierungen und Abholanfragen.
   * Bestätigen von Abholungen und Verwalten abgeschlossener Bestellungen.

3. **Soziale Partner & Tafeln (`partner`):**
   * Einreichen von Sonderanfragen (Großmengen für wohltätige Zwecke).

4. **Administrator (`admin`):**
   * Zugriff auf das zentrale Admin-Dashboard.
   * Verwaltung eingegangener Kontaktanfragen & Sonderanfragen.
   * Archivierung und permanentes Löschen von Nachrichten.

---

## ✨ Hauptfunktionen

### 1. 🛒 Intelligentes Reservierungs- & Warenkorbsystem
- **Echtzeit-Mengenberechnung:** Automatische Ermittlung der verfügbaren Portionen (`available_quantity`) unter Berücksichtigung aktiver Reservierungen anderer Nutzer.
- **Race-Condition-Schutz:** Transaktionssicherer Checkout-Prozess mit automatischer Bestandsreduzierung in PostgreSQL.
- **Rollenbasierte Sichtbarkeit:** Warenkorbfunktionen sind für Spender und Admins ausgeblendet.

### 2. 🗑️ Historien-Bereinigung (Löschfunktion)
- **Gemeinsame Bereinigung:** Sowohl Kunden als auch Gastronomen können abgelaufene oder abgeholte Bestellungen (`completed` / `abgeholt`) direkt aus ihrer Historie löschen (`🗑️ Löschen`).
- **Cleaner UI:** Verhindert Ansammlungen veralteter Einträge in der Datenbank und auf der Benutzeroberfläche.
- **API-Endpunkt:** `DELETE /reservations/completed/:id`.

### 3. 🗺️ Interaktive Karte (Erlangen Standorte)
- Visualisierung von Abholorten via Leaflet Maps.
- Direktlinks zu Google Maps für die Navigation.

### 4. 📄 Digitaler PDF-Beleg
- Automatische Generierung von Quittungen für abgeholte Reservierungen inklusive Abholcode, Spenderadresse und Zeitstempel.

### 5. 📥 Administrations-Center (Admin Panel)
- **Kontaktanfragen:** Direktes Antworten per E-Mail aus der Plattform heraus.
- **Archiv-System:** Wiederherstellen oder endgültiges Löschen archivierter Nachrichten.
- **Sonderanfragen:** Koordination von Lebensmittel-Großspenden für gemeinnützige Vereine.

---

## 📊 Datenbankstruktur (PostgreSQL Schema)

* **`users`**: Speichert Benutzerdaten, Passwörter (gehasht) und Rollen (`admin`, `donor`, `customer`, `partner`).
* **`food_listings`**: Speichert Speiseangebote, Mengen, Ablaufdaten (`expiration_date`), Preise und Standortdaten.
* **`reservations`**: Verknüpft `users` und `food_listings` mit Statuswerten (`pending`, `confirmed`, `completed`, `abgeholt`).
* **`contacts`**: Speichert Kontaktnachrichten und deren Archivstatus.
* **`special_requests`**: Speichert Anfragen von Tafeln und sozialen Partnern.

---

## 🔌 API-Endpunkte

### 🔐 Authentifizierung (`/api/auth`)
- `POST /api/auth/register` - Neuen Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden (Liefert JWT)

### 🍲 Lebensmittelangebote (`/api/food`)
- `GET /api/food` - Alle verfügbaren Angebote abrufen
- `POST /api/food/add` - Neues Angebot erstellen (Nur Spender/Admin)
- `DELETE /api/food/:id` - Angebot löschen

### 🛒 Reservierungen & Bestellungen (`/api/reservations`)
- `POST /api/reservations/add` - Reservierung zum Warenkorb hinzufügen
- `GET /api/reservations/user/:userId` - Reservierungen eines Kunden abrufen
- `GET /api/reservations/donor-orders/:donorId` - Bestellungen für einen Gastronomen abrufen
- `PUT /api/reservations/checkout/:id` - Checkout durchführen & Reservierung bestätigen
- `DELETE /api/reservations/:id` - Aktive Reservierung stornieren
- `DELETE /api/reservations/completed/:id` - Abgeschlossene/Abgelaufene Bestellung aus der Historie löschen

---

## 🔑 Umgebungsvariablen (.env)

Erstelle im Ordner `backend/` eine `.env`-Datei mit folgendem Inhalt:

```env
PORT=5000
DATABASE_URL=postgres://postgres:postgres@db:5432/food_surplus_db
JWT_SECRET=dein_super_sicherer_jwt_schluessel
NODE_ENV=development
```

---

## 🛠️ Installation & Ausführung

### Option A: Docker Compose (Empfohlen)

Mit Docker Compose werden Datenbank, Backend und Frontend mit einem einzigen Befehl gestartet.

1. **Repository klonen:**
   ```bash
   git clone https://github.com/dein-username/food-surplus-rescue-erlangen.git
   cd food-surplus-rescue-erlangen
   ```

2. **Container bauen und starten:**
   ```bash
   docker-compose up --build
   ```

3. **Anwendung öffnen:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:5000

---

### Option B: Manuelle lokale Einrichtung

1. **Backend starten:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend starten:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

---

## 📂 Projektstruktur

```text
food-surplus-rescue-erlangen/
├── backend/
│   ├── config/            # Datenbankverbindung (db.js)
│   ├── controllers/       # Logik (foodController.js, reservationControllers.js, etc.)
│   ├── models/            # Datenmodelle
│   ├── routes/            # Express-Routen (reservationRoutes.js, etc.)
│   └── server.js          # Einstiegspunkt des Node.js-Servers
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Navigation, Footer, OrderCard, ChatWidget
│   │   ├── pages/         # Home, DonorOrdersPage, AdminMessages, CheckoutPage
│   │   ├── services/      # Axios API-Verbindung (api.js)
│   │   ├── App.jsx        # Routing & Auth-Zustand
│   │   └── index.js       # React-Einstiegspunkt
│   └── package.json
│
├── docker-compose.yml     # Docker Orchestrierung
└── README.md              # Projekt-Dokumentation
```

---

## 📄 Lizenz

Dieses Projekt steht unter der **MIT-Lizenz**. Frei verwendbar für Bildungs- und gemeinnützige Zwecke zur Rettung von Lebensmitteln.