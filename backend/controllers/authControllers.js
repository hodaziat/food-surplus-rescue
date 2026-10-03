const pool = require('../config/db');

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

        if (storedPassword !== password) {
            return res.status(400).json({ message: 'E-Mail oder Passwort falsch.' });
        }

        res.status(200).json({
            message: 'Login erfolgreich',
            token: 'jwt_token_example',
            user: { 
                id: userData.id, 
                name: userData.name || userData.username || 'User', 
                email: userData.email,
                role: userData.role || userData.user_role || 'user'
            }
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Login' });
    }
};

// 2. إنشاء حساب جديد
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // التحقق من وجود الإيميل
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'E-Mail bereits registriert.' });
        }

        // إدراج الحساب الجديد في قاعدة البيانات
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

// 4. تغيير كلمة المرور للمستخدم
const changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        const userResult = await pool.query('SELECT password FROM users WHERE id = $1', [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden' });
        }

        const storedPassword = userResult.rows[0].password;

        if (storedPassword !== currentPassword) {
            return res.status(400).json({ message: 'Das aktuelle Passwort ist falsch.' });
        }

        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, id]);

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