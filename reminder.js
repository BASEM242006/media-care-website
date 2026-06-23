// reminder.js – handles medication reminder form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reminder-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reminder-name').value.trim();
    const phone = document.getElementById('reminder-phone').value.trim();
    const medicine = document.getElementById('reminder-medicine').value.trim();
    const datetime = document.getElementById('reminder-datetime').value;

    if (!name || !phone || !medicine || !datetime) {
      showToast('الرجاء ملء جميع الحقول');
      return;
    }

    const payload = { name, phone, medicine, datetime };
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        showToast('تم تسجيل التذكير بنجاح!');
        form.reset();
      } else {
        const err = await response.text();
        showToast('فشل الإرسال: ' + err);
      }
    } catch (err) {
      console.error(err);
      showToast('خطأ في الاتصال بالخادم');
    }
  });
});
