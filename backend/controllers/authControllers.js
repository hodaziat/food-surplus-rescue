const pool = require('../config/db');

// 1. تسجيل الدخول
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login attempt for:', email);

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'E-Mail oder Passwort falsch.' });
        }

        const userData = userResult.rows[0];
        const storedPassword = userData.password || userData.passwort;

        if (storedPassword !== password) {
            return res.status(400).json({ message: 'E-Mail oder Passwort falsch.' });
        }

        res.json({
            message: 'Login successful',
            token: 'jwt_token_example',
            user: { 
                id: userData.id, 
                name: userData.name || userData.username || 'User', 
                email: userData.email,
                role: userData.role || userData.user_role || 'user' // توحيد القيمة الافتراضية كـ user
            }
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
};

// 2. إنشاء حساب جديد
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        console.log('Register attempt for:', email);

        // التحقق من وجود الإيميل
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'E-Mail bereits registriert.' });
        }

        // إدراج الحساب الجديد في PostgreSQL
        const newUser = await pool.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [name || 'User', email, password, role || 'user']
        );

        const userData = newUser.rows[0];

        res.status(201).json({
            message: 'Registrierung erfolgreich',
            token: 'jwt_token_example',
            user: {
                id: userData.id,
                name: userData.name || userData.username || name,
                email: userData.email,
                role: userData.role || role || 'user'
            }
        });

    } catch (err) {
        console.error('Register Error Details:', err.message);
        res.status(400).json({ message: err.message || 'Registrierung fehlgeschlagen.' });
    }
};

module.exports = {
    loginUser,
    registerUser
};