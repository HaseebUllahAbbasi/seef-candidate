import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import StatusStepper from '../components/StatusStepper';
import { ApplicationRecordPanel, ApplicationRecordHeader, ApplicationRecordStepper } from '../components/ApplicationRecordPanel';
import { STATUS_LABELS } from '../lib/applicationStatus';

interface AppRow {
  id: string;
  status: string;
  advertisementId: string;
  programId: string;
  advertisement: { name: string; year: number; id?: string };
  program: { programName: string };
  university: { name: string };
  submittedAt?: string;
}

export default function MyApplicationsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);

  useEffect(() => { api<AppRow[]>('/applications/mine').then(setApps); }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-sm text-slate-500 mt-1">Track progress and view everything you submitted for each scholarship</p>
      </div>

      {apps.map((a) => (
        <Link key={a.id} to={`/application/${a.id}`} className="block group">
          <ApplicationRecordPanel>
            <ApplicationRecordHeader
              title={a.advertisement?.name || 'Application'}
              subtitle={a.program?.programName}
              meta={`${a.university?.name} · Year ${a.advertisement?.year}`}
              badge={(
                <span className="inline-flex text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  {STATUS_LABELS[a.status] || a.status.replace(/_/g, ' ')}
                </span>
              )}
              advertisementId={a.advertisementId}
            />
            <ApplicationRecordStepper footer={a.submittedAt ? `Submitted ${new Date(a.submittedAt).toLocaleDateString()}` : 'Draft — not yet submitted'}>
              <StatusStepper status={a.status} compact />
            </ApplicationRecordStepper>
            <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-100 bg-emerald-50/20 group-hover:bg-emerald-50/50 transition-colors">
              <span className="text-sm text-emerald-800 font-semibold group-hover:underline">
                View application data & progress →
              </span>
              {a.status === 'DRAFT' && (
                <span
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="inline-block"
                >
                  <Link
                    to={`/apply/${a.advertisementId}/${a.programId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-medium"
                  >
                    Continue draft
                  </Link>
                </span>
              )}
            </div>
          </ApplicationRecordPanel>
        </Link>
      ))}

      {apps.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-emerald-200/70">
          <p className="text-slate-500">No applications yet.</p>
          <Link to="/advertisements" className="inline-block mt-3 text-emerald-700 font-medium hover:underline">
            Browse open scholarships →
          </Link>
        </div>
      )}
    </div>
  );
}
