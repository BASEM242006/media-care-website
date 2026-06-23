// api/utils/encryption.js
// Simple AES‑256‑GCM encryption for sensitive fields (e.g., phone numbers)
// ENCRYPTION_KEY must be a 32‑byte (256‑bit) base64 string set in .env

const crypto = require('crypto');

function getKey() {
  const keyB64 = process.env.ENCRYPTION_KEY;
  if (!keyB64) {
    throw new Error('ENCRYPTION_KEY is not set in environment');
  }
  // Accept base64 or hex; default to base64
  let key;
  try {
    key = Buffer.from(keyB64, 'base64');
    if (key.length !== 32) throw new Error();
  } catch (_) {
    // Fallback to hex
    key = Buffer.from(keyB64, 'hex');
    if (key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be 32 bytes (base64 or hex)');
    }
  }
  return key;
}

/**
 * Encrypt a UTF‑8 string and return a base64 payload containing iv + ciphertext + authTag.
 * @param {string} plaintext
 * @returns {string} base64 payload
 */
function encrypt(plaintext) {
  const key = getKey();
  const iv = crypto.randomBytes(12); // GCM recommended 96‑bit IV
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Payload layout: iv(12) | authTag(16) | ciphertext
  const payload = Buffer.concat([iv, authTag, ciphertext]);
  return payload.toString('base64');
}

/**
 * Decrypt a base64 payload produced by encrypt().
 * @param {string} payloadB64
 * @returns {string} plaintext
 */
function decrypt(payloadB64) {
  const key = getKey();
  const payload = Buffer.from(payloadB64, 'base64');
  const iv = payload.slice(0, 12);
  const authTag = payload.slice(12, 28);
  const ciphertext = payload.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  return plaintext;
}

module.exports = { encrypt, decrypt };
