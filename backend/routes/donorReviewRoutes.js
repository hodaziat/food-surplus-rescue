const express = require('express');
const router = express.Router();

// Controllers
const { 
    addDonorReview, 
    getDonorReviews, 
    deleteDonorReview,
    replyToDonorReview 
} = require('../controllers/donorReviewControllers');

// Routes
router.post('/add', addDonorReview);
router.get('/:donorId', getDonorReviews);
router.delete('/:id', deleteDonorReview);
router.post('/reply/:reviewId', replyToDonorReview);

module.exports = router;