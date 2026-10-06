const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db'); // تأكد من مسار DB

// Controllers
const {
    createFoodListing,
    getAllFoodListings,
    deleteFoodListing,
    updateFoodListing
} = require('../controllers/foodControllers');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 🔹 مسار جلب الوجبة برقم الـ ID من جدول food_listings الصحيح
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // استخدام اسم الجدول الصحيح food_listings مع دعم fallback لـ foods
        let result;
        try {
            result = await pool.query('SELECT * FROM food_listings WHERE id = $1', [id]);
        } catch (dbErr) {
            result = await pool.query('SELECT * FROM foods WHERE id = $1', [id]);
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Angebot nicht gefunden' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching single food item:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Laden des Angebots' });
    }
});

// Routes
router.post('/add', upload.single('image'), createFoodListing);
router.get('/', getAllFoodListings);
router.put('/:id', upload.single('image'), updateFoodListing);
router.delete('/:id', deleteFoodListing);

module.exports = router;