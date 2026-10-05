const pool = require('../config/db');

// 1. إنشاء حجز جديد (إضافة للسلة + خصم الكمية)
const createReservation = async (req, res) => {
    const { food_id, receiver_id, requested_quantity = 1 } = req.body;

    if (!food_id || !receiver_id) {
        return res.status(400).json({ message: 'Food ID und Receiver ID sind erforderlich' });
    }

    try {
        const foodCheck = await pool.query('SELECT * FROM food_listings WHERE id = $1', [food_id]);

        if (foodCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        const foodItem = foodCheck.rows[0];

        if (Number(foodItem.donor_id) === Number(receiver_id)) {
            return res.status(400).json({ message: 'Sie können Ihr eigenes Angebot nicht reservieren.' });
        }

        const currentQuantity = parseInt(String(foodItem.quantity).replace(/\D/g, ''), 10) || 0;

        if (currentQuantity < requested_quantity) {
            return res.status(400).json({ message: 'Nicht genügend Menge verfügbar.' });
        }

        // إنشاء الحجز بحالة 'pending' (في السلة)
        const newReservation = await pool.query(
            "INSERT INTO reservations (food_id, receiver_id, status) VALUES ($1, $2, 'pending') RETURNING *",
            [food_id, receiver_id]
        );

        const newQuantity = currentQuantity - requested_quantity;
        const newStatus = newQuantity <= 0 ? 'unavailable' : 'available';

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
        res.status(500).json({ message: 'Serverfehler bei der Reservierung' });
    }
};

// 2. جلب الحجوزات المعلقة بالسلة فقط
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
                food_listings.quantity,
                food_listings.image_url,
                COALESCE(food_listings.price, 0.00) AS price,
                COALESCE(food_listings.original_price, 0.00) AS original_price
             FROM reservations 
             JOIN food_listings ON reservations.food_id = food_listings.id 
             WHERE reservations.receiver_id = $1 
               AND (reservations.status = 'pending' OR reservations.status IS NULL)
             ORDER BY reservations.reserved_at DESC`,
            [userId]
        );

        res.status(200).json(reservations.rows);
    } catch (err) {
        console.error('Fetch Reservations Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Laden der Reservierungen' });
    }
};

// 3. جلب جميع طلبات الحجز المؤكدة/المدفوعة الخاصة بالمطعم
const getDonorOrders = async (req, res) => {
    const { donorId } = req.params;

    try {
        const orders = await pool.query(
            `SELECT 
                reservations.id AS reservation_id,
                reservations.reserved_at,
                food_listings.id AS food_id,
                food_listings.title AS food_title,
                food_listings.description AS food_description,
                COALESCE(food_listings.price, 0.00) AS price,
                users.id AS customer_id,
                users.name AS customer_name,
                users.email AS customer_email
             FROM reservations
             JOIN food_listings ON reservations.food_id = food_listings.id
             JOIN users ON reservations.receiver_id = users.id
             WHERE food_listings.donor_id::text = $1::text
               AND reservations.status = 'confirmed'
             ORDER BY reservations.reserved_at DESC`,
            [donorId]
        );

        res.status(200).json(orders.rows);
    } catch (err) {
        console.error('Fetch Donor Orders Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Laden der Bestellungen' });
    }
};

// 4. إنهاء الشراء (تأكيد الطلب لنقله من سلة الزبون إلى طلبات المطعم)
const checkoutReservation = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("UPDATE reservations SET status = 'confirmed' WHERE id = $1", [id]);
        res.status(200).json({ message: 'Checkout erfolgreich abgeschlossen.' });
    } catch (err) {
        console.error('Checkout Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Checkout' });
    }
};

// 5. إلغاء/حذف حجز وتحديث حالة الطعام وإعادة الكمية للواجهة
const deleteReservation = async (req, res) => {
    const { id } = req.params;

    try {
        let reservationCheck = await pool.query('SELECT * FROM reservations WHERE id = $1', [id]);

        let reservation;
        if (reservationCheck.rows.length === 0) {
            const foodCheck = await pool.query('SELECT * FROM reservations WHERE food_id = $1 LIMIT 1', [id]);
            if (foodCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Reservierung nicht gefunden' });
            }
            reservation = foodCheck.rows[0];
        } else {
            reservation = reservationCheck.rows[0];
        }

        const reservation_id = reservation.id;
        const food_id = reservation.food_id;

        // حذف الحجز من الجدول
        await pool.query('DELETE FROM reservations WHERE id = $1', [reservation_id]);

        // جلب الوجبة لإعادة زيادة كميتها وتفعيلها بالواجهة
        const foodResult = await pool.query('SELECT quantity FROM food_listings WHERE id = $1', [food_id]);
        let currentQty = 0;
        if (foodResult.rows.length > 0) {
            currentQty = parseInt(String(foodResult.rows[0].quantity).replace(/\D/g, ''), 10) || 0;
        }

        const updatedQty = currentQty + 1;

        // إعادة ضبط الحالة إلى available والكمية إلى الرقم الجديد
        await pool.query(
            "UPDATE food_listings SET quantity = $1, status = 'available' WHERE id = $2",
            [updatedQty.toString(), food_id]
        );

        res.status(200).json({ message: 'Reservierung erfolgreich storniert.' });
    } catch (err) {
        console.error('Delete Reservation Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Stornieren der Reservierung' });
    }
};

module.exports = {
    createReservation,
    getUserReservations,
    getDonorOrders,
    checkoutReservation,
    deleteReservation
};