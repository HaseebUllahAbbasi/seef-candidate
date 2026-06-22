import { Link, useLocation } from 'react-router-dom';
import { SEEF, MISSION } from '../lib/seefContent';

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/scholarships', label: 'Scholarships' },
  { path: '/contact', label: 'Contact Us' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-between gap-2">
          <span>Government of Sindh · {SEEF.department}</span>
          <a href={SEEF.website} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            Official site: seef.sindh.gov.pk ↗
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-sm shadow-md">
              SEEF
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-slate-900 text-sm leading-tight">{SEEF.shortName}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Scholarship Portal</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2.5 text-sm font-semibold bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-colors shadow-sm">
              Register
            </Link>
          </div>
        </div>

        <nav className="md:hidden flex border-t border-slate-100 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 text-center py-2.5 text-xs font-medium whitespace-nowrap ${
                location.pathname === item.path ? 'text-emerald-800 border-b-2 border-emerald-600' : 'text-slate-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-slate-900 text-slate-400 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-bold text-white text-lg mb-2">{SEEF.name}</p>
            <p className="text-sm leading-relaxed">{MISSION.slice(0, 140)}…</p>
          </div>
          <div>
            <p className="font-semibold text-white text-sm mb-3">Quick Links</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/scholarships" className="hover:text-emerald-400">Browse Scholarships</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400">Create Account</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400">Contact & Complaints</Link></li>
              <li><a href={SEEF.website} target="_blank" rel="noreferrer" className="hover:text-emerald-400">seef.sindh.gov.pk</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white text-sm mb-3">Contact</p>
            <ul className="space-y-2 text-sm">
              <li>{SEEF.address}</li>
              <li><a href={`mailto:${SEEF.email}`} className="hover:text-emerald-400">{SEEF.email}</a></li>
              <li>{SEEF.phone}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 py-4 text-center text-xs">
          © {new Date().getFullYear()} {SEEF.name} · Government of Sindh
        </div>
      </footer>
    </div>
  );
}
