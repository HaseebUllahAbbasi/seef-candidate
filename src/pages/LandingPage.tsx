import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import ScholarshipCard, { ScholarshipAd } from '../components/ScholarshipCard';
import { api } from '../lib/api';
import {
  SEEF, MISSION, VISION, OBJECTIVES, ELIGIBILITY, QUOTAS,
  INCOME_GROUPS, DISCIPLINES, STATS, DEMO_SCHOLARSHIPS,
} from '../lib/seefContent';

const APPLY_STEPS = [
  { title: 'Register', desc: 'Verify with your university email and mobile number' },
  { title: 'Complete profile', desc: 'Add your name, CNIC, and gender after login' },
  { title: 'Apply online', desc: 'Fill the application form and upload documents' },
  { title: 'Track status', desc: 'Follow verification, scrutiny, interview, and award stages' },
];

export default function LandingPage() {
  const [scholarships, setScholarships] = useState<ScholarshipAd[]>([]);

  useEffect(() => {
    api<ScholarshipAd[]>('/advertisements/public')
      .then((data) => setScholarships(data.length > 0 ? data : DEMO_SCHOLARSHIPS))
      .catch(() => setScholarships(DEMO_SCHOLARSHIPS));
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-teal-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-widest mb-4 bg-white/10 border border-white/10 rounded-full px-3 py-1">
                Government of Sindh · Est. {SEEF.established}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                {SEEF.name}
              </h1>
              <p className="text-xl text-emerald-100 mt-4 font-light">{SEEF.tagline}</p>
              <p className="text-emerald-200/90 mt-5 text-base leading-relaxed">
                {MISSION}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  Apply Online
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/scholarships"
                  className="inline-flex items-center px-6 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  View Scholarships
                </Link>
                <Link to="/login" className="inline-flex items-center px-6 py-3.5 text-emerald-200 font-medium hover:text-white transition-colors">
                  Candidate Login
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-6 shadow-2xl">
                <p className="text-sm font-semibold text-emerald-100 mb-4">How to apply in 4 steps</p>
                <ol className="space-y-4">
                  {APPLY_STEPS.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 shadow-md">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-white">{step.title}</p>
                        <p className="text-sm text-emerald-100/85 mt-0.5">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link
                  to="/register"
                  className="mt-6 block text-center py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-colors"
                >
                  Start registration
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-3xl md:text-4xl font-bold text-emerald-700">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scholarships preview */}
      <section className="py-16 md:py-20 bg-slate-50" id="scholarships">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Open Scholarships</h2>
              <p className="text-slate-500 mt-2 max-w-xl">
                Browse active SEEF advertisements. Register or login to submit your application online.
              </p>
            </div>
            <Link to="/scholarships" className="text-emerald-700 font-semibold hover:underline shrink-0">
              View all scholarships →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.slice(0, 3).map((ad) => (
              <ScholarshipCard key={ad.id} ad={ad} applyBasePath="/login" />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About SEEF Trust</h2>
            <p className="text-slate-600 leading-relaxed">{VISION}</p>
            <ul className="mt-6 space-y-3">
              {OBJECTIVES.map((o, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold">{i + 1}</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-4">Supported Disciplines</h3>
            <ul className="space-y-2">
              {DISCIPLINES.map((d) => (
                <li key={d} className="flex items-center gap-2 text-sm text-slate-700">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Eligibility Criteria</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ELIGIBILITY.map((e) => (
              <div key={e.title} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">{e.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotas & Income */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Special Quota Distribution</h2>
            <div className="space-y-3">
              {QUOTAS.map((q) => (
                <div key={q.label} className="flex items-center gap-4">
                  <div className={`w-12 text-center text-white text-sm font-bold py-1 rounded-lg ${q.color}`}>{q.pct}</div>
                  <span className="text-sm text-slate-700">{q.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Family Income Range</h2>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-emerald-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Group</th>
                    <th className="px-4 py-3 text-left">Income (PKR)</th>
                    <th className="px-4 py-3 text-right">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INCOME_GROUPS.map((g) => (
                    <tr key={g.group} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{g.group}</td>
                      <td className="px-4 py-3 text-slate-600">{g.from} – {g.to}</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-700">{g.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-800 to-teal-800 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Apply?</h2>
          <p className="text-emerald-100 mt-3 max-w-lg mx-auto">
            Create your account in minutes. Add your personal details after login, then submit your scholarship application online.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="px-8 py-3.5 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition-colors">
              Register Now
            </Link>
            <Link to="/login" className="px-8 py-3.5 border border-white/50 rounded-xl hover:bg-white/10 transition-colors">
              Sign In
            </Link>
            <Link to="/contact" className="px-8 py-3.5 border border-white/30 rounded-xl hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
