import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import SeefLogo from './SeefLogo';
import { SEEF } from '../lib/seefContent';
import { FOOTER_HELPFUL_LINKS, FOOTER_QUICK_LINKS } from '../lib/landingContent';

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/scholarships', label: 'Scholarships' },
  { path: '/universities', label: 'Universities' },
  { path: '/news', label: 'News & Events' },
  { path: '/contact', label: 'Contact Us' },
];

function SocialIcon({ children, href, label }: { children: React.ReactNode; href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="text-emerald-200/80 hover:text-white transition-colors">
      {children}
    </a>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/#')) return isHome;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top utility bar */}
      <div className="bg-[#0a3d28] text-emerald-100/90 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button type="button" className="hover:text-white" aria-label="Accessibility">♿</button>
            <SocialIcon href="https://facebook.com" label="Facebook">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </SocialIcon>
            <SocialIcon href="https://x.com" label="X">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </SocialIcon>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-emerald-200/70">|</span>
            <button type="button" className="font-medium hover:text-white">English</button>
            <span className="text-emerald-200/50">|</span>
            <button type="button" className="hover:text-white opacity-70">اردو</button>
            <Link to="/login" className="ml-2 hover:text-white font-medium">Login</Link>
            <Link to="/register" className="px-3 py-1 border border-emerald-400/60 rounded hover:bg-white/10 font-medium">Register</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0 min-w-0 leading-none">
            <SeefLogo variant="full" size="header" />
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  isActive(item.path) ? 'text-emerald-800' : 'text-slate-600 hover:text-emerald-800'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link to="/scholarships" className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-emerald-800" aria-label="Search scholarships">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </Link>
            <button type="button" className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {NAV.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800">
                {item.label}
              </Link>
            ))}
            <div className="pt-2 flex gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 border border-emerald-700 text-emerald-800 rounded-lg text-sm font-semibold">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 bg-emerald-700 text-white rounded-lg text-sm font-semibold">Register</Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#0a2e1c] text-slate-300">
        <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <SeefLogo variant="full" size="lg" />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Empowering students across Sindh through merit and need-based scholarships at HEC-recognized institutions.
            </p>
            <div className="mt-5 flex gap-3">
              {['facebook', 'x', 'youtube', 'linkedin'].map((s) => (
                <span key={s} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs uppercase hover:bg-emerald-600 transition-colors cursor-pointer">{s[0]}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-white mb-4">Quick Links</p>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="hover:text-emerald-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-4">Helpful Links</p>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_HELPFUL_LINKS.map((l) => (
                <li key={l.label}>
                  {'external' in l && l.external ? (
                    <a href={l.href} target="_blank" rel="noreferrer" className="hover:text-emerald-400">{l.label}</a>
                  ) : (
                    <Link to={l.href} className="hover:text-emerald-400">{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-4">Contact Us</p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2"><span className="text-emerald-500 shrink-0">📍</span>{SEEF.address}</li>
              <li className="flex gap-2"><span className="text-emerald-500 shrink-0">📞</span>{SEEF.phone}</li>
              <li className="flex gap-2"><span className="text-emerald-500 shrink-0">✉️</span><a href={`mailto:${SEEF.email}`} className="hover:text-emerald-400">{SEEF.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} {SEEF.name}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href={SEEF.website} target="_blank" rel="noreferrer" className="hover:text-emerald-400">Privacy Policy</a>
              <a href={SEEF.website} target="_blank" rel="noreferrer" className="hover:text-emerald-400">Terms & Conditions</a>
              <button type="button" onClick={scrollTop} className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-600" aria-label="Back to top">↑</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
