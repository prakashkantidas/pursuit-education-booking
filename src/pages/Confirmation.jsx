import { useLocation, Link, Navigate } from 'react-router-dom';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatDateLong(dateStr) {
  const d = new Date(dateStr);
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export default function Confirmation() {
  const { state } = useLocation();
  if (!state?.booking) return <Navigate to="/" replace />;

  const { booking } = state;

  return (
    <main className="max-w-2xl mx-auto px-6 py-20 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-8">
        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <span className="text-xs font-semibold tracking-widest text-amber-600 uppercase">Confirmed</span>
      <h1 className="text-4xl font-black text-gray-900 mt-3 mb-4 tracking-tight">
        You're booked!
      </h1>
      <p className="text-gray-500 text-lg mb-12">
        Your consultation with {booking.consultant} is confirmed.
      </p>

      {/* Booking card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-left mb-8">
        <h2 className="font-semibold text-gray-900 mb-6 text-sm uppercase tracking-wide">Booking Details</h2>
        <div className="space-y-4">
          {[
            { label: 'Consultant', value: booking.consultant },
            { label: 'Date', value: formatDateLong(booking.date) },
            { label: 'Time', value: `${booking.time} (30 minutes)` },
            { label: 'Name', value: booking.name },
            { label: 'Email', value: booking.email },
            { label: 'Phone', value: booking.phone },
            { label: 'Target Countries', value: booking.countries.join(', ') },
            { label: 'Education Level', value: booking.educationLevel },
            { label: 'Topic', value: booking.topic },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500 flex-shrink-0 w-36">{label}</span>
              <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
            </div>
          ))}
          {booking.notes && (
            <div className="pt-2">
              <p className="text-sm text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-10 text-left">
        <p className="text-sm text-amber-800 font-medium mb-1">What's next?</p>
        <p className="text-sm text-amber-700">
          The consultant will reach out to you at <strong>{booking.email}</strong> with meeting details within 24 hours.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/my-bookings"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          View My Bookings →
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-7 py-3.5 rounded-full text-sm font-semibold hover:border-gray-400 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
