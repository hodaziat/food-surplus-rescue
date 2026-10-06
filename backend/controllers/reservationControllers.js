const pool = require('../config/db');

// 1. إضافة حجز جديد بالسلة (مع دعم التبرع الاختياري)
const createReservation = async (req, res) => {
    const { food_id, receiver_id, donation_amount } = req.body;

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

        const totalQty = parseInt(String(foodItem.quantity).replace(/\D/g, ''), 10) || 0;

        // حساب عدد الحجوزات المعلقة بالسلة لهذه الوجبة
        const pendingRes = await pool.query(
            "SELECT COUNT(*) FROM reservations WHERE food_id = $1 AND (status = 'pending' OR status IS NULL)",
            [food_id]
        );
        const pendingCount = parseInt(pendingRes.rows[0].count, 10) || 0;

        if (pendingCount >= totalQty) {
            return res.status(400).json({ message: 'Leider sind keine weiteren Portionen verfügbar.' });
        }

        // تحديد قيمة التبرع (إذا وُجدت، أو 0.00 افتراضياً)
        const finalDonation = donation_amount ? parseFloat(donation_amount) : 0.00;

        // إنشاء الحجز بحالة 'pending' مع قيمة التبرع
        const newReservation = await pool.query(
            "INSERT INTO reservations (food_id, receiver_id, status, donation_amount) VALUES ($1, $2, 'pending', $3) RETURNING *",
            [food_id, receiver_id, finalDonation]
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

// 2. جلب جميع حجوزات وطلبات المستخدم
const getUserReservations = async (req, res) => {
    const { userId } = req.params;

    try {
        const reservations = await pool.query(
            `SELECT 
                reservations.id AS id,
                reservations.id AS reservation_id,
                reservations.food_id,
                reservations.receiver_id,
                reservations.status,
                reservations.reserved_at,
                reservations.donation_amount,
                food_listings.title, 
                food_listings.description, 
                food_listings.quantity AS total_quantity,
                food_listings.image_url,
                food_listings.expiration_date,
                COALESCE(food_listings.price, 0.00) AS price,
                COALESCE(food_listings.original_price, 0.00) AS original_price
             FROM reservations 
             JOIN food_listings ON reservations.food_id = food_listings.id 
             WHERE reservations.receiver_id = $1 
             ORDER BY reservations.reserved_at DESC`,
            [userId]
        );

        res.status(200).json(reservations.rows);
    } catch (err) {
        console.error('Fetch Reservations Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Laden der Reservierungen' });
    }
};

// 3. جلب جميع طلبات المتبرع / المطعم المؤكدة
const getDonorOrders = async (req, res) => {
    const { donorId } = req.params;

    try {
        const orders = await pool.query(
            `SELECT 
                reservations.id AS reservation_id,
                reservations.reserved_at,
                reservations.donation_amount,
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

// 4. إنهاء الشراء وتأكيد الطلب (تمت معالجة قيد قاعدة البيانات هنا)
const checkoutReservation = async (req, res) => {
    const { id } = req.params;

    try {
        const resCheck = await pool.query('SELECT food_id, status FROM reservations WHERE id = $1', [id]);
        
        if (resCheck.rows.length > 0 && resCheck.rows[0].status !== 'confirmed') {
            const food_id = resCheck.rows[0].food_id;

            await pool.query("UPDATE reservations SET status = 'confirmed' WHERE id = $1", [id]);

            const foodRes = await pool.query('SELECT quantity FROM food_listings WHERE id = $1', [food_id]);
            if (foodRes.rows.length > 0) {
                const currentQty = parseInt(String(foodRes.rows[0].quantity).replace(/\D/g, ''), 10) || 0;
                const newQty = Math.max(0, currentQty - 1);
                
                // تم التغيير إلى 'reserved' بدلاً من 'unavailable' لكي يتقبلها constraint قاعدة البيانات
                const newStatus = newQty <= 0 ? 'reserved' : 'available';

                await pool.query(
                    'UPDATE food_listings SET quantity = $1, status = $2 WHERE id = $3',
                    [newQty.toString(), newStatus, food_id]
                );
            }
        }

        res.status(200).json({ message: 'Checkout erfolgreich abgeschlossen.' });
    } catch (err) {
        console.error('Checkout Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Checkout' });
    }
};

// 5. حذف حجز أو إلغاؤه
const deleteReservation = async (req, res) => {
    const { id } = req.params;

    try {
        const reservationCheck = await pool.query('SELECT * FROM reservations WHERE id = $1', [id]);

        if (reservationCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Reservierung nicht gefunden' });
        }

        const reservation = reservationCheck.rows[0];
        const food_id = reservation.food_id;
        const isConfirmed = reservation.status === 'confirmed';

        await pool.query('DELETE FROM reservations WHERE id = $1', [id]);

        if (isConfirmed) {
            const foodResult = await pool.query('SELECT quantity FROM food_listings WHERE id = $1', [food_id]);
            
            if (foodResult.rows.length > 0) {
                const currentQty = parseInt(String(foodResult.rows[0].quantity).replace(/\D/g, ''), 10) || 0;
                const updatedQty = currentQty + 1;

                await pool.query(
                    "UPDATE food_listings SET quantity = $1, status = 'available' WHERE id = $2",
                    [updatedQty.toString(), food_id]
                );
            }
        }

        res.status(200).json({ message: 'Reservierung erfolgreich storniert und Menge aktualisiert.' });
    } catch (err) {
        console.error('Delete Reservation Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Stornieren der Reservierung' });
    }
};

exports.createReservation = createReservation;
exports.getUserReservations = getUserReservations;
exports.getDonorOrders = getDonorOrders;
exports.checkoutReservation = checkoutReservation;
exports.deleteReservation = deleteReservation;