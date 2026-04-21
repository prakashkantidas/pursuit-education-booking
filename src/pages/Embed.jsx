import { useState } from 'react';
import { generateSlots, getNext14Days, TARGET_COUNTRIES, EDUCATION_LEVELS, CONSULTATION_TOPICS } from '../data/slots';
import { consultant } from '../data/consultant';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

export default function Embed() {
  const availableDays = getNext14Days();
  const [selectedDate, setSelectedDate] = useState(availableDays[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    countries: [], educationLevel: '', topic: '', notes: '',
  });
  const [errors, setErrors] = useState({});

  const slots = generateSlots(selectedDate);

  function toggleCountry(country) {
    setForm(f => ({
      ...f,
      countries: f.countries.includes(country)
        ? f.countries.filter(c => c !== country)
        : [...f.countries, country],
    }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (form.countries.length === 0) e.countries = 'Select at least one';
    if (!form.educationLevel) e.educationLevel = 'Required';
    if (!form.topic) e.topic = 'Required';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const booking = {
      id: Date.now().toString(),
      date: selectedDate, time: selectedSlot,
      consultant: consultant.name, ...form,
      bookedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existing, booking]));
    setConfirmed(true);
    window.parent.postMessage({ type: 'BOOKING_CONFIRMED', booking }, '*');
  }

  if (confirmed) {
    return (
      <div style={styles.wrap}>
        <div style={styles.success}>
          <div style={styles.checkCircle}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#a3722a" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 style={styles.successH}>Booking Confirmed</h2>
          <p style={styles.successP}>
            Your consultation with <strong>{consultant.name}</strong> on{' '}
            <strong>{formatDate(selectedDate)}</strong> at <strong>{selectedSlot}</strong> is confirmed.
          </p>
          <p style={styles.successSub}>
            We'll reach out to <strong>{form.email}</strong> with meeting details within 24 hours.
          </p>
          <button style={styles.resetBtn} onClick={() => { setConfirmed(false); setStep(1); setSelectedSlot(null); setForm({ name:'',email:'',phone:'',countries:[],educationLevel:'',topic:'',notes:'' }); }}>
            Book Another Session →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      {/* Step indicator */}
      <div style={styles.stepBar}>
        <span style={{ ...styles.stepItem, ...(step === 1 ? styles.stepActive : styles.stepDone) }}>
          {step > 1 ? '✓ ' : ''}01 — Select Slot
        </span>
        <div style={styles.stepLine} />
        <span style={{ ...styles.stepItem, ...(step === 2 ? styles.stepActive : step > 2 ? styles.stepDone : {}) }}>
          02 — Your Details
        </span>
      </div>

      {step === 1 ? (
        <div>
          {/* Date picker */}
          <p style={styles.sectionLabel}>Choose a Date</p>
          <div style={styles.dateGrid}>
            {availableDays.slice(0, 10).map(d => {
              const date = new Date(d);
              const sel = d === selectedDate;
              return (
                <button key={d} onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                  style={{ ...styles.dateBtn, ...(sel ? styles.dateBtnActive : {}) }}>
                  <span style={{ fontSize: 10, color: sel ? '#d4a574' : '#9a9088', display: 'block', marginBottom: 2 }}>
                    {DAY_NAMES[date.getDay()]}
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1, display: 'block', color: sel ? '#faf7f2' : '#0e0c0a' }}>
                    {date.getDate()}
                  </span>
                  <span style={{ fontSize: 10, color: sel ? '#d4a574' : '#9a9088', display: 'block', marginTop: 2 }}>
                    {MONTH_NAMES[date.getMonth()]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Time slots */}
          <p style={styles.sectionLabel}>Available Times — {formatDate(selectedDate)}</p>
          <div style={styles.slotGrid}>
            {slots.map(({ time, available }) => (
              <button key={time} disabled={!available} onClick={() => setSelectedSlot(time)}
                style={{
                  ...styles.slotBtn,
                  ...((!available) ? styles.slotDisabled : selectedSlot === time ? styles.slotActive : styles.slotIdle),
                }}>
                {time}
              </button>
            ))}
          </div>

          <button disabled={!selectedSlot} onClick={() => setStep(2)}
            style={{ ...styles.primaryBtn, ...(selectedSlot ? {} : styles.primaryBtnDisabled), marginTop: 24 }}>
            Continue →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Slot recap */}
          <div style={styles.recap}>
            <span style={styles.recapText}>
              {formatDate(selectedDate)} · <strong>{selectedSlot}</strong> · 30 min
            </span>
            <button type="button" style={styles.changeBtn} onClick={() => setStep(1)}>Change</button>
          </div>

          {/* Contact */}
          <p style={styles.sectionLabel}>Contact Information</p>
          <div style={styles.formRow}>
            <div style={styles.formField}>
              <label style={styles.label}>Full Name</label>
              <input style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your full name" />
              {errors.name && <span style={styles.err}>{errors.name}</span>}
            </div>
            <div style={styles.formField}>
              <label style={styles.label}>Phone</label>
              <input style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+880 1xxx xxxxxx" />
              {errors.phone && <span style={styles.err}>{errors.phone}</span>}
            </div>
          </div>
          <div style={styles.formField}>
            <label style={styles.label}>Email Address</label>
            <input style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com" />
            {errors.email && <span style={styles.err}>{errors.email}</span>}
          </div>

          {/* Countries */}
          <p style={styles.sectionLabel}>Target Countries <span style={{ fontWeight: 400, fontSize: 11, color: '#9a9088' }}>(select all that apply)</span></p>
          <div style={styles.chipWrap}>
            {TARGET_COUNTRIES.map(c => (
              <button type="button" key={c} onClick={() => toggleCountry(c)}
                style={{ ...styles.chip, ...(form.countries.includes(c) ? styles.chipActive : {}) }}>
                {c}
              </button>
            ))}
          </div>
          {errors.countries && <span style={styles.err}>{errors.countries}</span>}

          {/* Education level */}
          <p style={styles.sectionLabel}>Education Level</p>
          <div style={styles.optionGrid}>
            {EDUCATION_LEVELS.map(lvl => (
              <button type="button" key={lvl} onClick={() => setForm(f => ({ ...f, educationLevel: lvl }))}
                style={{ ...styles.optionBtn, ...(form.educationLevel === lvl ? styles.optionBtnActive : {}) }}>
                {lvl}
              </button>
            ))}
          </div>
          {errors.educationLevel && <span style={styles.err}>{errors.educationLevel}</span>}

          {/* Topic */}
          <p style={styles.sectionLabel}>Consultation Topic</p>
          <div style={styles.optionGrid}>
            {CONSULTATION_TOPICS.map(t => (
              <button type="button" key={t} onClick={() => setForm(f => ({ ...f, topic: t }))}
                style={{ ...styles.optionBtn, ...(form.topic === t ? styles.optionBtnAccent : {}) }}>
                {t}
              </button>
            ))}
          </div>
          {errors.topic && <span style={styles.err}>{errors.topic}</span>}

          {/* Notes */}
          <div style={{ ...styles.formField, marginTop: 16 }}>
            <label style={styles.label}>Notes <span style={{ fontWeight: 400, color: '#9a9088' }}>(optional)</span></label>
            <textarea style={styles.textarea} rows={3}
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any questions or context…" />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button type="button" onClick={() => setStep(1)} style={styles.ghostBtn}>← Back</button>
            <button type="submit" style={{ ...styles.primaryBtn, flex: 1 }}>Book an Appointment →</button>
          </div>
        </form>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    background: '#faf7f2',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: '#0e0c0a',
    padding: '28px 24px 36px',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  stepBar: {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28,
  },
  stepItem: {
    fontSize: 11, fontWeight: 500, color: '#9a9088', letterSpacing: '0.05em',
    textTransform: 'uppercase', whiteSpace: 'nowrap',
  },
  stepActive: { color: '#a3722a' },
  stepDone: { color: '#0e0c0a' },
  stepLine: { flex: 1, height: 1, background: '#ebe3d6' },
  sectionLabel: {
    fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: '#6b6258', marginBottom: 12, marginTop: 24,
  },
  dateGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8,
  },
  dateBtn: {
    background: '#f2ece2', border: '1px solid #ebe3d6', borderRadius: 4,
    padding: '10px 4px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
  },
  dateBtnActive: {
    background: '#0e0c0a', borderColor: '#0e0c0a',
  },
  slotGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
  },
  slotBtn: {
    padding: '9px 4px', fontSize: 13, fontWeight: 500, borderRadius: 4,
    border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s',
  },
  slotIdle: { background: '#f2ece2', borderColor: '#ebe3d6', color: '#0e0c0a' },
  slotActive: { background: '#a3722a', borderColor: '#a3722a', color: '#faf7f2' },
  slotDisabled: { background: '#faf7f2', borderColor: '#ebe3d6', color: '#c5bdb5', cursor: 'not-allowed' },
  primaryBtn: {
    width: '100%', padding: '13px 20px', background: '#0e0c0a',
    color: '#faf7f2', border: 'none', borderRadius: 2, fontSize: 13,
    fontWeight: 500, cursor: 'pointer', letterSpacing: '0.02em',
    fontFamily: "'DM Sans', sans-serif",
  },
  primaryBtnDisabled: { background: '#ebe3d6', color: '#9a9088', cursor: 'not-allowed' },
  ghostBtn: {
    padding: '13px 20px', background: 'transparent', color: '#6b6258',
    border: '1px solid #ebe3d6', borderRadius: 2, fontSize: 13,
    fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
  },
  recap: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#f2ece2', border: '1px solid #ebe3d6', borderRadius: 4,
    padding: '10px 14px', marginBottom: 8,
  },
  recapText: { fontSize: 13, color: '#0e0c0a' },
  changeBtn: {
    background: 'none', border: 'none', fontSize: 12, color: '#a3722a',
    cursor: 'pointer', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif",
  },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  formField: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 },
  label: { fontSize: 11, fontWeight: 600, color: '#6b6258', letterSpacing: '0.06em', textTransform: 'uppercase' },
  input: {
    border: '1px solid #ebe3d6', borderRadius: 2, padding: '10px 12px',
    fontSize: 13, background: '#f2ece2', color: '#0e0c0a', outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  },
  inputError: { borderColor: '#c0392b' },
  textarea: {
    border: '1px solid #ebe3d6', borderRadius: 2, padding: '10px 12px',
    fontSize: 13, background: '#f2ece2', color: '#0e0c0a', outline: 'none',
    resize: 'vertical', fontFamily: "'DM Sans', sans-serif",
  },
  chipWrap: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  chip: {
    padding: '6px 12px', fontSize: 12, fontWeight: 500,
    border: '1px solid #ebe3d6', borderRadius: 20, background: '#f2ece2',
    color: '#6b6258', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
  },
  chipActive: { background: '#0e0c0a', borderColor: '#0e0c0a', color: '#faf7f2' },
  optionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 4 },
  optionBtn: {
    padding: '10px 12px', fontSize: 12, fontWeight: 500, textAlign: 'left',
    border: '1px solid #ebe3d6', borderRadius: 2, background: '#f2ece2',
    color: '#6b6258', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
  },
  optionBtnActive: { background: '#0e0c0a', borderColor: '#0e0c0a', color: '#faf7f2' },
  optionBtnAccent: { background: '#a3722a', borderColor: '#a3722a', color: '#faf7f2' },
  err: { fontSize: 11, color: '#c0392b', marginTop: 2 },
  // Success screen
  success: { textAlign: 'center', padding: '40px 20px' },
  checkCircle: {
    width: 64, height: 64, borderRadius: '50%', background: '#f2ece2',
    border: '2px solid #ebe3d6', display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto 20px',
  },
  successH: {
    fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500,
    color: '#0e0c0a', margin: '0 0 12px', letterSpacing: '-0.5px',
  },
  successP: { fontSize: 14, color: '#6b6258', lineHeight: 1.7, marginBottom: 8 },
  successSub: { fontSize: 13, color: '#9a9088', lineHeight: 1.7, marginBottom: 28 },
  resetBtn: {
    background: 'none', border: '1px solid #ebe3d6', borderRadius: 2,
    padding: '11px 20px', fontSize: 13, color: '#6b6258', cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
};
