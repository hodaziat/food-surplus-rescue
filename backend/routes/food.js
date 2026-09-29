const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// استيراد الدوال من الـ Controller
const {
    createFoodListing,
    getAllFoodListings,
    deleteFoodListing,
    updateFoodListing // تم استيراد دالة التحديث الجديدة
} = require('../controllers/foodControllers');

// إعداد مجلد حفظ الصور
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

// المسارات
router.post('/add', upload.single('image'), createFoodListing);
router.get('/', getAllFoodListings);
router.put('/:id', upload.single('image'), updateFoodListing); // إضافة مسار التحديث مع رفع الصور
router.delete('/:id', deleteFoodListing);

module.exports = router;