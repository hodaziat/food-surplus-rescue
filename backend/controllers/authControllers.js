const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';

// 1. تسجيل الدخول
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'E-Mail oder Passwort falsch.' });
        }

        const userData = userResult.rows[0];
        const storedPassword = userData.password || userData.passwort;

        const isMatch = await bcrypt.compare(password, storedPassword);

        if (!isMatch) {
            return res.status(400).json({ message: 'E-Mail oder Passwort falsch.' });
        }

        // توليد توكن لمدة ساعة واحدة
        const token = jwt.sign(
            { id: userData.id, email: userData.email, role: userData.role || userData.user_role || 'user' },
            JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(200).json({
            message: 'Login erfolgreich',
            token,
            user: { 
                id: userData.id, 
                name: userData.name || userData.username || 'User', 
                email: userData.email,
                role: userData.role || userData.user_role || 'user',
                welcome_coupon: userData.welcome_coupon || null,
                is_coupon_used: userData.is_coupon_used || false
            }
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Login' });
    }
};

// 2. إنشاء حساب جديد (مع التعامل المباشر مع أعمدة الكوبون)
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'E-Mail bereits registriert.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const welcomeCouponCode = `WELCOME-${Math.floor(1000 + Math.random() * 9000)}`;

        let userData;
        try {
            // المحاولة الأولى: حفظ المستخدم مع الكوبون
            const newUser = await pool.query(
                `INSERT INTO users (name, email, password, role, welcome_coupon, is_coupon_used) 
                 VALUES ($1, $2, $3, $4, $5, FALSE) 
                 RETURNING *`,
                [name || 'User', email, hashedPassword, role || 'user', welcomeCouponCode]
            );
            userData = newUser.rows[0];
        } catch (couponErr) {
            // في حال عدم وجود عمود welcome_coupon في جدول users القديم
            console.warn('Coupon columns not found in database, registering without coupon columns.');
            const newUserFallback = await pool.query(
                `INSERT INTO users (name, email, password, role) 
                 VALUES ($1, $2, $3, $4) 
                 RETURNING *`,
                [name || 'User', email, hashedPassword, role || 'user']
            );
            userData = newUserFallback.rows[0];
        }

        const token = jwt.sign(
            { id: userData.id, email: userData.email, role: userData.role },
            JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(201).json({
            message: 'Registrierung erfolgreich',
            token,
            user: {
                id: userData.id,
                name: userData.name || userData.username || name,
                email: userData.email,
                role: userData.role || role || 'user',
                welcome_coupon: userData.welcome_coupon || welcomeCouponCode,
                is_coupon_used: userData.is_coupon_used || false
            }
        });

    } catch (err) {
        console.error('Register Error:', err.message);
        res.status(500).json({ message: err.message || 'Registrierung fehlgeschlagen.' });
    }
};

// 3. تحديث البيانات الشخصية
const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const updatedUser = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role',
            [name, email, id]
        );

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden' });
        }

        res.status(200).json({
            message: 'Profil erfolgreich aktualisiert',
            user: updatedUser.rows[0]
        });
    } catch (err) {
        console.error('Update Profile Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Profils' });
    }
};

// 4. تغيير كلمة المرور
const changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        const userResult = await pool.query('SELECT password FROM users WHERE id = $1', [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden' });
        }

        const storedPassword = userResult.rows[0].password;

        const isMatch = await bcrypt.compare(currentPassword, storedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Das aktuelle Passwort ist falsch.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, id]);

        res.status(200).json({ message: 'Passwort erfolgreich geändert' });
    } catch (err) {
        console.error('Change Password Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Ändern des Passworts' });
    }
};

module.exports = {
    loginUser,
    registerUser,
    updateProfile,
    changePassword
};