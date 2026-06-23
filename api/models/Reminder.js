// api/models/Reminder.js
// SQLite Reminder model
const db = require('../db');
const crypto = require('crypto');

/** Generate a short unique ID */
function generateId() {
  return crypto.randomBytes(8).toString('hex');
}

/** Create a new reminder. Prevent duplicate via unique_hash */
function createReminder({ userId, title, message, scheduledAt }) {
  return new Promise((resolve, reject) => {
    const id = generateId();
    const uniqueHash = crypto.createHash('sha256').update(`${userId}|${title}|${scheduledAt}`).digest('hex');
    const stmt = `INSERT INTO reminders (id, user_id, title, message, scheduled_at, unique_hash) VALUES (?,?,?,?,?,?)`;
    db.run(stmt, [id, userId, title, message, scheduledAt, uniqueHash], function (err) {
      if (err) {
        // SQLite error code 19 is constraint violation (duplicate unique_hash)
        if (err && err.code === 'SQLITE_CONSTRAINT') {
          return reject(new Error('Duplicate reminder')); // will be caught upstream
        }
        return reject(err);
      }
      resolve({ id, userId, title, message, scheduledAt });
    });
  });
}

function findByUser(userId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM reminders WHERE user_id = ?', [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function findById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM reminders WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function deleteReminder(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM reminders WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

module.exports = { createReminder, findByUser, findById, deleteReminder };
