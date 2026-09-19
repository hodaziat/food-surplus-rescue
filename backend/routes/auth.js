const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register API
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 1. التأكد من أن المستخدم غير موجود مسبقاً
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // تحديد الدور: إذا كان البريد هو بريدك الإلكتروني الإداري، اجعله أدمن تلقائياً
        // استبدل 'zaid.asaad.zoq@gmail.com' بريدك الذي ستسجل به
        let assignedRole = role || 'user';
        const adminEmail = 'zaid.asaad.zoq@gmail.com'; 

        if (email.trim().toLowerCase() === adminEmail.toLowerCase()) {
            assignedRole = 'admin';
        }

        // 2. تشفير كلمة السر
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. إضافة المستخدم إلى قاعدة البيانات بالدور المحدد (assignedRole)
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, assignedRole]
        );

        // 4. إنتاج Token
        const token = jwt.sign(
            { id: newUser.rows[0].id, role: newUser.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0],
            token
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login API
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. التحقق من وجود المستخدم
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        // 2. التحقق من كلمة السر
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // 3. إنتاج Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;