const express = require('express');
const router = express.Router();
const { addSiteReview, getSiteReviews, deleteSiteReview } = require('../controllers/siteReviewControllers');

router.post('/add', addSiteReview);
router.get('/', getSiteReviews);
router.delete('/:id', deleteSiteReview);

module.exports = router;