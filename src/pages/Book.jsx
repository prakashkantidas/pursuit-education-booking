import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSlots, getNext14Days, TARGET_COUNTRIES, EDUCATION_LEVELS, CONSULTATION_TOPICS } from '../data/slots';
import { consultant } from '../data/consultant';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

export default function Book() {
  const navigate = useNavigate();
  const availableDays = getNext14Days();
  const [selectedDate, setSelectedDate] = useState(availableDays[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    countries: [],
    educationLevel: '',
    topic: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1=pick slot, 2=fill form

  const slots = generateSlots(selectedDate);

  function handleDateChange(date) {
    setSelectedDate(date);
    setSelectedSlot(null);
  }

  function toggleCountry(country) {
    setForm((f) => ({
      ...f,
      countries: f.countries.includes(country)
        ? f.countries.filter((c) => c !== country)
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
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const booking = {
      id: Date.now().toString(),
      date: selectedDate,
      time: selectedSlot,
      consultant: consultant.name,
      ...form,
      bookedAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existing, booking]));
    navigate('/confirmation', { state: { booking } });
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <span className="text-xs font-semibold tracking-widest text-amber-600 uppercase">
          Book a Session
        </span>
        <h1 className="text-4xl font-black text-gray-900 mt-3 tracking-tight">
          {step === 1 ? 'Choose a Date & Time' : 'Your Details'}
        </h1>
        {step === 1 && (
          <p className="text-gray-500 mt-2">
            Sessions are 30 minutes. Available Sun–Thu, 10:00–17:00.
          </p>
        )}
      </div>

      {step === 1 ? (
        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Select Date</h2>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-10">
              {availableDays.slice(0, 10).map((d) => {
                const date = new Date(d);
                const isSelected = d === selectedDate;
                return (
                  <button
                    key={d}
                    onClick={() => handleDateChange(d)}
                    className={`rounded-xl p-3 text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-100 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className={`text-xs font-semibold mb-1 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                      {DAY_NAMES[date.getDay()]}
                    </div>
                    <div className="text-lg font-black">{date.getDate()}</div>
                    <div className={`text-xs mt-1 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                      {MONTH_NAMES[date.getMonth()]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Slots */}
            <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-4">
              Available Times — {formatDate(selectedDate)}
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {slots.map(({ time, available }) => (
                <button
                  key={time}
                  disabled={!available}
                  onClick={() => setSelectedSlot(time)}
                  className={`py-2.5 px-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                    !available
                      ? 'bg-gray-50 text-gray-300 border-gray-50 cursor-not-allowed'
                      : selectedSlot === time
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-amber-300 hover:text-amber-600'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Summary panel */}
          <div>
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Session Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Consultant</span>
                  <span className="font-medium text-gray-900">{consultant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className={`font-medium ${selectedSlot ? 'text-amber-600' : 'text-gray-300'}`}>
                    {selectedSlot || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-900">30 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <button
                disabled={!selectedSlot}
                onClick={() => setStep(2)}
                className={`w-full mt-6 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  selectedSlot
                    ? 'bg-gray-900 text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Step 2: Form */
        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact */}
            <div>
              <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-5">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-amber-400 ${
                      errors.name ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@email.com"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-amber-400 ${
                      errors.email ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+880 1xxx xxxxxx"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-amber-400 ${
                      errors.phone ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Target Countries */}
            <div>
              <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-1">Target Countries</h2>
              <p className="text-xs text-gray-400 mb-4">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {TARGET_COUNTRIES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggleCountry(c)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                      form.countries.includes(c)
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {errors.countries && <p className="text-red-500 text-xs mt-2">{errors.countries}</p>}
            </div>

            {/* Education Level */}
            <div>
              <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-4">Education Level</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {EDUCATION_LEVELS.map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setForm((f) => ({ ...f, educationLevel: lvl }))}
                    className={`px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all cursor-pointer ${
                      form.educationLevel === lvl
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              {errors.educationLevel && <p className="text-red-500 text-xs mt-2">{errors.educationLevel}</p>}
            </div>

            {/* Topic */}
            <div>
              <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-4">Consultation Topic</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {CONSULTATION_TOPICS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, topic: t }))}
                    className={`px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all cursor-pointer ${
                      form.topic === t
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {errors.topic && <p className="text-red-500 text-xs mt-2">{errors.topic}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Any specific questions or context you'd like to share..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-amber-400 resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-full text-sm font-semibold border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gray-900 text-white py-3 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Confirm Booking →
              </button>
            </div>
          </form>

          {/* Summary panel */}
          <div>
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Session Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Consultant</span>
                  <span className="font-medium text-gray-900">{consultant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium text-amber-600">{selectedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-900">30 minutes</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-xs text-gray-400 leading-relaxed">
                  You'll receive a confirmation with meeting details after booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
