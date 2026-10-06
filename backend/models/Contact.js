const db = require('../config/db');

// نموذج للتعامل مع جدول رسائل التواصل باستخدام PostgreSQL
const Contact = {
  create: async (name, email, subject, message) => {
    const query = `
      INSERT INTO contact_messages (name, email, subject, message, is_archived)
      VALUES ($1, $2, $3, $4, FALSE)
      RETURNING *;
    `;
    const values = [name, email, subject || 'Allgemeine Anfrage', message];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  findAllActive: async () => {
    const result = await db.query(
      'SELECT * FROM contact_messages WHERE is_archived = FALSE OR is_archived IS NULL ORDER BY created_at DESC'
    );
    return result.rows;
  },

  findAllArchived: async () => {
    const result = await db.query(
      'SELECT * FROM contact_messages WHERE is_archived = TRUE ORDER BY created_at DESC'
    );
    return result.rows;
  },

  archive: async (id) => {
    await db.query('UPDATE contact_messages SET is_archived = TRUE WHERE id = $1', [id]);
  },

  unarchive: async (id) => {
    await db.query('UPDATE contact_messages SET is_archived = FALSE WHERE id = $1', [id]);
  },

  // دالة حذف رسالة نهائياً من قاعدة البيانات (جديد)
  delete: async (id) => {
    const result = await db.query('DELETE FROM contact_messages WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Contact;