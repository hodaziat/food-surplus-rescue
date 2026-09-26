const pool = require('../config/db');

// تسجيل دخول المستخدم
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        const userData = user.rows[0];

        // إرجاع بيانات المستخدم شاملة الدور والتوكين
        res.json({
            message: 'Login successful',
            token: 'jwt_token_example', // أو التوكين الخاص بكِ
            user: { 
                id: userData.id, 
                name: userData.name, 
                email: userData.email,
                role: userData.role || userData.user_role || 'donor' // أضفنا حقل الـ role هنا
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
};

module.exports = {
    loginUser
};