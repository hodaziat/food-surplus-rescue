const express = require('express');
const router = express.Router();

const {
    createReservation,
    getUserReservations
} = require('../controllers/reservationControllers');

router.post('/add', createReservation);
router.get('/user/:userId', getUserReservations);

module.exports = router;