import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAvatar } from '../lib/avatar';
import { api } from '../lib/api';

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/advertisements', label: 'Scholarships', icon: '📢' },
  { path: '/applications', label: 'My Applications', icon: '📋' },
  { path: '/notifications', label: 'Notifications', icon: '🔔', badge: true },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    api<{ read: boolean }[]>('/notifications')
      .then((list) => setUnread(list.filter((n) => !n.read).length))
      .catch(() => {});
  }, [user, location.pathname]);

  const displayName = user?.firstName || user?.fullName?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden md:flex w-60 bg-emerald-950 text-emerald-100 flex-col shrink-0">
        <div className="px-5 py-6 border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-lg">🎓</div>
            <div>
              <p className="font-bold text-white text-sm">SEEF Scholarships</p>
              <p className="text-[10px] text-emerald-300 uppercase tracking-wider">Candidate Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3">
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            const badge = item.badge && unread > 0 ? unread : 0;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
                  active ? 'bg-emerald-600 text-white font-medium shadow-sm' : 'text-emerald-200 hover:bg-emerald-900/60'
                }`}
              >
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {badge > 0 && (
                  <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        {user && (
          <div className="p-4 border-t border-emerald-900">
            <div className="flex items-center gap-2.5 mb-2">
              <img src={userAvatar(user)} alt="" className="w-9 h-9 rounded-full bg-white/10 ring-2 ring-emerald-700" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{displayName}</p>
                {user.university && (
                  <p className="text-xs text-emerald-300 truncate">{user.university.name}</p>
                )}
              </div>
            </div>
            <Link to="/" className="text-xs text-emerald-300 hover:text-white inline-block">← Public website</Link>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="mt-3 block text-xs text-emerald-300 hover:text-white"
            >
              Sign out
            </button>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-emerald-800 text-white px-4 py-3 flex justify-between items-center gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {user && <img src={userAvatar(user)} alt="" className="w-8 h-8 rounded-full shrink-0 ring-2 ring-emerald-600" />}
            <p className="font-bold text-sm truncate">SEEF Scholarships</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="text-xs text-emerald-200 shrink-0">Logout</button>
        </header>
        <nav className="md:hidden bg-white border-b flex overflow-x-auto">
          {NAV.map((item) => {
            const badge = item.badge && unread > 0;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 relative ${
                  location.pathname === item.path ? 'border-emerald-600 text-emerald-800 font-semibold' : 'border-transparent text-slate-500'
                }`}
              >
                {item.label}
                {badge && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-slate-50">
          <div className="max-w-4xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
