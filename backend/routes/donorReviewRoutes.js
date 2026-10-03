const express = require('express');
const router = express.Router();

// Controllers
const { 
    addDonorReview, 
    getDonorReviews, 
    deleteDonorReview 
} = require('../controllers/donorReviewControllers');

// Routes
router.post('/add', addDonorReview);
router.get('/:donorId', getDonorReviews);
router.delete('/:id', deleteDonorReview);

module.exports = router;