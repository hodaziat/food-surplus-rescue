const express = require('express');
const router = express.Router();

// Controllers
const { 
    addSiteReview, 
    getSiteReviews, 
    replyToSiteReview,
    deleteSiteReview 
} = require('../controllers/siteReviewControllers');

// Routes
router.post('/add', addSiteReview);
router.get('/', getSiteReviews);
router.post('/reply/:id', replyToSiteReview); // 👈 مسار رد الأدمن على تقييمات الموقع
router.delete('/:id', deleteSiteReview);

module.exports = router;