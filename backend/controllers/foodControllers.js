const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

// 1. إضافة إعلان طعام جديد مع حفظ الفئة ومسار الصورة والأسعار
const createFoodListing = async (req, res) => {
    const { donor_id, user_id, title, category, description, quantity, expiration_date, price, original_price } = req.body;

    // اعتماد donor_id أو user_id تلقائياً
    const finalDonorId = donor_id || user_id;

    if (!finalDonorId) {
        return res.status(400).json({ message: 'Donor ID is required' });
    }

    // تحويل الكمية إلى رقم آمن وصافٍ
    const parsedQuantity = parseInt(String(quantity).replace(/\D/g, ''), 10) || 1;

    // أخذ مسار الصورة المرفوعة في حال وجودها
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

// 2. جلب جميع الإعلانات المتاحة وغير المنتهية الصلاحية
const getAllFoodListings = async (req, res) => {
    try {
        const listings = await pool.query(
            `SELECT food_listings.*, users.name AS donor_name, users.email AS donor_email 
             FROM food_listings 
             JOIN users ON food_listings.donor_id = users.id 
             WHERE status = 'available' 
               AND expiration_date >= CURRENT_DATE 
             ORDER BY created_at DESC`
        );

        // تصفية الوجبات التي تحتوي على كمية أكبر من 0
        const availableListings = listings.rows.filter(item => {
            const qty = parseInt(String(item.quantity).replace(/\D/g, ''), 10);
            return !isNaN(qty) ? qty > 0 : true;
        });

        res.status(200).json(availableListings);
    } catch (err) {
        console.error('Fetch Listings Error:', err.message);
        res.status(500).json({ message: 'Server error while fetching food listings' });
    }
};

// 3. تحديث إعلان طعام موجود
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

// 4. حذف إعلان طعام مع حذف الحجوزات المرتبطة والصورة من الخادم
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

        // حذف الحجوزات المرتبطة أولاً تجنباً لمشاكل Foreign Key
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
    updateFoodListing,
    deleteFoodListing
};