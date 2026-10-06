const express = require('express');
const router = express.Router();

// Controllers
const { 
    addDonorReview, 
    getDonorReviews, 
    getDonorAverageRating,
    deleteDonorReview,
    replyToDonorReview,
    getAllDonorReviews 
} = require('../controllers/donorReviewControllers');

// Routes
// 1. مسارات جلب الكل
router.get('/all', getAllDonorReviews);

// 2. مسارات الإضافة والرد
router.post('/add', addDonorReview);
router.post('/reply/:reviewId', replyToDonorReview);

// 3. مسار جلب متوسط تقييم مطعم محدد (للكروت والبطاقات)
router.get('/:donorId/rating', getDonorAverageRating);

// 4. مسار جلب جميع تقييمات مطعم محدد
router.get('/:donorId', getDonorReviews);

// 5. مسار الحذف
router.delete('/:id', deleteDonorReview);

module.exports = router;