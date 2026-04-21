import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(stored.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time)));
  }, []);

  function cancelBooking(id) {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <span className="text-xs font-semibold tracking-widest text-amber-600 uppercase">
          Your Sessions
        </span>
        <h1 className="text-4xl font-black text-gray-900 mt-3 tracking-tight">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-6">No bookings yet.</p>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            Book a Session →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const sessionDate = new Date(`${booking.date}T${booking.time}`);
            const isPast = sessionDate < new Date();
            return (
              <div
                key={booking.id}
                className={`bg-white rounded-2xl border p-6 ${isPast ? 'border-gray-100 opacity-60' : 'border-gray-200'}`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-5">
                    {/* Date badge */}
                    <div className={`rounded-xl p-3 text-center min-w-[56px] ${isPast ? 'bg-gray-50' : 'bg-amber-50'}`}>
                      <div className={`text-xs font-semibold ${isPast ? 'text-gray-400' : 'text-amber-600'}`}>
                        {DAY_NAMES[new Date(booking.date).getDay()]}
                      </div>
                      <div className="text-2xl font-black text-gray-900 leading-none my-1">
                        {new Date(booking.date).getDate()}
                      </div>
                      <div className={`text-xs ${isPast ? 'text-gray-400' : 'text-amber-600'}`}>
                        {MONTH_NAMES[new Date(booking.date).getMonth()]}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{booking.time}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-sm text-gray-500">30 min</span>
                        {isPast && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                            Past
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700">{booking.consultant}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{booking.topic}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {booking.countries.map((c) => (
                          <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {!isPast && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="pt-4 text-center">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-full text-sm font-semibold hover:border-gray-400 transition-colors"
            >
              Book Another Session →
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
