const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// مسار إرسال وحفظ الرسالة
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    res.status(201).json({ message: 'Nachricht erfolgreich gespeichert!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serverfehler beim Speichern.' });
  }
});

// مسار لجلب الرسائل (لوحة التحكم)
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Laden.' });
  }
});

module.exports = router;