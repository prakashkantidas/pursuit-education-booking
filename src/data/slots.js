// Available days: Sunday (0) through Thursday (4)
// Hours: 10:00 — 17:00, 30-min slots
// Some slots are pre-blocked to simulate a real schedule

const BLOCKED_TIMES = ['10:00', '11:30', '14:00', '15:30'];
const BLOCKED_DAYS = [1, 3]; // block a few extra slots on Mon & Wed

export function generateSlots(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0=Sun,1=Mon,...,6=Sat

  // Only Sun–Thu are working days
  if (day === 5 || day === 6) return [];

  const times = [];
  for (let h = 10; h < 17; h++) {
    times.push(`${String(h).padStart(2, '0')}:00`);
    times.push(`${String(h).padStart(2, '0')}:30`);
  }

  return times.map((time) => {
    const isBlocked =
      BLOCKED_TIMES.includes(time) ||
      (BLOCKED_DAYS.includes(day) && ['12:00', '13:00', '16:00'].includes(time));
    return { time, available: !isBlocked };
  });
}

export function getNext14Days() {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let count = 0;
  let offset = 0;

  while (count < 14) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const day = d.getDay();
    if (day !== 5 && day !== 6) {
      days.push(d.toISOString().split('T')[0]);
      count++;
    }
    offset++;
  }
  return days;
}

export const TARGET_COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'New Zealand',
  'Ireland',
  'Netherlands',
  'France',
  'Singapore',
];

export const EDUCATION_LEVELS = [
  'High School / A-Levels',
  'Undergraduate (Bachelor\'s)',
  'Postgraduate (Master\'s)',
  'PhD / Doctoral',
  'Foundation / Pathway',
];

export const CONSULTATION_TOPICS = [
  'University Selection & Applications',
  'Visa Guidance',
  'Scholarship Search',
  'Statement of Purpose Review',
  'Interview Preparation',
  'General Study Abroad Planning',
];
