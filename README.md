# 🌿 Food Surplus Rescue Erlangen (Full-Stack Web Platform)
---

<a name="english"></a>
## 🇬🇧 English Version

### 📌 Project Overview
**Food Surplus Rescue Erlangen** is a modern Full-Stack web application designed to combat food waste in the city of Erlangen. The platform connects local food providers (such as bakeries, grocery stores, and restaurants) with community members to rescue excess meals either for free or at discounted prices.

---

### ✨ Key Features & Role-Based Access Control
The application supports 3 distinct user roles with strict security permissions:

1. **Customer / General User (`user`)**:
   * Browse active food surplus listings with real-time availability.
   * Search and filter listings by title or specific categories.
   * Interactive Leaflet map integration to view geographic locations of available food in Erlangen.
   * Reserve surplus food items and manage shopping cart reservations.
   * Instant, real-time cancellation of reservations with automatic cart counter updates (no page refresh required).

2. **Food Provider / Donor (`donor`)**:
   * Create and publish new food surplus offers with expiration dates and quantities.
   * Manage owned listings directly from the UI via quick Edit ✏️ and Delete 🗑️ modals.
   * Automated prevention against self-reserving owned listings.

3. **Administrator (`admin`)**:
   * Full moderation capabilities across all listings and platform data.
   * Direct removal of inappropriate or expired content.

---

### 🛠️ Tech Stack & Libraries

#### **Frontend**:
* **React.js**: Modular UI components for single-page architecture (SPA).
* **React Router Dom**: Client-side routing between pages (`Home`, `Reservations`, `Add Listing`, etc.).
* **Bootstrap 5 & React-Bootstrap**: Responsive, modern, and mobile-friendly UI layout.
* **Axios**: Promised-based HTTP client for seamless API calls to the Express backend.
* **Leaflet & React-Leaflet**: Interactive map rendering for geographical tracking in Erlangen.
* **BroadcastChannel API & Custom Events**: Real-time cross-component state synchronization (Navbar cart updates without reloading).

#### **Backend**:
* **Node.js & Express.js**: RESTful API architecture handling routing (`/api/auth`, `/api/food`, `/api/reservations`).
* **PostgreSQL**: Relational database storing structured user data, listings, and reservations.
* **pg (node-postgres)**: PostgreSQL client for Node.js executing safe SQL queries.
* **JSON Web Token (JWT)**: Secure user authentication and stateless session management.
* **bcrypt / bcryptjs**: Password hashing and salt encryption before storing to DB.
* **CORS & Dotenv**: Cross-Origin Resource Sharing handling and environment variable security.

---

### 🗄️ Database Schema

```sql
-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- 'user', 'donor', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Food Listings Table
CREATE TABLE food_listings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    quantity VARCHAR(50) DEFAULT '1',
    category VARCHAR(50) DEFAULT 'Sonstiges',
    expiration_date DATE,
    donor_id INT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Reservations Table
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    food_id INT REFERENCES food_listings(id) ON DELETE CASCADE,
    receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);