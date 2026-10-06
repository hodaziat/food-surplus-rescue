const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./config/db');

// استدعاء كافة المسارات (Routes) منظمة في مكان واحد
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const reservationRoutes = require('./routes/reservation');
const specialRequestRoutes = require('./routes/specialRequest');
const siteReviewRoutes = require('./routes/siteReviewRoutes');
const donorReviewRoutes = require('./routes/donorReviewRoutes');
const contactRoutes = require('./routes/contactRoutes'); // مسار التواصل المنفصل

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// إتاحة مجلد الصور المرفوعة للوصول إليها عبر الرابط المباشر
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Mapping
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/site-reviews', siteReviewRoutes);
app.use('/api/donor-reviews', donorReviewRoutes); // تم تصحيح الخطأ هنا بنجاح
app.use('/api/special-requests', specialRequestRoutes);
app.use('/api/contact', contactRoutes);

// إنشاء جدول طلبات المؤسسات والجمعيات (Special Requests) تلقائياً عند التشغيل
const createSpecialRequestsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS special_requests (
        id SERIAL PRIMARY KEY,
        organization_name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        requested_quantity INTEGER NOT NULL,
        event_date DATE NOT NULL,
        details TEXT,
        is_archived BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('🤝 Special requests table is ready.');
  } catch (err) {
    console.error('Error creating special_requests table:', err);
  }
};
createSpecialRequestsTable();

// فحص السيرفر
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