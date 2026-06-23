// api/config.js
// Centralized configuration loaded from .env
require('dotenv').config();

module.exports = {
  // JWT secret for auth tokens (should be a strong random string)
  jwtSecret: process.env.JWT_SECRET || 'CHANGE_ME_TO_STRONG_SECRET',
  // 32‑byte base64 encryption key for phone numbers
  encryptionKey: process.env.ENCRYPTION_KEY,
  // Twilio credentials (optional – mock provider used if missing)
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER,
  },
  // How many minutes before the scheduled time to send the reminder
  reminderLeadMinutes: parseInt(process.env.REMINDER_LEAD_MINUTES || '15', 10),
  // Maximum retry attempts for failed SMS sends
  maxSmsRetries: parseInt(process.env.MAX_SMS_RETRIES || '3', 10),
};
