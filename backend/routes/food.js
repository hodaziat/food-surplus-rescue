const express = require('express');
const router = express.Router();

// استيراد الدوال بنمط الـ Destructuring المطابق للأستاذ
const {
    createFoodListing,
    getAllFoodListings,
    deleteFoodListing
} = require('../controllers/foodControllers');

router.post('/add', createFoodListing);
router.get('/', getAllFoodListings);
router.delete('/:id', deleteFoodListing);

module.exports = router;