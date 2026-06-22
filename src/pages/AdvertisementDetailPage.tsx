import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
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
  const [ad, setAd] = useState<AdDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api<AdDetail>(`/advertisements/public/${id}`)
      .then(setAd)
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

  const deadline = new Date(ad.endDate);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOpen = daysLeft > 0 && ad.status === 'PUBLISHED';
  const uniQuota = ad.quotas?.find((q) => q.university?.id === user?.universityId);

  return (
    <div className="space-y-6">
      <Link to="/advertisements" className="text-sm text-emerald-700 hover:underline">← Back to scholarships</Link>

      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 bg-white/10 px-2.5 py-1 rounded-full">
              {ad.year} · {ad.regNo}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-3">{ad.name}</h1>
            {ad.catchyLine && <p className="text-emerald-100 mt-2">{ad.catchyLine}</p>}
          </div>
          <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${isOpen ? 'bg-emerald-500/20 text-emerald-100' : 'bg-white/10 text-emerald-200'}`}>
            {isOpen ? 'Open for applications' : 'Closed'}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-emerald-100">
          <span>Opens: {new Date(ad.startDate).toLocaleDateString()}</span>
          <span>Deadline: {deadline.toLocaleDateString()}</span>
          {isOpen && daysLeft <= 30 && <span className="text-amber-200 font-medium">{daysLeft} days left</span>}
          {uniQuota && <span>{uniQuota.seats} seats at your university</span>}
        </div>
      </div>

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

      <Card title="Programs — select to apply">
        {ad.programs.length === 0 ? (
          <p className="text-sm text-slate-500">No programs listed.</p>
        ) : (
          <div className="space-y-3">
            {ad.programs.map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-900">{p.programName}</p>
                  {p.description && <p className="text-sm text-slate-500 mt-0.5">{p.description}</p>}
                </div>
                {isOpen ? (
                  <Link to={`/apply/${ad.id}/${p.id}`} className={`${btnPrimary()} text-center shrink-0 px-5 py-2.5`}>
                    Apply now
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400">Applications closed</span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
