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
const foodRoutes = require('./routes/food'); // تأكدي أن اسم الملف في مجلد routes هو food.js أو عدليها لـ foodRoutes
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

// مسار استقبال رسائل صفحة التواصل (Kontakt)
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  console.log('📩 Neue Kontaktanfrage erhalten:', { name, email, subject, message });

  try {
    // يمكنك حفظها في قاعدة البيانات إذا كان لديك جدول للرسائل
    /*
    await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject, message]
    );
    */
    
    res.status(200).json({ success: true, message: 'Nachricht erfolgreich gesendet!' });
  } catch (err) {
    console.error('Contact Error:', err);
    res.status(500).json({ error: 'Serverfehler beim Senden der Nachricht.' });
  }
});

// الفحص
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Food Surplus Rescue Server is running!' });
});

// اختبار قاعدة البيانات
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ message: 'DB connection successful', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});