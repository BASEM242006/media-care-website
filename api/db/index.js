// api/db/index.js
// SQLite database connection and schema initialization

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Resolve the database file path (placed in the project root)
const DB_PATH = path.resolve(__dirname, '../../reminders.db');

// Create a singleton DB instance
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Failed to open SQLite DB:', err.message);
  } else {
    console.log('✅ SQLite DB opened at', DB_PATH);
    initSchema();
  }
});

// Initialize tables if they don't exist
function initSchema() {
  // Users table – stores hashed password and encrypted phone
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone_encrypted TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
    if (err) console.error('Error creating users table:', err.message);
  });

  // Reminders table – each reminder belongs to a user
  db.run(`
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      scheduled_at DATETIME NOT NULL,
      unique_hash TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`, (err) => {
    if (err) console.error('Error creating reminders table:', err.message);
  });

  // SMS logs table – tracks each send attempt
  db.run(`
    CREATE TABLE IF NOT EXISTS sms_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reminder_id TEXT,
      user_id INTEGER,
      status TEXT CHECK(status IN ('pending','sent','failed')) NOT NULL DEFAULT 'pending',
      attempt INTEGER NOT NULL DEFAULT 0,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(reminder_id) REFERENCES reminders(id) ON DELETE SET NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`, (err) => {
    if (err) console.error('Error creating sms_logs table:', err.message);
  });
}

module.exports = db;
