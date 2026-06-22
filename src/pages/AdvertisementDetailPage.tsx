import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useMyApplications } from '../hooks/useMyApplications';
import { canEditApplication } from '../lib/applicationAccess';
import { STATUS_LABELS } from '../lib/applicationStatus';
import CountdownTimer from '../components/CountdownTimer';
import { btnPrimary } from '../components/ui';

interface AdDetail {
  id: string;
  name: string;
  year: number;
  regNo: string;
  catchyLine?: string;
  startDate: string;
  endDate: string;
  eligibleCriteria: string;
  ineligibleCriteria: string;
  additionalNote?: string;
  attentionNote?: string;
  status: string;
  programs: { id: string; programName: string; programCode?: string; description?: string }[];
  quotas?: { seats: number; university?: { id: string; name: string } }[];
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
      {children}
    </h2>
  );
}

export default function AdvertisementDetailPage() {
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
      <div className="max-w-4xl mx-auto">
        <div className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600">{error || 'Advertisement not found'}</p>
        <Link to="/advertisements" className="text-emerald-700 text-sm mt-2 inline-block">← Back to scholarships</Link>
      </div>
    );
  }

  const existing = getForAdvertisement(ad.id);
  const deadline = new Date(ad.endDate);
  const isOpen = deadline.getTime() > Date.now() && ad.status === 'PUBLISHED';
  const uniQuota = ad.quotas?.find((q) => q.university?.id === user?.universityId);
  const canEdit = existing ? canEditApplication(existing) : false;
  const applyProgramId = existing?.programId ?? programId;
  const applyHref = applyProgramId ? `/apply/${ad.id}/${applyProgramId}` : undefined;

  const statusLabel = existing
    ? (STATUS_LABELS[existing.status] || 'Applied')
    : (isOpen ? 'Open for applications' : 'Closed');

  const headerBadgeClass = existing
    ? (existing.status === 'DRAFT'
      ? 'bg-amber-400/30 text-amber-50 border-amber-300/50'
      : existing.status === 'REJECTED'
        ? 'bg-red-400/25 text-red-50 border-red-300/40'
        : 'bg-white/15 text-white border-white/25')
    : (isOpen ? 'bg-white/10 text-emerald-50 border-white/20' : 'bg-white/5 text-emerald-200/80 border-white/10');

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/advertisements"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-700 mb-4 transition-colors"
      >
        ← Back to scholarships
      </Link>

      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-br from-emerald-800 via-emerald-800 to-emerald-950 text-white px-6 py-7 md:px-8 md:py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 bg-white/10 border border-white/15 px-2.5 py-1 rounded-md">
                  {ad.year} · {ad.regNo}
                </span>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${headerBadgeClass}`}>
                  {statusLabel}
                </span>
              </div>
              <h1 className="text-2xl md:text-[1.75rem] font-bold leading-tight tracking-tight">{ad.name}</h1>
              {ad.catchyLine && (
                <p className="text-emerald-100/90 mt-2 text-sm md:text-base leading-relaxed">{ad.catchyLine}</p>
              )}
              <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-emerald-100/90">
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-semibold">Opens</dt>
                  <dd className="font-medium text-white mt-0.5">{new Date(ad.startDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-semibold">Deadline</dt>
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

        {/* In-page notices */}
        {(existing || ad.attentionNote) && (
          <div className="border-b border-slate-200 divide-y divide-slate-200">
            {existing && (
              <div className={`px-6 py-3.5 text-sm ${
                existing.status === 'DRAFT' ? 'bg-amber-50 text-amber-900' : 'bg-emerald-50 text-emerald-900'
              }`}>
                <span className="font-semibold">Your application: </span>
                <span className={existing.status === 'DRAFT' ? 'text-amber-800' : 'text-emerald-800'}>
                  {STATUS_LABELS[existing.status] || existing.status.replace(/_/g, ' ')}
                </span>
              </div>
            )}
            {ad.attentionNote && (
              <div className="px-6 py-3.5 text-sm bg-amber-50/60 text-amber-900">
                <span className="font-semibold">Note: </span>{ad.attentionNote}
              </div>
            )}
          </div>
        )}

        {/* Criteria */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <section className="px-6 py-6 md:py-7">
            <SectionHeading>Eligibility</SectionHeading>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{ad.eligibleCriteria}</p>
          </section>
          <section className="px-6 py-6 md:py-7">
            <SectionHeading>Ineligibility</SectionHeading>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{ad.ineligibleCriteria}</p>
          </section>
        </div>

        {ad.additionalNote && (
          <section className="px-6 py-6 border-t border-slate-200 bg-slate-50/40">
            <SectionHeading>Additional notes</SectionHeading>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{ad.additionalNote}</p>
          </section>
        )}

        {/* Programs + action */}
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
                        <div className={`px-4 py-3.5 text-sm flex items-center justify-between gap-3 ${
                          isAppliedProgram ? 'bg-emerald-50/80' : 'text-slate-500'
                        }`}>
                          <span className={isAppliedProgram ? 'font-semibold text-emerald-900' : ''}>{p.programName}</span>
                          {isAppliedProgram && (
                            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </div>
                      ) : (
                        <label
                          className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
                            isSelected ? 'bg-emerald-50/60' : 'hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="program"
                            value={p.id}
                            checked={isSelected}
                            onChange={() => setProgramId(p.id)}
                            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm">
                            <span className={`font-medium ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{p.programName}</span>
                            {p.description && <p className="text-slate-500 mt-0.5 text-xs">{p.description}</p>}
                          </span>
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
                <Link to={`/application/${existing.id}`} className={`${btnPrimary()} text-center flex-1 py-3 rounded-xl font-semibold`}>
                  Track progress
                </Link>
                {canEdit && applyHref && (
                  <Link
                    to={applyHref}
                    className="text-center flex-1 py-3 rounded-xl border-2 border-emerald-700 text-emerald-800 font-semibold text-sm hover:bg-emerald-50 transition-colors"
                  >
                    {existing.status === 'DRAFT' ? 'Continue draft' : 'Update application'}
                  </Link>
                )}
              </div>
            ) : isOpen && applyHref ? (
              <Link to={applyHref} className={`${btnPrimary()} text-center block w-full py-3.5 rounded-xl font-semibold text-base`}>
                Apply for this scholarship
              </Link>
            ) : (
              <p className="text-sm text-center text-slate-500 py-2">Applications are closed for this scholarship.</p>
            )}
          </div>
        </section>
      </article>
    </div>
  );
}
