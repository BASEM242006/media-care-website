// admin.js – client‑side script for the admin panel

const API_BASE = '/api/admin';

// Helper for fetch with JSON
async function fetchJSON(url, options = {}) {
  const token = localStorage.getItem('jwt');
  if (!token) {
    // Not logged in – redirect to login page
    window.location.href = 'login.html';
    return Promise.reject('No auth token');
  }
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  const res = await fetch(url, { headers, ...options });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed with ${res.status}`);
  }
  return res.json();
}



// Load reminders and render table
async function loadReminders() {
  const data = await fetchJSON(`${API_BASE}/reminders`);
  const tbody = document.querySelector('#reminders-table tbody');
  tbody.innerHTML = '';
  data.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.user_id}</td>
      <td>${r.title}</td>
      <td>${new Date(r.scheduled_at).toLocaleString('ar-EG')}</td>
      <td><button class="btn btn-danger btn-sm" data-id="${r.id}">🗑️ حذف</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// Load SMS logs and render table
async function loadSmsLogs() {
  const data = await fetchJSON(`${API_BASE}/sms-logs`);
  const tbody = document.querySelector('#sms-logs-table tbody');
  tbody.innerHTML = '';
  data.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${l.id}</td>
      <td>${l.reminder_id}</td>
      <td>${l.user_id}</td>
      <td>${l.status}</td>
      <td>${l.attempt}</td>
      <td>${l.error_message || ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Form submission – create reminder
document.getElementById('reminder-form').addEventListener('submit', async e => {
  e.preventDefault();
  const userId = document.getElementById('userId').value.trim();
  const title = document.getElementById('title').value.trim();
  const message = document.getElementById('message').value.trim();
  const scheduled_at = document.getElementById('scheduled_at').value;
  try {
    await fetchJSON(`${API_BASE}/reminders`, {
      method: 'POST',
      body: JSON.stringify({ userId, title, message, scheduled_at })
    });
    await loadReminders();
    e.target.reset();
  } catch (err) {
    alert('خطأ: ' + err.message);
  }
});

// Delete reminder handler (event delegation)
document.querySelector('#reminders-table tbody').addEventListener('click', async e => {
  if (e.target.matches('button[data-id]')) {
    const id = e.target.dataset.id;
    if (!confirm('هل تريد حذف هذا التذكير؟')) return;
    try {
      await fetch(`${API_BASE}/reminders/${id}`, { method: 'DELETE' });
      await loadReminders();
    } catch (err) {
      alert('خطأ في الحذف: ' + err.message);
    }
  }
});

// Logout button handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('jwt');
    window.location.href = 'login.html';
  });
}

// Initial load (ensure token present)
if (localStorage.getItem('jwt')) {
  loadReminders();
  loadSmsLogs();
}


