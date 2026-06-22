import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import ScholarshipCard, { ScholarshipAd } from '../components/ScholarshipCard';
import { api } from '../lib/api';
import { DEMO_SCHOLARSHIPS } from '../lib/seefContent';
import { useAuth } from '../context/AuthContext';

export default function ScholarshipsPublicPage() {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<ScholarshipAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const q = user?.universityId ? `?universityId=${user.universityId}` : '';
    api<ScholarshipAd[]>(`/advertisements/public${q}`)
      .then((data) => setScholarships(data.length > 0 ? data : DEMO_SCHOLARSHIPS))
      .catch(() => setScholarships(DEMO_SCHOLARSHIPS))
      .finally(() => setLoading(false));
  }, [user?.universityId]);

  const filtered = scholarships.filter((ad) => {
    if (filter === 'open') {
      return new Date(ad.endDate) > new Date();
    }
    return true;
  });

  const applyPath = user ? '/advertisements' : '/login';

  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-emerald-50 to-slate-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Scholarship Advertisements</h1>
              <p className="text-slate-500 mt-2">
                {user
                  ? `Showing scholarships available for ${user.university?.name ?? 'your university'}`
                  : 'Login to apply — all Sindh domicile students at SEEF panel universities are eligible'}
              </p>
            </div>
            <div className="flex gap-2">
              {(['all', 'open'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f ? 'bg-emerald-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
                  }`}
                >
                  {f === 'all' ? 'All' : 'Open only'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-white rounded-2xl border animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border">
              <p className="text-slate-500">No scholarships match your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((ad) => (
                <ScholarshipCard key={ad.id} ad={ad} applyBasePath={applyPath} />
              ))}
            </div>
          )}

          {!user && (
            <div className="mt-12 p-6 bg-emerald-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg">Start your application today</p>
                <p className="text-emerald-200 text-sm mt-1">Register with your university details to apply online</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link to="/register" className="px-5 py-2.5 bg-white text-emerald-900 font-semibold rounded-xl hover:bg-emerald-50">
                  Register
                </Link>
                <Link to="/login" className="px-5 py-2.5 border border-white/40 rounded-xl hover:bg-white/10">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
