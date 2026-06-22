import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Card } from '../components/ui';
import StatusStepper from '../components/StatusStepper';
import { STATUS_LABELS } from '../lib/applicationStatus';

interface AppRow {
  id: string;
  status: string;
  advertisementId: string;
  programId: string;
  advertisement: { name: string; year: number };
  program: { programName: string };
  university: { name: string };
  submittedAt?: string;
}

export default function MyApplicationsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);

  useEffect(() => { api<AppRow[]>('/applications/mine').then(setApps); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-sm text-slate-500 mt-1">Click an application to view your submitted details and documents</p>
      </div>

      {apps.map((a) => (
        <Link key={a.id} to={`/application/${a.id}`} className="block group">
          <Card title={a.advertisement?.name || 'Application'}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
              <div>
                <p className="text-sm font-medium text-emerald-800">{a.program?.programName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a.university?.name} · Year {a.advertisement?.year}</p>
                {a.submittedAt && (
                  <p className="text-xs text-slate-400 mt-1">Submitted {new Date(a.submittedAt).toLocaleDateString()}</p>
                )}
              </div>
              <span className="inline-flex self-start text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-100">
                {STATUS_LABELS[a.status] || a.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
              <StatusStepper status={a.status} />
            </div>

            <div className="flex gap-3 flex-wrap items-center">
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
                    Continue Application
                  </Link>
                </span>
              )}
              <span className="text-sm text-emerald-700 font-medium group-hover:underline">
                View full application →
              </span>
            </div>
          </Card>
        </Link>
      ))}

      {apps.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500">No applications yet.</p>
          <Link to="/advertisements" className="inline-block mt-3 text-emerald-700 font-medium hover:underline">
            Browse open scholarships →
          </Link>
        </div>
      )}
    </div>
  );
}
