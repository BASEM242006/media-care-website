const request = require('supertest');
const app = require('./reminders'); // exported Express app

/** Helper to reset in‑memory reminders between tests */
function resetReminders() {
  const remindersModule = require('./reminders');
  if (remindersModule.saveReminders) {
    remindersModule.saveReminders([]);
  }
}

describe('Reminders API', () => {
  beforeEach(() => {
    // Clear in‑memory list before each test
    resetReminders();
  });

  test('GET /api/reminders returns empty array initially', async () => {
    const res = await request(app).get('/api/reminders');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/reminders creates a reminder', async () => {
    const payload = {
      name: "علي",
      phone: "+201234567890",
      medicine: "باراسيتامول",
      datetime: "2026-07-01T10:00:00Z"
    };
    const res = await request(app).post('/api/reminders').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reminderId).toBeDefined();

    // Verify the reminder appears in GET response
    const getRes = await request(app).get('/api/reminders');
    expect(getRes.body).toHaveLength(1);
    expect(getRes.body[0].name).toBe(payload.name);
  });

  test('scheduleReminder sets a timeout (mocked)', async () => {
    jest.useFakeTimers();
    const { scheduleReminder } = require('./reminders');
    const mockReminder = {
      id: "test123",
      name: "علي",
      phone: "+201234567890",
      medicine: "باراسيتامول",
      datetime: new Date(Date.now() + 5000).toISOString()
    };
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    scheduleReminder(mockReminder);
    jest.advanceTimersByTime(5000);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
    jest.useRealTimers();
  });
});
