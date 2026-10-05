const express = require('express');
const router = express.Router();

// Controllers
const {
    createReservation,
    getUserReservations,
    getDonorOrders,
    checkoutReservation,
    deleteReservation
} = require('../controllers/reservationControllers');

// Routes
router.post('/add', createReservation);
router.get('/user/:userId', getUserReservations);
router.get('/donor-orders/:donorId', getDonorOrders);
router.put('/checkout/:id', checkoutReservation);
router.delete('/:id', deleteReservation);

module.exports = router;