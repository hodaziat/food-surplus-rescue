const express = require('express');
const router = express.Router();

// Controllers
const {
    createReservation,
    getUserReservations,
    deleteReservation
} = require('../controllers/reservationControllers');

// Routes
router.post('/add', createReservation);
router.get('/user/:userId', getUserReservations);
router.delete('/:id', deleteReservation);
router.delete('/delete/:id', deleteReservation);

module.exports = router;