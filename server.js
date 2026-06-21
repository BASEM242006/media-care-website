// server.js – Simple Express backend for medication reminders

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { Twilio } = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.')));


// Initialize Twilio client optionally (fallback to mock if credentials are missing)
const HAS_TWILIO = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER;
const twilioClient = HAS_TWILIO ? new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : null;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;

if (!HAS_TWILIO) {
  console.warn('⚠️ Warning: Twilio credentials not configured in .env. Reminders will be printed to the console (MOCK mode).');
}


// Helper to load and save reminders
const remindersFile = path.join(__dirname, 'reminders.json');
function loadReminders() {
  try {
    const data = fs.readFileSync(remindersFile, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}
function saveReminders(list) {
  fs.writeFileSync(remindersFile, JSON.stringify(list, null, 2));
}

// In‑memory map of scheduled timeouts to allow server restart persistence (simple implementation)
const scheduled = new Map();

function scheduleReminder(reminder) {
  const sendAt = new Date(reminder.datetime);
  const now = new Date();
  const delay = sendAt - now;
  if (delay <= 0) {
    // Time already passed – send immediately
    sendSms(reminder);
    return;
  }
  const timeoutId = setTimeout(() => {
    sendSms(reminder);
    // Remove from stored list after sending
    const all = loadReminders().filter(r => r.id !== reminder.id);
    saveReminders(all);
    scheduled.delete(reminder.id);
  }, delay);
  scheduled.set(reminder.id, timeoutId);
}

function sendSms({ name, phone, medicine, datetime }) {
  const message = `مرحبا ${name},\nهذا تذكير بجرعة دواءك: ${medicine} في ${new Date(datetime).toLocaleString('ar-EG', { hour12: false })}.\nحافظ على صحتك!`;
  
  if (twilioClient) {
    twilioClient.messages
      .create({ body: message, from: FROM_NUMBER, to: phone })
      .then(msg => console.log('SMS sent, SID:', msg.sid))
      .catch(err => console.error('SMS error:', err));
  } else {
    console.log(`\n========================================\n[SIMULATED SMS SENT TO ${phone}]\nMessage: ${message}\n========================================\n`);
  }
}


// Load existing reminders on startup and schedule them
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
  };
  const list = loadReminders();
  list.push(reminder);
  saveReminders(list);
  scheduleReminder(reminder);
  res.json({ success: true, reminderId: reminder.id });
});
// API endpoint to get all reminders
app.get('/api/reminders', (req, res) => {
  const list = loadReminders();
  res.json(list);
});

app.listen(PORT, () => {
  console.log(`Reminder server listening on http://localhost:${PORT}`);
});
