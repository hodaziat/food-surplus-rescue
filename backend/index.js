const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./config/db');

// استدعاء مسارات التقييمات
const siteReviewRoutes = require('./routes/siteReviewRoutes');
const donorReviewRoutes = require('./routes/donorReviewRoutes');

// استدعاء المسارات الرئيسية
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const reservationRoutes = require('./routes/reservation');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// إتاحة مجلد الصور المرفوعة للوصول إليها عبر الرابط المباشر
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/site-reviews', siteReviewRoutes);
app.use('/api/donor-reviews', donorReviewRoutes);

// إنشاء جدول الرسائل في قاعدة البيانات تلقائياً عند بدء التشغيل إن لم يكن موجوداً
const createContactTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) DEFAULT 'Allgemeine Anfrage',
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('📥 Contact messages table is ready.');
  } catch (err) {
    console.error('Error creating contact_messages table:', err);
  }
};
createContactTable();

// مسار استقبال وحفظ رسائل صفحة التواصل (Kontakt)
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Alle Pflichtfelder müssen ausgefüllt werden.' });
  }

  try {
    const query = `
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [name, email, subject || 'Allgemeine Anfrage', message];
    const newMsg = await db.query(query, values);

    console.log('📩 Neue Kontaktanfrage gespeichert:', newMsg.rows[0]);
    res.status(201).json({ message: 'Nachricht erfolgreich gespeichert!' });
  } catch (err) {
    console.error('Contact Error:', err);
    res.status(500).json({ message: 'Serverfehler beim Speichern der Nachricht.' });
  }
});

// مسار لجلب جميع الرسائل (ليتم عرضها لاحقاً في لوحة التحكم)
app.get('/api/contact/messages', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Fehler beim Abrufen der Nachrichten.' });
  }
});

// الفحص
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Food Surplus Rescue Server is running!' });
});

// اختبار قاعدة البيانات
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.status(200).json({ message: 'DB connection successful', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});