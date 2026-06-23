# Media Care Website

A static, Arabic‑RTL website for managing patients, medications, and doctors. Features include:
- Patient registration & login (localStorage)
- Medication reminders with real‑time alerts
- Doctor management (add / edit) with a beautiful glass‑card UI
- Three.js hero scene for visual flair

## How to run locally
```bash
npm install
npm run dev   # or lite-server
```

## Deploy
The site can be published to any static‑host (GitHub Pages, Netlify, Vercel, etc.). After pushing to GitHub, enable **GitHub Pages** on the `main` branch to get a permanent URL.

## Twilio SMS Setup

To enable SMS notifications for medication reminders, follow these steps:
1. **Create a `.env` file** by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. **Add your Twilio credentials** (obtain them from the Twilio Console) to `.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_FROM_NUMBER=+1234567890   # Verified Twilio number in E.164 format
   ```
3. (Optional) Adjust the reminder lead time (minutes before the scheduled dose) by editing `REMINDER_LEAD_MINUTES` in `.env`.
4. Restart the development server (`npm run dev`). You should see a log confirming that the Twilio client was initialized. When a reminder is due, the server will send an SMS using the credentials.

**Note:** If the credentials are missing, the server runs in mock mode and only logs the SMS to the console.
