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

        // حساب الحجوزات المعلقة للآخرين
        const pendingRes = await pool.query(
            `SELECT COUNT(*) FROM reservations 
             WHERE food_id = $1 
               AND (status = 'pending' OR status IS NULL)
               AND receiver_id != $2`,
            [food_id, receiver_id]
        );
        const otherPendingCount = parseInt(pendingRes.rows[0].count, 10) || 0;

        // حساب الحجوزات في سلة المستخدم الحالية
        const userCartRes = await pool.query(
            `SELECT COUNT(*) FROM reservations 
             WHERE food_id = $1 
               AND receiver_id = $2
               AND (status = 'pending' OR status IS NULL)`,
            [food_id, receiver_id]
        );
        const userCartCount = parseInt(userCartRes.rows[0].count, 10) || 0;

        if (totalQty <= 0 || (userCartCount + otherPendingCount) >= totalQty) {
            return res.status(400).json({ message: 'Leider sind keine weiteren Portionen verfügbar.' });
        }

        const finalDonation = donation_amount ? parseFloat(donation_amount) : 0.00;

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

// 2. جلب جميع حجوزات وطلبات المستخدم مع حساب الكمية المتاحة
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
                COALESCE(NULLIF(REGEXP_REPLACE(food_listings.quantity::text, '[^0-9]', '', 'g'), ''), '0')::INTEGER AS total_quantity,
                
                GREATEST(0, (
                  COALESCE(NULLIF(REGEXP_REPLACE(food_listings.quantity::text, '[^0-9]', '', 'g'), ''), '0')::INTEGER - 
                  (
                    SELECT COUNT(*) 
                    FROM reservations r2 
                    WHERE r2.food_id = food_listings.id 
                      AND (r2.status = 'pending' OR r2.status IS NULL)
                      AND r2.receiver_id != $1::INTEGER
                  )
                )) AS available_quantity,

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

// 4. إنهاء الشراء وتأكيد الطلب (معدلة خصيصاً لمنع أخطاء الخصم المزدوج)
const checkoutReservation = async (req, res) => {
    const { id } = req.params;

    try {
        const resCheck = await pool.query('SELECT food_id, status FROM reservations WHERE id = $1', [id]);
        
        if (resCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Reservierung nicht gefunden' });
        }

        const food_id = resCheck.rows[0].food_id;

        if (resCheck.rows[0].status !== 'confirmed') {
            // أ. تغيير حالة الحجز إلى مؤكد
            await pool.query("UPDATE reservations SET status = 'confirmed' WHERE id = $1", [id]);

            // ب. خصم واحد مباشر ومضمون في قاعدة البيانات
            await pool.query(
                `UPDATE food_listings 
                 SET quantity = GREATEST(0, (COALESCE(NULLIF(REGEXP_REPLACE(quantity::text, '[^0-9]', '', 'g'), ''), '0')::INTEGER - 1))::text,
                     status = CASE 
                         WHEN (COALESCE(NULLIF(REGEXP_REPLACE(quantity::text, '[^0-9]', '', 'g'), ''), '0')::INTEGER - 1) <= 0 THEN 'reserved' 
                         ELSE 'available' 
                     END
                 WHERE id = $1`,
                [food_id]
            );
        }

        const updatedRes = await pool.query(
            `SELECT reservations.*, food_listings.title, food_listings.price 
             FROM reservations 
             JOIN food_listings ON reservations.food_id = food_listings.id 
             WHERE reservations.id = $1`,
            [id]
        );

        res.status(200).json({ 
            message: 'Checkout erfolgreich abgeschlossen.',
            reservation: updatedRes.rows[0]
        });
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
            await pool.query(
                `UPDATE food_listings 
                 SET quantity = (COALESCE(NULLIF(REGEXP_REPLACE(quantity::text, '[^0-9]', '', 'g'), ''), '0')::INTEGER + 1)::text,
                     status = 'available'
                 WHERE id = $1`,
                [food_id]
            );
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