const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

// 1. إنشاء إعلان طعام جديد
const createFoodListing = async (req, res) => {
    const { donor_id, user_id, title, category, description, quantity, expiration_date, price, original_price } = req.body;

    const finalDonorId = donor_id || user_id;

    if (!finalDonorId) {
        return res.status(400).json({ message: 'Donor ID is required' });
    }

    const parsedQuantity = parseInt(String(quantity).replace(/\D/g, ''), 10) || 1;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const newListing = await pool.query(
            `INSERT INTO food_listings 
             (donor_id, title, category, description, quantity, expiration_date, image_url, price, original_price, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                finalDonorId, 
                title, 
                category || 'Sonstiges', 
                description, 
                parsedQuantity.toString(), 
                expiration_date, 
                imageUrl, 
                price || 0, 
                original_price || 0,
                'available'
            ]
        );

        res.status(201).json({
            message: 'Food listing created successfully',
            listing: newListing.rows[0]
        });
    } catch (err) {
        console.error('Create Listing Error:', err.message);
        res.status(500).json({ message: 'Server error while adding food listing' });
    }
};

// 2. جلب جميع الإعلانات وحساب الكمية المتاحة الدقيقة (معدل)
const getAllFoodListings = async (req, res) => {
    const { userId } = req.query; // يستقبل رقم المستخدم إن وجد

    try {
        // أ. تنظيف الوجبات المنتهية الصلاحية التي لم تُشترَ
        const expiredItems = await pool.query(
            `SELECT id, image_url FROM food_listings 
             WHERE expiration_date < NOW() 
               AND id NOT IN (
                   SELECT DISTINCT food_id FROM reservations WHERE status = 'confirmed'
               )`
        );

        if (expiredItems.rows.length > 0) {
            for (const item of expiredItems.rows) {
                if (item.image_url && item.image_url.startsWith('/uploads/')) {
                    const filePath = path.join(__dirname, '..', item.image_url);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            }

            const expiredIds = expiredItems.rows.map(item => item.id);

            await pool.query(
                `DELETE FROM reservations WHERE food_id = ANY($1::int[]) AND (status = 'pending' OR status IS NULL)`,
                [expiredIds]
            );

            await pool.query(
                `DELETE FROM food_listings WHERE id = ANY($1::int[])`,
                [expiredIds]
            );
        }

        // ب. جلب الوجبات وحساب الحجوزات المعلقة للآخرين فقط
        const listings = await pool.query(
            `SELECT food_listings.*, 
                    users.name AS donor_name, 
                    users.email AS donor_email,
                    COALESCE((
                        SELECT COUNT(*) 
                        FROM reservations 
                        WHERE reservations.food_id = food_listings.id 
                          AND (reservations.status = 'pending' OR reservations.status IS NULL)
                          AND ($1::int IS NULL OR reservations.receiver_id != $1::int)
                    ), 0) AS other_pending_reservations
             FROM food_listings 
             JOIN users ON food_listings.donor_id = users.id 
             WHERE food_listings.expiration_date >= NOW() 
             ORDER BY food_listings.created_at DESC`,
            [userId ? parseInt(userId, 10) : null]
        );

        const availableListings = listings.rows.map(item => {
            const totalQty = parseInt(String(item.quantity).replace(/\D/g, ''), 10) || 0;
            const otherPendingQty = parseInt(item.other_pending_reservations, 10) || 0;
            
            // المتاح الفلي لك = الإجمالي مطروح منه ما حجزه المستخدمون الآخرون فقط
            const availableQty = Math.max(0, totalQty - otherPendingQty);

            return {
                ...item,
                available_quantity: availableQty
            };
        });

        res.status(200).json(availableListings);
    } catch (err) {
        console.error('Fetch Listings Error:', err.message);
        res.status(500).json({ message: 'Server error while fetching food listings' });
    }
};

// 3. جلب عنصر طعام واحد برقم الـ ID
const getFoodListingById = async (req, res) => {
    const { id } = req.params;

    try {
        const listing = await pool.query(
            `SELECT food_listings.*, 
                    users.name AS donor_name, 
                    users.email AS donor_email
             FROM food_listings 
             LEFT JOIN users ON food_listings.donor_id = users.id 
             WHERE food_listings.id = $1`,
            [id]
        );

        if (listing.rows.length === 0) {
            return res.status(404).json({ message: 'Food listing not found' });
        }

        res.status(200).json(listing.rows[0]);
    } catch (err) {
        console.error('Fetch Single Listing Error:', err.message);
        res.status(500).json({ message: 'Server error while fetching single food listing' });
    }
};

// 4. تحديث إعلان طعام
const updateFoodListing = async (req, res) => {
    const { id } = req.params;
    const { title, category, description, quantity, expiration_date, price, original_price } = req.body;

    try {
        const currentFood = await pool.query('SELECT image_url FROM food_listings WHERE id = $1', [id]);

        if (currentFood.rows.length === 0) {
            return res.status(404).json({ message: 'Food listing not found' });
        }

        let imageUrl = currentFood.rows[0].image_url;

        if (req.file) {
            if (imageUrl && imageUrl.startsWith('/uploads/')) {
                const oldFilePath = path.join(__dirname, '..', imageUrl);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const parsedQuantity = parseInt(String(quantity).replace(/\D/g, ''), 10) || 0;
        const newStatus = parsedQuantity <= 0 ? 'unavailable' : 'available';

        const updatedListing = await pool.query(
            `UPDATE food_listings 
             SET title = $1, category = $2, description = $3, quantity = $4, expiration_date = $5, image_url = $6, price = $7, original_price = $8, status = $9 
             WHERE id = $10 RETURNING *`,
            [
                title, 
                category || 'Sonstiges',
                description, 
                parsedQuantity.toString(), 
                expiration_date, 
                imageUrl, 
                price || 0, 
                original_price || 0, 
                newStatus,
                id
            ]
        );

        res.status(200).json({
            message: 'Food listing updated successfully',
            listing: updatedListing.rows[0]
        });
    } catch (err) {
        console.error('Update Listing Error:', err.message);
        res.status(500).json({ message: 'Server error while updating food listing' });
    }
};

// 5. حذف إعلان طعام
const deleteFoodListing = async (req, res) => {
    const { id } = req.params;

    try {
        const foodResult = await pool.query('SELECT image_url FROM food_listings WHERE id = $1', [id]);

        if (foodResult.rows.length > 0) {
            const imageUrl = foodResult.rows[0].image_url;

            if (imageUrl && imageUrl.startsWith('/uploads/')) {
                const filePath = path.join(__dirname, '..', imageUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

        await pool.query('DELETE FROM reservations WHERE food_id = $1', [id]);

        const deleteListing = await pool.query(
            'DELETE FROM food_listings WHERE id = $1 RETURNING *',
            [id]
        );

        if (deleteListing.rows.length === 0) {
            return res.status(404).json({ message: 'Food listing not found' });
        }

        res.status(200).json({ message: 'Food listing deleted successfully' });
    } catch (err) {
        console.error('Delete Listing Error:', err.message);
        res.status(500).json({ message: 'Server error while deleting food listing' });
    }
};

module.exports = {
    createFoodListing,
    getAllFoodListings,
    getFoodListingById,
    updateFoodListing,
    deleteFoodListing
};