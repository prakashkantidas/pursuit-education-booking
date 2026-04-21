import { Link } from 'react-router-dom';
import { consultant } from '../data/consultant';

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest text-amber-600 uppercase mb-6">
              Education Consultant
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
              One Goal.{' '}
              <span className="italic font-light text-gray-400">Infinite</span>
              <br />
              Destinations.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
              {consultant.bio}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors"
              >
                Book a Consultation <span>→</span>
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-7 py-3.5 rounded-full text-sm font-semibold hover:border-gray-400 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Consultant card */}
          <div className="flex justify-center md:justify-end">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl font-bold">{consultant.initials}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{consultant.name}</h3>
                  <p className="text-sm text-gray-500">{consultant.title}</p>
                </div>
              </div>
              <div className="space-y-3">
                {consultant.credentials.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{c}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-black text-gray-900">500+</p>
                    <p className="text-xs text-gray-400 mt-1">Placements</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">8+</p>
                    <p className="text-xs text-gray-400 mt-1">Years Exp.</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">6</p>
                    <p className="text-xs text-gray-400 mt-1">Countries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gray-100" />
      </div>

      {/* About / Specializations */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-14">
          <span className="text-xs font-semibold tracking-widest text-amber-600 uppercase">
            Specializations
          </span>
          <h2 className="text-4xl font-black text-gray-900 mt-3 tracking-tight">
            Study Destinations
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
          {consultant.specializations.map((spec) => (
            <div key={spec.id} className="bg-white p-8 group hover:bg-amber-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-mono font-semibold text-gray-300">{spec.id}</span>
                <span className="text-2xl">{spec.flag}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{spec.country}</h3>
              <p className="text-sm text-gray-400">{spec.universities}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
              Process
            </span>
            <h2 className="text-4xl font-black text-white mt-3 tracking-tight">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: '01',
                title: 'Choose a Slot',
                desc: 'Pick a date and time that works for you from the available consultation slots.',
              },
              {
                n: '02',
                title: 'Share Your Goals',
                desc: 'Tell us your target country, education level, and what you need guidance on.',
              },
              {
                n: '03',
                title: 'Get Expert Advice',
                desc: 'Receive a personalised 30-minute session with actionable next steps.',
              },
            ].map((step) => (
              <div key={step.n} className="border border-gray-700 rounded-2xl p-8 hover:border-amber-500 transition-colors">
                <span className="text-xs font-mono font-semibold text-gray-500 block mb-6">{step.n}</span>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-amber-400 transition-colors"
            >
              Book Your Session →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
