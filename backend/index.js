const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');

const app = express();

// Middlewares (يجب تنظيمها قبل المسارات)
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);

// مسار الفحص
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Food Surplus Rescue Server is running!' });
});

// مسار اختبار قاعدة البيانات
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