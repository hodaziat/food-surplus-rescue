// backend/routes/specialRequest.js
const express = require('express');
const router = express.Router();
const { createSpecialRequest } = require('../controllers/specialRequestController');
const db = require('../config/db');

// مسار استقبال الطلب الخاص (إرسال)
router.post('/', createSpecialRequest);

// مسار جلب جميع الطلبات الخاصة للوحة تحكم الأدمن
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM special_requests ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der Sonderanfragen:', err);
    res.status(500).json({ message: 'Fehler beim Abrufen der Sonderanfragen.' });
  }
});

module.exports = router;