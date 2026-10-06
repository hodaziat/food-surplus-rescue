const db = require('../config/db');

// 1. إنشاء طلب خاص جديد
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

// 2. جلب جميع الطلبات الخاصة (للأدمن)
exports.getAllSpecialRequests = async (req, res) => {
  try {
    const query = 'SELECT * FROM special_requests ORDER BY created_at DESC';
    const requests = await db.query(query);

    res.status(200).json(requests.rows);
  } catch (error) {
    console.error('Fehler beim Laden der Sonderanfragen:', error);
    res.status(500).json({ message: 'Serverfehler beim Laden der Anfragen.' });
  }
};

// 3. حذف طلب خاص
exports.deleteSpecialRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM special_requests WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sonderanfrage nicht gefunden.' });
    }

    res.status(200).json({ message: 'Sonderanfrage erfolgreich gelöscht.' });
  } catch (error) {
    console.error('Fehler beim Löschen der Sonderanfrage:', error);
    res.status(500).json({ message: 'Serverfehler beim Löschen der Anfrage.' });
  }
};