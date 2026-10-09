const express = require('express');
const router = express.Router();

// Controllers
const {
    createReservation,
    getUserReservations,
    getDonorOrders,
    checkoutReservation,
    deleteReservation,
    deleteCompletedOrder // <--- 1. إضافة استيراد دالة الحذف الجديدة هنا
} = require('../controllers/reservationControllers');

// Routes
router.post('/add', createReservation);
router.get('/user/:userId', getUserReservations);
router.get('/donor-orders/:donorId', getDonorOrders);
router.put('/checkout/:id', checkoutReservation);
router.delete('/completed/:id', deleteCompletedOrder); // <--- 2. إضافة مسار الحذف المكتمل هنا
router.delete('/:id', deleteReservation);

module.exports = router;