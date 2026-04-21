import { Link, useLocation } from 'react-router-dom';
import { consultant } from '../data/consultant';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{consultant.initials}</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm tracking-tight">
            {consultant.name}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              pathname === '/'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/book"
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              pathname === '/book'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Book
          </Link>
          <Link
            to="/my-bookings"
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              pathname === '/my-bookings'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            My Bookings
          </Link>
        </div>
      </div>
    </nav>
  );
}
