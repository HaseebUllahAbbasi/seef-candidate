import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { NEWS_ITEMS, UPCOMING_EVENTS } from '../lib/landingContent';

const CATEGORIES = ['All', ...Array.from(new Set(NEWS_ITEMS.map((n) => n.category)))];

export default function NewsPage() {
  const [category, setCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(NEWS_ITEMS[0]?.id ?? null);

  const filtered = useMemo(
    () => (category === 'All' ? NEWS_ITEMS : NEWS_ITEMS.filter((n) => n.category === category)),
    [category],
  );

  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-emerald-50 to-slate-50 min-h-[calc(100vh-12rem)]">
        <section className="bg-[#0a3d28] text-white py-14 md:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 mb-2">Stay informed</p>
            <h1 className="text-3xl md:text-4xl font-bold">News &amp; Events</h1>
            <p className="mt-4 text-emerald-100/90 leading-relaxed max-w-2xl mx-auto">
              Announcements, scholarship cycles, interview updates, and events from the Sindh Educational Endowment Fund.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 space-y-12">
          {/* Upcoming events */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Upcoming events</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {UPCOMING_EVENTS.map((e) => (
                <div key={e.title} className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">{e.date}</p>
                  <h3 className="font-semibold text-slate-900 mt-2">{e.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{e.location}</p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{e.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* News filter */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900">Latest news</h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      category === c
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {filtered.map((n) => {
                const open = expandedId === n.id;
                return (
                  <article
                    key={n.id}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                      <img src={n.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {n.category}
                        </span>
                        <span className="text-xs text-slate-500">{n.date}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 leading-snug">{n.title}</h3>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{n.excerpt}</p>
                      {open && (
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">
                          {n.body}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedId(open ? null : n.id)}
                        className="mt-3 text-sm font-semibold text-emerald-700 hover:underline"
                      >
                        {open ? 'Show less' : 'Read more'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-200">
            For media inquiries or official notices,{' '}
            <Link to="/contact" className="text-emerald-700 font-medium hover:underline">contact SEEF</Link>.
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
