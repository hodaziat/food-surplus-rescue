// backend/routes/specialRequest.js
const express = require('express');
const router = express.Router();
const { 
  createSpecialRequest, 
  getAllSpecialRequests, 
  deleteSpecialRequest 
} = require('../controllers/specialRequestController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// 1. مسار إنشاء طلب خاص (متاح للجميع)
router.post('/', createSpecialRequest);

// 2. مسار جلب جميع الطلبات الخاصة (محمي للأدمن فقط)
router.get('/', verifyAdmin, getAllSpecialRequests);

// 3. مسار حذف طلب خاص (محمي للأدمن فقط)
router.delete('/:id', verifyAdmin, deleteSpecialRequest);

module.exports = router;