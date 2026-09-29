const pool = require('../config/db');

// إضافة أو تحديث تقييم لمطعم/متبرع معين
const addDonorReview = async (req, res) => {
    const { donor_id, reviewer_id, rating, comment } = req.body;

    if (!donor_id || !reviewer_id || !rating) {
        return res.status(400).json({ error: 'Donor ID, Reviewer ID und Rating sind erforderlich.' });
    }

    if (parseInt(donor_id) === parseInt(reviewer_id)) {
        return res.status(400).json({ error: 'Sie können sich nicht selbst bewerten.' });
    }

    try {
        const existingReview = await pool.query(
            'SELECT * FROM donor_reviews WHERE donor_id = $1 AND reviewer_id = $2',
            [donor_id, reviewer_id]
        );

        if (existingReview.rows.length > 0) {
            const updated = await pool.query(
                `UPDATE donor_reviews 
                 SET rating = $1, comment = $2, created_at = CURRENT_TIMESTAMP 
                 WHERE donor_id = $3 AND reviewer_id = $4 RETURNING *`,
                [rating, comment, donor_id, reviewer_id]
            );
            return res.status(200).json({ message: 'Bewertung aktualisiert!', review: updated.rows[0] });
        }

        const newReview = await pool.query(
            `INSERT INTO donor_reviews (donor_id, reviewer_id, rating, comment) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [donor_id, reviewer_id, rating, comment]
        );

        res.status(201).json({ message: 'Bewertung erfolgreich gespeichert!', review: newReview.rows[0] });
    } catch (err) {
        console.error('Donor Review Error:', err.message);
        res.status(500).json({ error: 'Serverfehler beim Speichern der Bewertung.' });
    }
};

// جلب تقييمات مطعم معّين ومتوسط التقييم
const getDonorReviews = async (req, res) => {
    const { donorId } = req.params;

    try {
        const reviews = await pool.query(
            `SELECT 
                donor_reviews.id,
                donor_reviews.donor_id,
                donor_reviews.reviewer_id,
                donor_reviews.rating,
                donor_reviews.comment,
                donor_reviews.created_at,
                users.name AS reviewer_name
             FROM donor_reviews
             JOIN users ON donor_reviews.reviewer_id = users.id
             WHERE donor_reviews.donor_id = $1
             ORDER BY donor_reviews.created_at DESC`,
            [donorId]
        );

        const avgResult = await pool.query(
            `SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS total_reviews 
             FROM donor_reviews WHERE donor_id = $1`,
            [donorId]
        );

        res.json({
            reviews: reviews.rows,
            average_rating: avgResult.rows[0].average_rating || 0,
            total_reviews: avgResult.rows[0].total_reviews || 0
        });
    } catch (err) {
        console.error('Get Donor Reviews Error:', err.message);
        res.status(500).json({ error: 'Serverfehler beim Laden der Bewertungen.' });
    }
};

// حذف تقييم مطعم
const deleteDonorReview = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM donor_reviews WHERE id = $1', [id]);
        res.json({ message: 'Bewertung erfolgreich gelöscht!' });
    } catch (err) {
        console.error('Delete Donor Review Error:', err.message);
        res.status(500).json({ error: 'Serverfehler beim Löschen der Bewertung.' });
    }
};

module.exports = {
    addDonorReview,
    getDonorReviews,
    deleteDonorReview
};