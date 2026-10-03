const express = require('express');
const router = express.Router();

// Controllers
const { 
    addSiteReview, 
    getSiteReviews, 
    deleteSiteReview 
} = require('../controllers/siteReviewControllers');

// Routes
router.post('/add', addSiteReview);
router.get('/', getSiteReviews);
router.delete('/:id', deleteSiteReview);

module.exports = router;