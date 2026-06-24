import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { api } from '../lib/api';
import { btnPrimary, inputClass } from '../components/ui';

interface PanelUniversity {
  id: string;
  name: string;
  code: string;
  city: string;
  type?: string | null;
  emailDomains?: string | null;
}

export default function UniversitiesPublicPage() {
  const [universities, setUniversities] = useState<PanelUniversity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'PUBLIC' | 'PRIVATE'>('all');

  useEffect(() => {
    api<PanelUniversity[]>('/universities/public')
      .then(setUniversities)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return universities.filter((u) => {
      if (typeFilter !== 'all' && u.type !== typeFilter) return false;
      if (!q) return true;
      const haystack = `${u.name} ${u.code} ${u.city} ${u.type ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [universities, search, typeFilter]);

  const hasSearch = search.trim().length > 0;

  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-emerald-50 to-slate-50 py-12 md:py-16 min-h-[calc(100vh-12rem)]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 mb-2">SEEF panel</p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Participating universities</h1>
            <p className="text-slate-600 mt-3 max-w-2xl leading-relaxed">
              Check whether your institution is on the SEEF scholarship panel before you register.
              Only students enrolled at listed universities can create a candidate account and apply.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/80 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="uni-search" className="sr-only">Search universities</label>
                  <input
                    id="uni-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by university name, city, or code..."
                    className={inputClass()}
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as 'all' | 'PUBLIC' | 'PRIVATE')}
                  className={`${inputClass()} sm:w-44`}
                  aria-label="Filter by university type"
                >
                  <option value="all">All types</option>
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-slate-600 tabular-nums">
                  {loading ? 'Loading...' : `${filtered.length} of ${universities.length} universities shown`}
                </p>
                {hasSearch && !loading && filtered.length > 0 && (
                  <p className="text-emerald-800 font-medium bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                    {filtered.length === 1
                      ? 'Your university appears on the panel — you can register.'
                      : `${filtered.length} matching universities found on the panel.`}
                  </p>
                )}
                {hasSearch && !loading && filtered.length === 0 && (
                  <p className="text-amber-800 font-medium bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                    No match — your university may not be on the panel yet. Contact SEEF for guidance.
                  </p>
                )}
              </div>
            </div>

            {error && (
              <p className="p-5 text-sm text-red-700 bg-red-50 border-b border-red-100">{error}</p>
            )}

            {loading ? (
              <div className="p-12 text-center text-slate-500 text-sm">Loading universities...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-700 font-medium">No universities match your search</p>
                <p className="text-sm text-slate-500 mt-2">Try a different name or clear the filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3 font-semibold">University</th>
                      <th className="px-5 py-3 font-semibold">City</th>
                      <th className="px-5 py-3 font-semibold">Code</th>
                      <th className="px-5 py-3 font-semibold">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((u) => (
                      <tr key={u.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-slate-900">{u.name}</td>
                        <td className="px-5 py-3.5 text-slate-600">{u.city}</td>
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{u.code}</td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {u.type === 'PUBLIC' ? 'Public' : u.type === 'PRIVATE' ? 'Private' : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0a3d28] text-white">
            <div>
              <p className="font-semibold text-lg">Found your university?</p>
              <p className="text-emerald-100/90 text-sm mt-1">
                Register with your official university email to apply for SEEF scholarships.
              </p>
            </div>
            <Link to="/register" className={`${btnPrimary()} bg-[#4CAF50] hover:bg-[#43a047] shrink-0`}>
              Create candidate account
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            List managed by SEEF administrators.{' '}
            <Link to="/contact" className="text-emerald-700 font-medium hover:underline">Contact us</Link>
            {' '}if your institution should be included.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
