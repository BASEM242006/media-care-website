// api/utils/phoneValidator.js
// Uses libphonenumber-js to validate international phone numbers

const { parsePhoneNumberFromString } = require('libphonenumber-js');

/**
 * Validate a phone number string.
 * Returns the E.164 formatted phone number if valid, otherwise throws.
 * @param {string} raw - user‑provided phone number (may include spaces, dashes, etc.)
 * @param {string} [defaultCountry] - optional default country code (e.g., 'SA' for Saudi Arabia)
 * @returns {string} E.164 formatted number (e.g., +966123456789)
 */
function validatePhone(raw, defaultCountry = undefined) {
  const phone = parsePhoneNumberFromString(raw, defaultCountry);
  if (!phone || !phone.isValid()) {
    throw new Error('Invalid phone number format');
  }
  return phone.number; // already in E.164 format
}

module.exports = { validatePhone };
