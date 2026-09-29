const express = require('express');
const router = express.Router();
const { addDonorReview, getDonorReviews, deleteDonorReview } = require('../controllers/donorReviewControllers');

router.post('/add', addDonorReview);
router.get('/:donorId', getDonorReviews);
router.delete('/:id', deleteDonorReview);

module.exports = router;