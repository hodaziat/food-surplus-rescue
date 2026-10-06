const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// مسار إرسال وحفظ الرسالة
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Bitte füllen Sie alle Pflichtfelder aus.' });
    }

    const newContact = await Contact.create(name, email, subject, message);
    res.status(201).json({ message: 'Nachricht erfolgreich gespeichert!', contact: newContact });
  } catch (err) {
    console.error('Contact Create Error:', err.message);
    res.status(500).json({ message: 'Serverfehler beim Speichern.' });
  }
});

// مسار لجلب الرسائل النشطة
router.get(['/', '/messages'], async (req, res) => {
  try {
    const messages = await Contact.findAllActive();
    res.json(messages);
  } catch (err) {
    console.error('Contact Fetch Error:', err.message);
    res.status(500).json({ message: 'Fehler beim Laden.' });
  }
});

// مسار لجلب الرسائل المؤرشفة
router.get(['/archived', '/messages/archived'], async (req, res) => {
  try {
    const messages = await Contact.findAllArchived();
    res.json(messages);
  } catch (err) {
    console.error('Contact Fetch Archived Error:', err.message);
    res.status(500).json({ message: 'Fehler beim Laden der archivierten Nachrichten.' });
  }
});

// مسار لأرشفة رسالة
router.put(['/:id/archive', '/messages/:id/archive'], async (req, res) => {
  try {
    await Contact.archive(req.params.id);
    res.json({ message: 'Nachricht erfolgreich archiviert.' });
  } catch (err) {
    console.error('Contact Archive Error:', err.message);
    res.status(500).json({ message: 'Fehler beim Archivieren.' });
  }
});

// مسار لإلغاء أرشفة رسالة
router.put(['/:id/unarchive', '/messages/:id/unarchive'], async (req, res) => {
  try {
    await Contact.unarchive(req.params.id);
    res.json({ message: 'Nachricht aus dem Archiv geholt.' });
  } catch (err) {
    console.error('Contact Unarchive Error:', err.message);
    res.status(500).json({ message: 'Fehler beim Wiederherstellen.' });
  }
});

// مسار لحذف رسالة نهائياً (دعم /:id و /messages/:id) [جديد]
router.delete(['/:id', '/messages/:id'], async (req, res) => {
  try {
    const deleted = await Contact.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Nachricht nicht gefunden.' });
    }
    res.json({ message: 'Nachricht erfolgreich gelöscht.' });
  } catch (err) {
    console.error('Contact Delete Error:', err.message);
    res.status(500).json({ message: 'Fehler beim Löschen der Nachricht.' });
  }
});

module.exports = router;