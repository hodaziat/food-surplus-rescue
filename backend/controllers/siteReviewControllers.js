const pool = require('../config/db');

// 1. إضافة أو تحديث تقييم الموقع (منع التكرار لنفس المستخدم)
const addSiteReview = async (req, res) => {
    const { user_id, rating, comment } = req.body;

    if (!user_id || !rating) {
        return res.status(400).json({ error: 'User ID und Bewertung (Sterne) sind erforderlich.' });
    }

    try {
        const existingReview = await pool.query(
            'SELECT * FROM site_reviews WHERE user_id = $1',
            [user_id]
        );

        if (existingReview.rows.length > 0) {
            const updatedReview = await pool.query(
                `UPDATE site_reviews 
                 SET rating = $1, comment = $2, created_at = CURRENT_TIMESTAMP 
                 WHERE user_id = $3 RETURNING *`,
                [rating, comment, user_id]
            );

            return res.status(200).json({
                message: 'Ihre Bewertung wurde erfolgreich aktualisiert! ⭐',
                review: updatedReview.rows[0]
            });
        }

        const newReview = await pool.query(
            `INSERT INTO site_reviews (user_id, rating, comment) 
             VALUES ($1, $2, $3) RETURNING *`,
            [user_id, rating, comment]
        );

        res.status(201).json({
            message: 'Vielen Dank für Ihre Bewertung!',
            review: newReview.rows[0]
        });
    } catch (err) {
        console.error('Add Site Review Error:', err.message);
        res.status(500).json({ error: 'Serverfehler beim Speichern der Bewertung.' });
    }
};

// 2. جلب جميع تقييمات الموقع مع حساب المتوسط واسم المستخدم وصاحب التقييم
const getSiteReviews = async (req, res) => {
    try {
        const reviews = await pool.query(
            `SELECT 
                site_reviews.id,
                site_reviews.user_id,
                site_reviews.rating,
                site_reviews.comment,
                site_reviews.created_at,
                users.name AS user_name
             FROM site_reviews
             JOIN users ON site_reviews.user_id = users.id
             ORDER BY site_reviews.created_at DESC`
        );

        const avgResult = await pool.query(
            `SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS total_reviews FROM site_reviews`
        );

        res.json({
            reviews: reviews.rows,
            average_rating: avgResult.rows[0].average_rating || 0,
            total_reviews: avgResult.rows[0].total_reviews || 0
        });
    } catch (err) {
        console.error('Get Site Reviews Error:', err.message);
        res.status(500).json({ error: 'Serverfehler beim Laden der Bewertungen.' });
    }
};

// 3. حذف تقييم الموقع
const deleteSiteReview = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM site_reviews WHERE id = $1', [id]);
        res.json({ message: 'Bewertung erfolgreich gelöscht!' });
    } catch (err) {
        console.error('Delete Site Review Error:', err.message);
        res.status(500).json({ error: 'Serverfehler beim Löschen der Bewertung.' });
    }
};

module.exports = {
    addSiteReview,
    getSiteReviews,
    deleteSiteReview
};