// backend/controllers/specialRequestController.js
const db = require('../config/db');

exports.createSpecialRequest = async (req, res) => {
  try {
    const { organizationName, contactPerson, email, phone, requestedQuantity, eventDate, details } = req.body;

    // التحقق من الحقول الأساسية
    if (!organizationName || !contactPerson || !email || !requestedQuantity || !eventDate) {
      return res.status(400).json({ message: 'Bitte füllen Sie alle Pflichtfelder aus.' });
    }

    const query = `
      INSERT INTO special_requests (organization_name, contact_person, email, phone, requested_quantity, event_date, details)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [organizationName, contactPerson, email, phone || '', requestedQuantity, eventDate, details || ''];
    const newRequest = await db.query(query, values);

    console.log('Neue Sonderanfrage erhalten von:', organizationName);

    // الرد بنجاح للواجهة الأمامية
    res.status(201).json({
      success: true,
      message: 'Sonderanfrage erfolgreich gespeichert.',
      data: newRequest.rows[0]
    });
  } catch (error) {
    console.error('Fehler beim Speichern der Sonderanfrage:', error);
    res.status(500).json({ message: 'Serverfehler beim Verarbeiten der Anfrage.' });
  }
};