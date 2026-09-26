const pool = require('../config/db');

// تسجيل دخول المستخدم
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        // إرجاع بيانات المستخدم (أو الـ token)
        res.json({
            message: 'Login successful',
            user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
};

module.exports = {
    loginUser
};