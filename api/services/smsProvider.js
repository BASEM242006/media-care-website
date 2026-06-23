// api/services/smsProvider.js

// Abstract base class for SMS providers
class SmsProvider {
  /**
   * Send an SMS message.
   * @param {string} to - Destination phone number in E.164 format.
   * @param {string} body - Message body.
   * @returns {Promise<void>}
   */
  async send(to, body) {
    throw new Error('send() not implemented');
  }
}

// Twilio implementation
const { Twilio } = require('twilio');
const config = require('../config');

class TwilioProvider extends SmsProvider {
  constructor() {
    super();
    if (config.HAS_TWILIO) {
      this.client = new Twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
    } else {
      this.client = null;
    }
    this.from = config.TWILIO_FROM_NUMBER;
  }

  async send(to, body) {
    if (!this.client) {
      console.warn('⚠️ Twilio not configured – mock SMS');
      console.log(`🛑 [MOCK SMS] To: ${to}\nMessage: ${body}`);
      return;
    }
    return this.client.messages.create({ from: this.from, to, body });
  }
}

// Mock implementation (useful for development/test environments)
class MockProvider extends SmsProvider {
  async send(to, body) {
    console.log(`🛑 [MOCK SMS] To: ${to}\nMessage: ${body}`);
    return;
  }
}

module.exports = {
  SmsProvider,
  TwilioProvider,
  MockProvider,
};
