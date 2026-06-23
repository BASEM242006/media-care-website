// api/models/User.js
// SQLite User model with helper methods
const db = require('../db');
const bcrypt = require('bcrypt');
const { encrypt, decrypt } = require('../utils/encryption');

const SALT_ROUNDS = 12;

/**
 * Creates a new user record.
 * @param {Object} data { name, email, phone (plain), password (plain), role }
 * @returns {Promise<Object>} created user (id, name, email, role)
 */
function createUser({ name, email, phone, password, role = 'user' }) {
  return new Promise((resolve, reject) => {
    // hash password and encrypt phone
    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if (err) return reject(err);
      const encryptedPhone = encrypt(phone);
      const stmt = `INSERT INTO users (name, email, phone_encrypted, password_hash, role) VALUES (?,?,?,?,?)`;
      db.run(stmt, [name, email, encryptedPhone, hash, role], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, name, email, role });
      });
    });
  });
}

/** Find a user by email */
function findByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

/** Find a user by id */
function findById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = { createUser, findByEmail, findById };
