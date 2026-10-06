const pool = require('../config/db');

// إضافة أو تحديث تقييم لمطعم/متبرع معين
const addDonorReview = async (req, res) => {
    const { donor_id, reviewer_id, rating, comment } = req.body;

    if (!donor_id || !reviewer_id || !rating) {
        return res.status(400).json({ message: 'Donor ID, Reviewer ID und Rating sind erforderlich.' });
    }

    if (parseInt(donor_id, 10) === parseInt(reviewer_id, 10)) {
        return res.status(400).json({ message: 'Sie können sich nicht selbst bewerten.' });
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
        res.status(500).json({ message: 'Serverfehler beim Speichern der Bewertung.' });
    }
};

// جلب تقييمات مطعم معّين ومتوسط التقييم مع الردود
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
                donor_reviews.reply,
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

        res.status(200).json({
            reviews: reviews.rows,
            average_rating: avgResult.rows[0].average_rating || 0,
            total_reviews: avgResult.rows[0].total_reviews || 0
        });
    } catch (err) {
        console.error('Get Donor Reviews Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Laden der Bewertungen.' });
    }
};

// جلب متوسط تقييم المطعم فقط (مفيد للبطاقات كـ FoodCard)
const getDonorAverageRating = async (req, res) => {
    const { donorId } = req.params;

    try {
        const avgResult = await pool.query(
            `SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS total_reviews 
             FROM donor_reviews WHERE donor_id = $1`,
            [donorId]
        );

        res.status(200).json({
            average_rating: avgResult.rows[0].average_rating || 0,
            total_reviews: avgResult.rows[0].total_reviews || 0
        });
    } catch (err) {
        console.error('Get Donor Average Rating Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Laden der Bewertung.' });
    }
};

// جلب جميع تقييمات المطاعم للأدمن
const getAllDonorReviews = async (req, res) => {
    try {
        const reviews = await pool.query(
            `SELECT 
                donor_reviews.id,
                donor_reviews.donor_id,
                donor_reviews.reviewer_id,
                donor_reviews.rating,
                donor_reviews.comment,
                donor_reviews.reply,
                donor_reviews.created_at,
                u1.name AS reviewer_name,
                u2.name AS donor_name
             FROM donor_reviews
             JOIN users u1 ON donor_reviews.reviewer_id = u1.id
             JOIN users u2 ON donor_reviews.donor_id = u2.id
             ORDER BY donor_reviews.created_at DESC`
        );

        res.status(200).json({
            reviews: reviews.rows
        });
    } catch (err) {
        console.error('Get All Donor Reviews Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Laden aller Bewertungen.' });
    }
};

// حذف تقييم مطعم
const deleteDonorReview = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM donor_reviews WHERE id = $1', [id]);
        res.status(200).json({ message: 'Bewertung erfolgreich gelöscht!' });
    } catch (err) {
        console.error('Delete Donor Review Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Löschen der Bewertung.' });
    }
};

// رد صاحب المطعم على التقييم الخاص بمطعمه فقط
const replyToDonorReview = async (req, res) => {
    const { reviewId } = req.params;
    const { donor_id, reply } = req.body;

    if (!reply || !donor_id) {
        return res.status(400).json({ message: 'Antwort und Donor ID sind erforderlich.' });
    }

    try {
        const checkReview = await pool.query(
            'SELECT * FROM donor_reviews WHERE id = $1 AND donor_id = $2',
            [reviewId, donor_id]
        );

        if (checkReview.rows.length === 0) {
            return res.status(403).json({ 
                message: 'Nicht autorisiert: Sie können nur auf Bewertungen Ihres eigenen Restaurants antworten.' 
            });
        }

        const updatedReview = await pool.query(
            `UPDATE donor_reviews 
             SET reply = $1 
             WHERE id = $2 AND donor_id = $3 RETURNING *`,
            [reply, reviewId, donor_id]
        );

        res.status(200).json({ 
            message: 'Antwort erfolgreich gespeichert!', 
            review: updatedReview.rows[0] 
        });

    } catch (err) {
        console.error('Reply Review Error:', err.message);
        res.status(500).json({ message: 'Serverfehler beim Speichern der Antwort.' });
    }
};

module.exports = {
    addDonorReview,
    getDonorReviews,
    getDonorAverageRating,
    deleteDonorReview,
    replyToDonorReview,
    getAllDonorReviews
};