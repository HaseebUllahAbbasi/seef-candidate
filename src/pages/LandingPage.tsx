import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import ScholarshipCard, { ScholarshipAd } from '../components/ScholarshipCard';
import { api } from '../lib/api';
import { DEMO_SCHOLARSHIPS } from '../lib/seefContent';
import {
  FEATURES, HERO_SLIDES, IMPACT_STATS, NEWS_ITEMS, SCHOLARSHIP_PROCESS, TESTIMONIALS,
} from '../lib/landingContent';

function FeatureIcon({ name }: { name: string }) {
  const cls = 'w-8 h-8 text-emerald-600';
  const icons: Record<string, React.ReactNode> = {
    graduation: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0v7M6 16v2a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>,
    book: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    hands: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    star: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    people: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    users: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    building: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    award: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
    map: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
    school: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /></svg>,
    university: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /></svg>,
    heart: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    tools: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>,
  };
  return <>{icons[name] ?? icons.star}</>;
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">{children}</p>
  );
}

export default function LandingPage() {
  const [scholarships, setScholarships] = useState<ScholarshipAd[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const hero = HERO_SLIDES[heroIdx];
  const testimonial = TESTIMONIALS[testimonialIdx];

  useEffect(() => {
    api<ScholarshipAd[]>('/advertisements/public')
      .then((data) => setScholarships(data.length > 0 ? data : DEMO_SCHOLARSHIPS))
      .catch(() => setScholarships(DEMO_SCHOLARSHIPS));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-[#0a3d28] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 min-h-[520px]">
            <div className="px-6 md:px-10 py-14 lg:py-20 flex flex-col justify-center z-10">
              <div key={heroIdx} className="transition-opacity duration-500">
                <p className="text-emerald-300 text-xs font-bold uppercase tracking-[0.18em] mb-4">{hero.tag}</p>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight">{hero.title}</h1>
                <p className="mt-5 text-emerald-100/90 text-base leading-relaxed max-w-lg">{hero.description}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="px-6 py-3.5 bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold rounded-md shadow-lg shadow-black/20 transition-colors">
                  Apply for Scholarship
                </Link>
                <Link to="/scholarships" className="px-6 py-3.5 border-2 border-white/50 text-white font-semibold rounded-md hover:bg-white/10 transition-colors">
                  View Scholarships
                </Link>
              </div>
              <div className="mt-10 flex gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setHeroIdx(i)}
                    className={`h-2 rounded-full transition-all ${i === heroIdx ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative min-h-[280px] lg:min-h-0 p-4 lg:p-6 flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                {HERO_SLIDES.map((slide, i) => (
                  <img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.imageAlt}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      i === heroIdx ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a3d28]/60 via-transparent to-transparent pointer-events-none" />
                {hero.badges && (
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-emerald-600/90 backdrop-blur text-white text-xs font-semibold rounded-lg">
                      {hero.badges[0]}
                    </span>
                    <span className="px-3 py-1.5 bg-white/90 text-emerald-900 text-xs font-semibold rounded-lg">
                      {hero.badges[1]}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative -mt-8 z-10 px-4">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center lg:text-left px-2">
                <div className="w-14 h-14 mx-auto lg:mx-0 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                  <FeatureIcon name={f.icon} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarship process */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <SectionTag>SEEF Scholarship Process</SectionTag>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">How to Apply</h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
              Simple process. Transparent journey. Brighter future.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-8 shadow-sm">
            <img
              src={SCHOLARSHIP_PROCESS.image}
              alt={SCHOLARSHIP_PROCESS.imageAlt}
              className="w-full h-auto"
            />
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/register"
              className="inline-flex px-6 py-3 bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold rounded-md shadow-md transition-colors"
            >
              Start your application
            </Link>
          </div>
        </div>
      </section>

      {/* Impact teaser → About */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <SectionTag>Our Impact</SectionTag>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Making a Difference Every Day</h2>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {IMPACT_STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <FeatureIcon name={s.icon} />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-emerald-700">{s.value}</p>
                <p className="text-sm text-slate-600 mt-2 max-w-[160px]">{s.label}</p>
              </div>
            ))}
          </div>
          <Link to="/about" className="inline-block mt-10 text-emerald-700 font-semibold hover:underline">
            Learn more about SEEF →
          </Link>
        </div>
      </section>

      {/* Open scholarships from API */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <SectionTag>Scholarships</SectionTag>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Open Advertisements</h2>
              <p className="text-slate-500 mt-2">Browse active SEEF scholarships and apply online.</p>
            </div>
            <Link to="/scholarships" className="text-emerald-700 font-semibold hover:underline">View all →</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.slice(0, 3).map((ad) => (
              <ScholarshipCard key={ad.id} ad={ad} publicView detailHref={`/scholarship/${ad.id}`} applyBasePath="/login" />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative py-20 overflow-hidden">
        <img src="/landing/testimonial-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a3d28]/85" />
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <button type="button" onClick={() => setTestimonialIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 hover:bg-white/10 hidden sm:flex items-center justify-center" aria-label="Previous">‹</button>
          <svg className="w-10 h-10 mx-auto text-emerald-400/80 mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic">&ldquo;{testimonial.quote}&rdquo;</blockquote>
          <div className="mt-8 flex flex-col items-center gap-3">
            <img src={testimonial.avatar} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-400" />
            <div>
              <p className="font-bold">{testimonial.name}</p>
              <p className="text-sm text-emerald-200">{testimonial.role}</p>
            </div>
          </div>
          <button type="button" onClick={() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 hover:bg-white/10 hidden sm:flex items-center justify-center" aria-label="Next">›</button>
        </div>
      </section>

      {/* News teaser */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <SectionTag>News & Events</SectionTag>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Stay Updated with SEEF</h2>
            </div>
            <Link to="/news" className="text-emerald-700 font-semibold hover:underline">View all news →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NEWS_ITEMS.slice(0, 4).map((n) => (
              <article key={n.id} className="group rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all bg-white">
                <div className="h-40 overflow-hidden">
                  <img src={n.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-emerald-700">{n.category}</span>
                    <span>·</span>
                    {n.date}
                  </p>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{n.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{n.excerpt}</p>
                  <Link to="/news" className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-emerald-700 hover:underline">Read more →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a3d28] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <p className="text-xl md:text-2xl font-semibold max-w-2xl leading-snug">
            Together, let&apos;s build a brighter future for Sindh. Support education. Support dreams.
          </p>
          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            <Link to="/contact" className="px-6 py-3 border-2 border-white/60 rounded-md font-semibold hover:bg-white/10 transition-colors">Donate Now</Link>
            <Link to="/register" className="px-6 py-3 bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold rounded-md shadow-lg transition-colors">Apply for Scholarship</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
