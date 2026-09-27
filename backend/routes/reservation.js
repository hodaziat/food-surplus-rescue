const express = require('express');
const router = express.Router();

const {
    createReservation,
    getUserReservations,
    deleteReservation
} = require('../controllers/reservationControllers');

// 1. إنشاء حجز جديد
router.post('/add', createReservation);

// 2. جلب حجوزات مستخدم معين
router.get('/user/:userId', getUserReservations);

// 3. حذف الحجز (دعم كلا الصيغتين لمنع أي تعارض مع الواجهة)
router.delete('/:id', deleteReservation);
router.delete('/delete/:id', deleteReservation);

module.exports = router;