import { consultant } from '../data/consultant';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{consultant.initials}</span>
            </div>
            <span className="font-semibold text-gray-900">{consultant.name}</span>
          </div>
          <p className="text-sm text-gray-500 max-w-xs">{consultant.tagline}</p>
        </div>

        <div className="text-sm text-gray-400">
          <p>© {new Date().getFullYear()} {consultant.name}. All rights reserved.</p>
          <p className="mt-1">Education Consultancy Services</p>
        </div>
      </div>
    </footer>
  );
}
