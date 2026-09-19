const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 1. إضافة إعلان طعام جديد (Create Food Listing)
router.post('/add', async (req, res) => {
    const { donor_id, title, description, quantity, expiration_date } = req.body;

    try {
        const newListing = await pool.query(
            'INSERT INTO food_listings (donor_id, title, description, quantity, expiration_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [donor_id, title, description, quantity, expiration_date]
        );

        res.status(201).json({
            message: 'Food listing created successfully',
            listing: newListing.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while adding food listing' });
    }
});

// 2. جلب جميع الإعلانات المتاحة (Get All Available Food Listings)
router.get('/', async (req, res) => {
    try {
        const listings = await pool.query(
            `SELECT food_listings.*, users.name AS donor_name, users.email AS donor_email 
             FROM food_listings 
             JOIN users ON food_listings.donor_id = users.id 
             WHERE status = 'available' 
             ORDER BY created_at DESC`
        );

        res.json(listings.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while fetching food listings' });
    }
});

// 3. حذف إعلان طعام (Delete Food Listing - Admin Only)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteListing = await pool.query(
            'DELETE FROM food_listings WHERE id = $1 RETURNING *',
            [id]
        );

        if (deleteListing.rows.length === 0) {
            return res.status(404).json({ error: 'Food listing not found' });
        }

        res.json({ message: 'Food listing deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while deleting food listing' });
    }
});

module.exports = router;