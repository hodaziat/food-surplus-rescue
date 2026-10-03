const express = require('express');
const router = express.Router();

// Controllers
const { 
    loginUser, 
    registerUser, 
    updateProfile, 
    changePassword 
} = require('../controllers/authControllers');

// Routes
router.post('/login', loginUser);
router.post('/register', registerUser);
router.put('/profile/:id', updateProfile);
router.put('/change-password/:id', changePassword);

module.exports = router;