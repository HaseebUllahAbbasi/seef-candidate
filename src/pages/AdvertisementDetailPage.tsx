import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useMyApplications } from '../hooks/useMyApplications';
import { canEditApplication } from '../lib/applicationAccess';
import { STATUS_LABELS, statusBadgeClasses } from '../lib/applicationStatus';
import CountdownTimer from '../components/CountdownTimer';
import { Card, btnPrimary } from '../components/ui';

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
    return <div className="h-64 bg-white rounded-2xl border animate-pulse" />;
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
  const statusClass = existing
    ? statusBadgeClasses(existing.status)
    : (isOpen ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30' : 'bg-white/10 text-emerald-200 border-white/20');

  return (
    <div className="space-y-6">
      <Link to="/advertisements" className="text-sm text-emerald-700 hover:underline">← Back to scholarships</Link>

      <div className="grid lg:grid-cols-[1fr_auto] gap-4 items-start">
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-6 md:p-8 text-white shadow-lg">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 bg-white/10 px-2.5 py-1 rounded-full">
                {ad.year} · {ad.regNo}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold mt-3">{ad.name}</h1>
              {ad.catchyLine && <p className="text-emerald-100 mt-2">{ad.catchyLine}</p>}
            </div>
            <span className={`text-sm font-medium px-3 py-1.5 rounded-full border ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-emerald-100">
            <span>Opens: {new Date(ad.startDate).toLocaleDateString()}</span>
            <span>Deadline: {deadline.toLocaleDateString()}</span>
            {uniQuota && <span>{uniQuota.seats} seats at your university</span>}
          </div>
        </div>
        <CountdownTimer endDate={ad.endDate} />
      </div>

      {existing && (
        <div className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
          existing.status === 'DRAFT' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div>
            <p className={`font-medium ${existing.status === 'DRAFT' ? 'text-amber-900' : 'text-emerald-900'}`}>
              You have already started an application for this scholarship
            </p>
            <p className={`text-sm mt-0.5 ${existing.status === 'DRAFT' ? 'text-amber-800' : 'text-emerald-800'}`}>
              Status: {STATUS_LABELS[existing.status] || existing.status.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Eligibility">
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{ad.eligibleCriteria}</p>
        </Card>
        <Card title="Ineligibility">
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{ad.ineligibleCriteria}</p>
        </Card>
      </div>

      {ad.additionalNote && (
        <Card title="Additional notes">
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{ad.additionalNote}</p>
        </Card>
      )}
      {ad.attentionNote && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
          <strong>Attention:</strong> {ad.attentionNote}
        </div>
      )}

      <Card title="Programs">
        {ad.programs.length === 0 ? (
          <p className="text-sm text-slate-500">No programs listed.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {ad.programs.map((p) => {
              const isAppliedProgram = existing?.programId === p.id;
              return (
                <li key={p.id}>
                  {existing ? (
                    <div className={`py-3 ${isAppliedProgram ? 'text-emerald-800 font-semibold' : 'text-slate-500'}`}>
                      {p.programName}
                      {p.description && <p className="text-sm font-normal text-slate-500 mt-0.5">{p.description}</p>}
                      {isAppliedProgram && <span className="ml-2 text-xs font-medium text-emerald-600">(your program)</span>}
                    </div>
                  ) : (
                    <label className={`flex items-start gap-3 py-3 cursor-pointer ${programId === p.id ? 'text-slate-900' : 'text-slate-600'}`}>
                      <input
                        type="radio"
                        name="program"
                        value={p.id}
                        checked={programId === p.id}
                        onChange={() => setProgramId(p.id)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>
                        <span className="font-medium">{p.programName}</span>
                        {p.description && <p className="text-sm text-slate-500 mt-0.5">{p.description}</p>}
                      </span>
                    </label>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100">
          {existing ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to={`/application/${existing.id}`} className={`${btnPrimary()} text-center flex-1 py-3`}>
                View application & progress
              </Link>
              {canEdit && applyHref && (
                <Link
                  to={applyHref}
                  className="text-center flex-1 py-3 border border-emerald-600 text-emerald-800 rounded-lg hover:bg-emerald-50 text-sm font-medium"
                >
                  {existing.status === 'DRAFT' ? 'Continue draft' : 'Update application'}
                </Link>
              )}
            </div>
          ) : isOpen && applyHref ? (
            <Link to={applyHref} className={`${btnPrimary()} text-center block w-full py-3`}>
              Apply now
            </Link>
          ) : (
            <p className="text-sm text-center text-slate-500">Applications are closed for this scholarship.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
