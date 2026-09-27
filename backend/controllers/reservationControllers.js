const pool = require('../config/db');

// 1. إنشاء حجز جديد
const createReservation = async (req, res) => {
    const { food_id, receiver_id, requested_quantity = 1 } = req.body;

    if (!food_id || !receiver_id) {
        return res.status(400).json({ error: 'Food ID and Receiver ID are required' });
    }

    try {
        const foodCheck = await pool.query('SELECT * FROM food_listings WHERE id = $1', [food_id]);

        if (foodCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Food item not found' });
        }

        const foodItem = foodCheck.rows[0];

        if (foodItem.user_id == receiver_id || foodItem.donor_id == receiver_id) {
            return res.status(400).json({ error: 'Sie können Ihr eigenes Angebot nicht reservieren.' });
        }

        const currentQuantity = parseInt(foodItem.quantity) || 1;

        if (currentQuantity < requested_quantity) {
            return res.status(400).json({ error: 'Nicht genügend Menge verfügbar.' });
        }

        const newReservation = await pool.query(
            'INSERT INTO reservations (food_id, receiver_id) VALUES ($1, $2) RETURNING *',
            [food_id, receiver_id]
        );

        const newQuantity = currentQuantity - requested_quantity;
        const newStatus = newQuantity <= 0 ? 'reserviert' : 'available';

        await pool.query(
            'UPDATE food_listings SET quantity = $1, status = $2 WHERE id = $3',
            [newQuantity.toString(), newStatus, food_id]
        );

        res.status(201).json({
            message: 'Reservierung erfolgreich!',
            reservation: newReservation.rows[0]
        });
    } catch (err) {
        console.error('Reservation Error:', err.message);
        res.status(500).json({ error: 'Server error while creating reservation: ' + err.message });
    }
};

// 2. جلب حجوزات مستخدم معّين مع إرجاع id الحجز صراحة
const getUserReservations = async (req, res) => {
    const { userId } = req.params;

    try {
        const reservations = await pool.query(
            `SELECT 
                reservations.id AS id,
                reservations.id AS reservation_id,
                reservations.food_id,
                reservations.receiver_id,
                reservations.reserved_at,
                food_listings.title, 
                food_listings.description, 
                food_listings.quantity
             FROM reservations 
             JOIN food_listings ON reservations.food_id = food_listings.id 
             WHERE reservations.receiver_id = $1 
             ORDER BY reservations.reserved_at DESC`,
            [userId]
        );

        res.json(reservations.rows);
    } catch (err) {
        console.error('Fetch Reservations Error:', err.message);
        res.status(500).json({ error: 'Server error while fetching reservations' });
    }
};

// 3. إلغاء/حذف حجز وتحديث حالة الطعام وإعادة الكمية بأمان
const deleteReservation = async (req, res) => {
    const { id } = req.params;

    try {
        // البحث عن الحجز بواسطة المعرف المرسل (أو معرف الوجبة في حال التمرير المرن)
        let reservationCheck = await pool.query('SELECT * FROM reservations WHERE id = $1', [id]);

        let reservation;
        if (reservationCheck.rows.length === 0) {
            const foodCheck = await pool.query('SELECT * FROM reservations WHERE food_id = $1 LIMIT 1', [id]);
            if (foodCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Reservierung nicht gefunden' });
            }
            reservation = foodCheck.rows[0];
        } else {
            reservation = reservationCheck.rows[0];
        }

        const reservation_id = reservation.id;
        const food_id = reservation.food_id;

        // 1. حذف الحجز
        await pool.query('DELETE FROM reservations WHERE id = $1', [reservation_id]);

        // 2. جلب كمية الطعام الحالية وحساب الكمية الجديدة بأمان
        const foodResult = await pool.query('SELECT quantity FROM food_listings WHERE id = $1', [food_id]);
        let currentQty = 0;
        if (foodResult.rows.length > 0) {
            currentQty = parseInt(foodResult.rows[0].quantity) || 0;
        }

        const updatedQty = currentQty + 1;

        // 3. تحديث الجدول بعد إرجاع الكمية
        await pool.query(
            'UPDATE food_listings SET quantity = $1, status = $2 WHERE id = $3',
            [updatedQty.toString(), 'available', food_id]
        );

        res.json({ message: 'Reservierung erfolgreich storniert.' });
    } catch (err) {
        console.error('Delete Reservation Error:', err.message);
        res.status(500).json({ error: 'Server error while deleting reservation: ' + err.message });
    }
};

module.exports = {
    createReservation,
    getUserReservations,
    deleteReservation
};