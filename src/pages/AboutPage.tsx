import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { SEEF, MISSION, VISION, OBJECTIVES, ELIGIBILITY, QUOTAS, DISCIPLINES } from '../lib/seefContent';
import { FEATURES, IMPACT_STATS, ABOUT_TIMELINE, ABOUT_VALUES } from '../lib/landingContent';
import { btnPrimary } from '../components/ui';

function SectionTag({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 mb-2">{children}</p>;
}

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-emerald-50 to-white">
        {/* Hero */}
        <section className="bg-[#0a3d28] text-white py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <SectionTag>About {SEEF.shortName}</SectionTag>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{SEEF.name}</h1>
            <p className="mt-4 text-emerald-100/90 text-lg leading-relaxed">{SEEF.tagline}</p>
            <p className="mt-3 text-sm text-emerald-200/80">
              Established {SEEF.established} · {SEEF.department}
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 space-y-14">
          {/* Mission & vision */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Our mission</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">{MISSION}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Our vision</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">{VISION}</p>
            </div>
          </div>

          {/* Impact */}
          <div>
            <SectionTag>Our impact</SectionTag>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Making a difference across Sindh</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {IMPACT_STATS.map((s) => (
                <div key={s.label} className="text-center p-5 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <p className="text-3xl font-bold text-emerald-700 tabular-nums">{s.value}</p>
                  <p className="text-sm text-slate-600 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Objectives */}
          <div>
            <SectionTag>What we do</SectionTag>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Key objectives</h2>
            <ul className="space-y-3">
              {OBJECTIVES.map((o) => (
                <li key={o} className="flex gap-3 text-slate-700 leading-relaxed">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>

          {/* Values */}
          <div>
            <SectionTag>Our values</SectionTag>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Principles that guide SEEF</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {ABOUT_VALUES.map((v) => (
                <div key={v.title} className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900">{v.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{v.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features / how we help */}
          <div>
            <SectionTag>Scholarship approach</SectionTag>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How SEEF supports students</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="p-5 rounded-xl border border-slate-100 bg-white">
                  <h3 className="font-semibold text-slate-900">{f.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility snapshot */}
          <div>
            <SectionTag>Eligibility</SectionTag>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Who can apply</h2>
            <div className="space-y-4">
              {ELIGIBILITY.map((e) => (
                <div key={e.title} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-2 shrink-0 rounded-full bg-emerald-600" />
                  <div>
                    <p className="font-semibold text-slate-900">{e.title}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Check <Link to="/universities" className="text-emerald-700 font-medium hover:underline">panel universities</Link>
              {' '}and active <Link to="/scholarships" className="text-emerald-700 font-medium hover:underline">scholarship advertisements</Link> for current requirements.
            </p>
          </div>

          {/* Quotas */}
          <div>
            <SectionTag>Reserved quotas</SectionTag>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Inclusive opportunity</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {QUOTAS.map((q) => (
                <div key={q.label} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100">
                  <span className="text-sm text-slate-700">{q.label}</span>
                  <span className="font-bold text-emerald-700">{q.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disciplines */}
          <div>
            <SectionTag>Supported fields</SectionTag>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Disciplines covered</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700">
              {DISCIPLINES.map((d) => (
                <li key={d} className="flex gap-2"><span className="text-emerald-600">•</span>{d}</li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div>
            <SectionTag>Our journey</SectionTag>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Timeline</h2>
            <div className="space-y-4 border-l-2 border-emerald-200 pl-6 ml-2">
              {ABOUT_TIMELINE.map((t) => (
                <div key={t.year}>
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">{t.year}</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{t.title}</p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-[#0a3d28] text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold">Ready to apply?</h2>
              <p className="text-emerald-100/90 text-sm mt-2">Register with your university email and browse open scholarships.</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link to="/register" className={`${btnPrimary()} bg-[#4CAF50] hover:bg-[#43a047]`}>Register</Link>
              <Link to="/scholarships" className="px-4 py-2.5 border border-white/50 rounded-lg text-sm font-medium hover:bg-white/10">View scholarships</Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
