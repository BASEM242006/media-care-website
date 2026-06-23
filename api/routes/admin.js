// api/routes/admin.js
// Admin panel routes - protected by authGuard with admin role
const express = require('express');
const router = express.Router();
const db = require('../db');
const authGuard = require('../middleware/authGuard');

// Middleware to ensure admin access
router.use(authGuard({ requiredRole: 'admin' }));

// Get all reminders (optionally filter by user)
router.get('/reminders', (req, res) => {
  const { userId } = req.query;
  let query = 'SELECT * FROM reminders';
  const params = [];
  if (userId) {
    query += ' WHERE user_id = ?';
    params.push(userId);
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create a new reminder (admin can create for any user)
router.post('/reminders', (req, res) => {
  const { userId, title, message, scheduled_at } = req.body;
  if (!userId || !title || !message || !scheduled_at) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const id = Date.now().toString() + Math.random().toString(36).substring(2, 8);
  const stmt = `INSERT INTO reminders (id, user_id, title, message, scheduled_at, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`;
  db.run(stmt, [id, userId, title, message, scheduled_at], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, reminderId: id });
  });
});

// Delete a reminder by ID
router.delete('/reminders/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM reminders WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, changes: this.changes });
  });
});

// Get SMS logs (optionally filter by reminder or user)
router.get('/sms-logs', (req, res) => {
  const { reminderId, userId } = req.query;
  let query = 'SELECT * FROM sms_logs';
  const conditions = [];
  const params = [];
  if (reminderId) {
    conditions.push('reminder_id = ?');
    params.push(reminderId);
  }
  if (userId) {
    conditions.push('user_id = ?');
    params.push(userId);
  }
  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
