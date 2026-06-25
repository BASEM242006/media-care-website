// api/server.js – Express backend for Vercel Serverless Function & Local testing
require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { Twilio } = require('twilio');

const app = express();
app.use(express.static(process.cwd()));
const PORT = process.env.PORT || 3000;

// Serve index.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

app.use(cors());
app.use(bodyParser.json());

// Initialize Twilio client optionally (fallback to mock if credentials are missing)
const HAS_TWILIO = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER;
const twilioClient = HAS_TWILIO ? new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : null;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;

// Lead time (minutes) before the scheduled medication to send reminder
const REMINDER_LEAD_MINUTES = parseInt(process.env.REMINDER_LEAD_MINUTES || "15", 10);
const LEAD_TIME_MS = REMINDER_LEAD_MINUTES * 60 * 1000;

if (!HAS_TWILIO) {
  console.warn('⚠️ Warning: Twilio credentials not configured. Reminders will be printed to the console (MOCK mode).');
}

// Robust persistence with in-memory fallback for read-only serverless filesystems
let inMemoryReminders = [];
const remindersFile = path.join(process.cwd(), 'reminders.json');

function loadReminders() {
  try {
    if (fs.existsSync(remindersFile)) {
      const data = fs.readFileSync(remindersFile, 'utf8');
      const parsed = JSON.parse(data);
      // Ensure each reminder has a 'notified' flag (default false)
      inMemoryReminders = parsed.map(r => ({ ...r, notified: r.notified ?? false }));
    }
    return inMemoryReminders;
  } catch (e) {
    console.error('Failed to read reminders file, using in-memory list:', e.message);
    return inMemoryReminders;
  }
}

function saveReminders(list) {
  inMemoryReminders = list;
  try {
    fs.writeFileSync(remindersFile, JSON.stringify(list, null, 2));
  } catch (e) {
    console.warn('⚠️ Warning: File system is read-only. Reminders saved in-memory only.');
  }
}

// In‑memory map of scheduled timeouts
const scheduled = new Map();

function scheduleReminder(reminder) {
  const sendAt = new Date(reminder.datetime);
  const now = new Date();
  // Subtract lead time so reminder arrives before the medication time
  const delay = sendAt - now - LEAD_TIME_MS;
  if (delay <= 0) {
    // If already within lead window, send immediately
    sendSms(reminder);
    return;
  }
  const timeoutId = setTimeout(() => {
    sendSms(reminder);
    // Remove reminder after sending (or you could keep it with a 'sent' flag)
    const all = loadReminders().filter(r => r.id !== reminder.id);
    saveReminders(all);
    scheduled.delete(reminder.id);
  }, delay);
  scheduled.set(reminder.id, timeoutId);
}

const { sendSms: smsProviderSend } = require('../services/smsProvider');
const db = require('../db');
const config = require('../config');
const MAX_RETRIES = parseInt(process.env.MAX_SMS_RETRIES || '3', 10);

function recordSmsLog({ reminderId, userId, status, attempt, errorMessage }) {
  const stmt = `INSERT INTO sms_logs (reminder_id, user_id, status, attempt, error_message) VALUES (?, ?, ?, ?, ?)`;
  db.run(stmt, [reminderId, userId, status, attempt, errorMessage || null], (err) => {
    if (err) console.error('Failed to insert sms log:', err.message);
  });
}

async function attemptSendSms(reminder, attempt = 1) {
  const { name, phone, medicine, datetime, id, user_id } = reminder;
  const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
  const message = `مرحبا ${name},\nهذا تذكير بجرعة دوائك: ${medicine} في ${new Date(datetime).toLocaleString('ar-EG', { hour12: false })}.\nحافظ على صحتك!`;

  try {
    await smsProviderSend(formattedPhone, message);
    console.log('SMS sent, reminder ID:', id);
    recordSmsLog({ reminderId: id, userId: user_id, status: 'sent', attempt, errorMessage: null });
    // Mark reminder as notified
    db.run(`UPDATE reminders SET notified = 1 WHERE id = ?`, [id]);
  } catch (err) {
    console.error('SMS send error (attempt', attempt, '):', err.message);
    recordSmsLog({ reminderId: id, userId: user_id, status: 'failed', attempt, errorMessage: err.message });
    if (attempt < MAX_RETRIES) {
      const backoff = Math.min(60000 * Math.pow(2, attempt - 1), 15 * 60 * 1000); // exponential, max 15min
      setTimeout(() => attemptSendSms(reminder, attempt + 1), backoff);
    }
  }
}

function sendSms(reminder) {
  // Wrapper to start first attempt
  attemptSendSms(reminder, 1);
}

// Load existing reminders on startup and schedule them
loadReminders().forEach(scheduleReminder);

// ---------- Automatic notification cron ----------
// Runs every minute to check for upcoming reminders within lead time
cron.schedule('* * * * *', () => {
  const now = new Date();
  const reminders = loadReminders();
  reminders.forEach(rem => {
    if (!rem.notified) {
      const reminderTime = new Date(rem.datetime);
      const diff = reminderTime - now;
      if (diff <= LEAD_TIME_MS && diff > 0) {
        // Send SMS and mark as notified
        sendSms(rem);
        rem.notified = true;
        console.log(`✅ Reminder sent for ${rem.name} (ID: ${rem.id})`);
      }
    }
  });
  // Persist changes (notified flags)
  saveReminders(reminders);
});
loadReminders().forEach(scheduleReminder);

// API endpoint to receive new reminder
app.post('/api/reminders', (req, res) => {
  const { name, phone, medicine, datetime } = req.body;
  if (!name || !phone || !medicine || !datetime) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const reminder = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 8),
    name,
    phone,
    medicine,
    datetime,
    notified: false,
  };
  const list = loadReminders();
  list.push(reminder);
  saveReminders(list);
  scheduleReminder(reminder);
  res.json({ success: true, reminderId: reminder.id });
});

const adminRouter = require('./routes/admin');
app.use('/api/admin', adminRouter);
app.get('/api/reminders', (req, res) => {
  const list = loadReminders();
  res.json(list);
});

// Export app for Vercel
module.exports = { app, scheduleReminder, sendSms };

// Run listen only if run directly (local development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Reminder server listening on http://localhost:${PORT}`);
  });
}
