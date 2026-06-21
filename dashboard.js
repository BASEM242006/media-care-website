// dashboard.js – dynamically loads and displays scheduled medication reminders
document.addEventListener('DOMContentLoaded', () => {
  const reminderGrid = document.getElementById('reminder-grid');
  if (!reminderGrid) return;

  async function loadReminders() {
    try {
      const response = await fetch('/api/reminders');
      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }
      const reminders = await response.json();
      renderReminders(reminders);
    } catch (err) {
      console.error(err);
      reminderGrid.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
          <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; color: #ef4444; margin-bottom: 1rem;"></i>
          <p>فشل تحميل التذكيرات. يرجى التأكد من تشغيل الخادم.</p>
        </div>
      `;
    }
  }

  function renderReminders(reminders) {
    if (reminders.length === 0) {
      reminderGrid.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
          <i class="fas fa-bell-slash" style="font-size: 2.5rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
          <p>لا توجد تذكيرات مجدولة حالياً.</p>
        </div>
      `;
      return;
    }

    reminderGrid.innerHTML = reminders.map(reminder => {
      const dateFormatted = new Date(reminder.datetime).toLocaleString('ar-EG', {
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: true
      });
      
      return `
        <div class="reminder-card" data-aos="fade-up" style="text-align: center;">
          <div class="feature-icon" style="margin: 0 auto 1rem; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-clock" style="color: var(--primary-color);"></i>
          </div>
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${reminder.medicine}</h3>
          <p style="font-size: 0.9rem; margin-bottom: 0.25rem;"><strong>المريض:</strong> ${reminder.name}</p>
          <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>رقم الجوال:</strong> ${reminder.phone}</p>
          <div style="background: rgba(14, 165, 233, 0.1); padding: 0.5rem; border-radius: var(--border-radius-sm); font-size: 0.85rem; font-weight: bold; color: var(--primary-color);">
            ${dateFormatted}
          </div>
        </div>
      `;
    }).join('');

    // Trigger AOS if available to animate the new cards
    if (window.AOS) {
      window.AOS.refresh();
    }
  }

  loadReminders();
});
