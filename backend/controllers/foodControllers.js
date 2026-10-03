const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

// 1. إضافة إعلان طعام جديد مع حفظ الفئة ومسار الصورة والأسعار
const createFoodListing = async (req, res) => {
    const { donor_id, title, category, description, quantity, expiration_date, price, original_price } = req.body;

    // أخذ مسار الصورة المرفوعة في حال وجودها
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const newListing = await pool.query(
            `INSERT INTO food_listings 
             (donor_id, title, category, description, quantity, expiration_date, image_url, price, original_price) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                donor_id, 
                title, 
                category || 'Sonstiges', // تعيين قيمة افتراضية في حال عدم التحديد
                description, 
                quantity, 
                expiration_date, 
                imageUrl, 
                price || 0, 
                original_price || 0
            ]
        );

        res.status(201).json({
            message: 'Food listing created successfully',
            listing: newListing.rows[0]
        });
    } catch (err) {
        console.error(err.message);
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

        res.status(200).json(listings.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error while fetching food listings' });
    }
};

// 3. تحديث إعلان طعام موجود مع تحديث الفئة والأسعار
const updateFoodListing = async (req, res) => {
    const { id } = req.params;
    const { title, category, description, quantity, expiration_date, price, original_price } = req.body;

    try {
        // جلب الوجبة الحالية للتأكد من وجودها ولمعرفة مسار الصورة القديمة
        const currentFood = await pool.query('SELECT image_url FROM food_listings WHERE id = $1', [id]);

        if (currentFood.rows.length === 0) {
            return res.status(404).json({ message: 'Food listing not found' });
        }

        let imageUrl = currentFood.rows[0].image_url;

        // إذا تم رفع صورة جديدة
        if (req.file) {
            // أ) حذف الصورة القديمة من الخادم إن وجدت
            if (imageUrl && imageUrl.startsWith('/uploads/')) {
                const oldFilePath = path.join(__dirname, '..', imageUrl);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            // ب) تعيين مسار الصورة الجديدة
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // تحديث البيانات والأسعار والفئة في قاعدة البيانات
        const updatedListing = await pool.query(
            `UPDATE food_listings 
             SET title = $1, category = $2, description = $3, quantity = $4, expiration_date = $5, image_url = $6, price = $7, original_price = $8 
             WHERE id = $9 RETURNING *`,
            [
                title, 
                category || 'Sonstiges',
                description, 
                quantity, 
                expiration_date, 
                imageUrl, 
                price || 0, 
                original_price || 0, 
                id
            ]
        );

        res.status(200).json({
            message: 'Food listing updated successfully',
            listing: updatedListing.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error while updating food listing' });
    }
};

// 4. حذف إعلان طعام مع حذف الصورة الفعلية من الخادم
const deleteFoodListing = async (req, res) => {
    const { id } = req.params;

    try {
        // أ) جلب الوجبة أولاً لمعرفة ما إذا كانت تحتوي على صورة مخزنة
        const foodResult = await pool.query('SELECT image_url FROM food_listings WHERE id = $1', [id]);

        if (foodResult.rows.length > 0) {
            const imageUrl = foodResult.rows[0].image_url;

            // ب) إذا كانت الصورة موجودة في مجلد uploads، يتم حذف الملف الفعلي من الخادم
            if (imageUrl && imageUrl.startsWith('/uploads/')) {
                const filePath = path.join(__dirname, '..', imageUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

        // ج) حذف الإعلان من قاعدة البيانات
        const deleteListing = await pool.query(
            'DELETE FROM food_listings WHERE id = $1 RETURNING *',
            [id]
        );

        if (deleteListing.rows.length === 0) {
            return res.status(404).json({ message: 'Food listing not found' });
        }

        res.status(200).json({ message: 'Food listing deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error while deleting food listing' });
    }
};

module.exports = {
    createFoodListing,
    getAllFoodListings,
    updateFoodListing,
    deleteFoodListing
};