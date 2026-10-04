const express = require('express');
const router = express.Router();

// Controllers
const { 
    addDonorReview, 
    getDonorReviews, 
    deleteDonorReview,
    replyToDonorReview,
    getAllDonorReviews 
} = require('../controllers/donorReviewControllers');

// Routes
// ملاحظة: يجب وضع مسار /all قبل مسار /:donorId لكي لا يقرأ Express كلمة 'all' على أنها donorId
router.get('/all', getAllDonorReviews);
router.post('/add', addDonorReview);
router.get('/:donorId', getDonorReviews);
router.delete('/:id', deleteDonorReview);
router.post('/reply/:reviewId', replyToDonorReview);

module.exports = router;