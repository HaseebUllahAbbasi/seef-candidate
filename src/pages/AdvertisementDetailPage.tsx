import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useMyApplications } from '../hooks/useMyApplications';
import { canEditApplication } from '../lib/applicationAccess';
import { STATUS_LABELS } from '../lib/applicationStatus';
import CountdownTimer from '../components/CountdownTimer';
import { SINDH_DISTRICTS } from '../lib/districts';
import { btnPrimary } from '../components/ui';
import { uploadUrl } from '../lib/uploads';

interface AdDetail {
  id: string;
  name: string;
  year: number;
  regNo: string;
  endDate: string;
  minCgpa?: number;
  province?: string;
  eligibleDistricts?: string[];
  eligibleCriteria?: string;
  ineligibleCriteria: string;
  documentUrl?: string | null;
  documentFileName?: string | null;
  status: string;
  programs: { id: string; programName: string; description?: string }[];
  quotas?: { seats: number; university?: { id: string; name: string } }[];
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{children}</h2>
  );
}

interface Props {
  publicMode?: boolean;
}

export default function AdvertisementDetailPage({ publicMode = false }: Props) {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getForAdvertisement } = useMyApplications();
  const [ad, setAd] = useState<AdDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [programId, setProgramId] = useState('');

  useEffect(() => {
    if (!id) return;
    api<AdDetail>(`/advertisements/public/${id}`)
      .then((data) => {
        setAd(data);
        setProgramId(data.programs[0]?.id ?? '');
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={publicMode ? 'max-w-4xl mx-auto px-4 py-8' : 'max-w-4xl mx-auto'}>
        <div className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className={`text-center py-16 ${publicMode ? 'px-4' : ''}`}>
        <p className="text-red-600">{error || 'Scholarship not found'}</p>
        <Link to={publicMode ? '/scholarships' : '/advertisements'} className="text-emerald-700 text-sm mt-2 inline-block">
          ← Back to scholarships
        </Link>
      </div>
    );
  }

  const existing = user ? getForAdvertisement(ad.id) : undefined;
  const deadline = new Date(ad.endDate);
  const isOpen = deadline.getTime() > Date.now() && ad.status === 'PUBLISHED';
  const uniQuota = ad.quotas?.find((q) => q.university?.id === user?.universityId);
  const canEdit = existing ? canEditApplication(existing) : false;
  const applyProgramId = existing?.programId ?? programId;
  const applyPath = applyProgramId ? `/apply/${ad.id}/${applyProgramId}` : undefined;
  const applyHref = applyPath
    ? (user ? applyPath : `/login?redirect=${encodeURIComponent(applyPath)}`)
    : undefined;

  const districtSummary = !ad.eligibleDistricts?.length || ad.eligibleDistricts.length >= SINDH_DISTRICTS.length
    ? 'All districts of Sindh'
    : ad.eligibleDistricts.join(', ');

  const docHref = ad.documentUrl ? uploadUrl(ad.documentUrl) : undefined;
  const isImageDoc = ad.documentFileName && /\.(jpe?g|png|gif|webp)$/i.test(ad.documentFileName);

  const statusLabel = existing
    ? (STATUS_LABELS[existing.status] || 'Applied')
    : (isOpen ? 'Open for applications' : 'Closed');

  const headerBadgeClass = existing
    ? (existing.status === 'DRAFT'
      ? 'bg-amber-400/30 text-amber-50 border-amber-300/50'
      : 'bg-white/15 text-white border-white/25')
    : (isOpen ? 'bg-white/10 text-emerald-50 border-white/20' : 'bg-white/5 text-emerald-200/80 border-white/10');

  return (
    <div className={`max-w-4xl mx-auto ${publicMode ? 'px-4 py-8' : ''}`}>
      <Link
        to={publicMode ? '/scholarships' : '/advertisements'}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-700 mb-4 transition-colors"
      >
        ← Back to scholarships
      </Link>

      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <header className="bg-gradient-to-br from-emerald-800 via-emerald-800 to-emerald-950 text-white px-6 py-7 md:px-8 md:py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 bg-white/10 border border-white/15 px-2.5 py-1 rounded-md">
                  {ad.year} · {ad.regNo}
                </span>
                {ad.minCgpa != null && (
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md border bg-white/10 text-emerald-50 border-white/20">
                    Min CGPA {ad.minCgpa.toFixed(1)}
                  </span>
                )}
                {user && (
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${headerBadgeClass}`}>
                    {statusLabel}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-[1.75rem] font-bold leading-tight tracking-tight">{ad.name}</h1>
              <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-emerald-100/90">
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-semibold">Apply before</dt>
                  <dd className="font-medium text-white mt-0.5">{deadline.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</dd>
                </div>
                {uniQuota && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-semibold">Your university</dt>
                    <dd className="font-medium text-white mt-0.5">{uniQuota.seats} seats allocated</dd>
                  </div>
                )}
              </dl>
            </div>
            <CountdownTimer endDate={ad.endDate} variant="hero" />
          </div>
        </header>

        {existing && (
          <div className={`px-6 py-3.5 text-sm border-b border-slate-200 ${
            existing.status === 'DRAFT' ? 'bg-amber-50 text-amber-900' : 'bg-emerald-50 text-emerald-900'
          }`}>
            <span className="font-semibold">Your application: </span>
            {STATUS_LABELS[existing.status] || existing.status.replace(/_/g, ' ')}
          </div>
        )}

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <section className="px-6 py-6 md:py-7">
            <SectionHeading>Eligibility</SectionHeading>
            {ad.eligibleCriteria ? (
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{ad.eligibleCriteria}</p>
            ) : (
              <ul className="text-sm text-slate-600 space-y-2 leading-relaxed">
                <li><strong className="text-slate-800">Minimum CGPA:</strong> {ad.minCgpa?.toFixed(1) ?? '—'}</li>
                <li><strong className="text-slate-800">Province:</strong> {ad.province ?? 'Sindh'}</li>
                <li><strong className="text-slate-800">Districts:</strong> {districtSummary}</li>
                <li>Enrolled in an HEC-recognized university in Sindh</li>
              </ul>
            )}
            <dl className="mt-4 text-sm text-slate-600 space-y-1.5 pt-4 border-t border-slate-100">
              <div><dt className="inline font-semibold text-slate-800">Min CGPA: </dt><dd className="inline">{ad.minCgpa?.toFixed(1) ?? '—'}</dd></div>
              <div><dt className="inline font-semibold text-slate-800">Districts: </dt><dd className="inline">{districtSummary}</dd></div>
            </dl>
          </section>
          <section className="px-6 py-6 md:py-7">
            <SectionHeading>Ineligibility</SectionHeading>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{ad.ineligibleCriteria}</p>
          </section>
        </div>

        {docHref && (
          <section className="border-t border-slate-200 px-6 py-6 bg-slate-50/40">
            <SectionHeading>Official advertisement</SectionHeading>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {isImageDoc && (
                <a href={docHref} target="_blank" rel="noreferrer" className="block shrink-0">
                  <img
                    src={docHref}
                    alt="Official advertisement"
                    className="max-w-full sm:max-w-xs rounded-lg border border-slate-200 shadow-sm"
                  />
                </a>
              )}
              <div>
                <p className="text-sm text-slate-600 mb-3">
                  {ad.documentFileName ?? 'Download the official advertisement document for full details.'}
                </p>
                <a
                  href={docHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View advertisement
                </a>
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-slate-200 bg-slate-50/30">
          <div className="px-6 pt-6 pb-4">
            <SectionHeading>Programs offered</SectionHeading>
            {ad.programs.length === 0 ? (
              <p className="text-sm text-slate-500">No programs listed.</p>
            ) : (
              <ul className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
                {ad.programs.map((p) => {
                  const isAppliedProgram = existing?.programId === p.id;
                  const isSelected = programId === p.id;
                  return (
                    <li key={p.id}>
                      {existing ? (
                        <div className={`px-4 py-3.5 text-sm flex items-center justify-between gap-3 ${isAppliedProgram ? 'bg-emerald-50/80' : 'text-slate-500'}`}>
                          <span className={isAppliedProgram ? 'font-semibold text-emerald-900' : ''}>{p.programName}</span>
                          {isAppliedProgram && (
                            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Selected</span>
                          )}
                        </div>
                      ) : (
                        <label className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50/60' : 'hover:bg-slate-50'}`}>
                          <input type="radio" name="program" value={p.id} checked={isSelected} onChange={() => setProgramId(p.id)} className="mt-0.5 text-emerald-600 focus:ring-emerald-500" />
                          <span className="text-sm font-medium text-slate-800">{p.programName}</span>
                        </label>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="px-6 py-5 border-t border-slate-200 bg-white">
            {existing ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={`/application/${existing.id}`} className={`${btnPrimary()} text-center flex-1 py-3 rounded-xl font-semibold`}>Track progress</Link>
                {canEdit && applyHref && (
                  <Link to={applyHref} className="text-center flex-1 py-3 rounded-xl border-2 border-emerald-700 text-emerald-800 font-semibold text-sm hover:bg-emerald-50 transition-colors">
                    {existing.status === 'DRAFT' ? 'Continue draft' : 'Update application'}
                  </Link>
                )}
              </div>
            ) : isOpen && applyHref ? (
              <>
                <Link to={applyHref} className={`${btnPrimary()} text-center block w-full py-3.5 rounded-xl font-semibold text-base`}>
                  {user ? 'Apply for this scholarship' : 'Login to apply'}
                </Link>
                {!user && (
                  <p className="text-xs text-center text-slate-500 mt-2">
                    New student? <Link to={`/register?redirect=${encodeURIComponent(applyHref)}`} className="text-emerald-700 font-medium hover:underline">Register first</Link>
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-center text-slate-500 py-2">Applications are closed for this scholarship.</p>
            )}
          </div>
        </section>
      </article>
    </div>
  );
}
