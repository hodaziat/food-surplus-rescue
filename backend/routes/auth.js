const express = require('express');
const router = express.Router();
const { loginUser, registerUser, updateProfile, changePassword } = require('../controllers/authControllers');

router.post('/login', loginUser);
router.post('/register', registerUser);

// تعديل المسارات لإزالة /users المكررة
router.put('/profile/:id', updateProfile);
router.put('/change-password/:id', changePassword);

module.exports = router;