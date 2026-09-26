const pool = require('../config/db');

// 1. إنشاء حجز جديد
const createReservation = async (req, res) => {
    const { food_id, receiver_id } = req.body;

    try {
        // التحقق من أن الطعام متاح أولاً
        const foodCheck = await pool.query(
            'SELECT * FROM food_listings WHERE id = $1 AND status = $2',
            [food_id, 'available']
        );

        if (foodCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Food item is not available for reservation' });
        }

        // إضافة الحجز
        const newReservation = await pool.query(
            'INSERT INTO reservations (food_id, receiver_id) VALUES ($1, $2) RETURNING *',
            [food_id, receiver_id]
        );

        // تحديث حالة إعلان الطعام إلىreserved
        await pool.query(
            'UPDATE food_listings SET status = $1 WHERE id = $2',
            ['reserved', food_id]
        );

        res.status(201).json({
            message: 'Reservation created successfully',
            reservation: newReservation.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while creating reservation' });
    }
};

// 2. جلب جميع الحجوزات الخاصة بمستخدم معين
const getUserReservations = async (req, res) => {
    const { userId } = req.params;

    try {
        const reservations = await pool.query(
            `SELECT reservations.*, food_listings.title, food_listings.description 
             FROM reservations 
             JOIN food_listings ON reservations.food_id = food_listings.id 
             WHERE reservations.receiver_id = $1 
             ORDER BY reservations.reserved_at DESC`,
            [userId]
        );

        res.json(reservations.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while fetching reservations' });
    }
};

module.exports = {
    createReservation,
    getUserReservations
};