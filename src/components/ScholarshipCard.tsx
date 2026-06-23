import { Link } from 'react-router-dom';
import { canEditApplication } from '../lib/applicationAccess';
import { STATUS_LABELS, statusBadgeClasses } from '../lib/applicationStatus';
import { btnPrimary } from './ui';

export interface ScholarshipAd {
  id: string;
  name: string;
  year: number;
  endDate: string;
  minCgpa?: number;
  status?: string;
  programs?: { id: string; programName: string }[];
}

export interface ExistingApplication {
  id: string;
  status: string;
  programId: string;
  editUnlocked?: boolean;
}

interface Props {
  ad: ScholarshipAd;
  variant?: 'landing' | 'compact';
  applyBasePath?: string;
  applyHref?: string;
  showAction?: boolean;
  detailHref?: string;
  hidePrograms?: boolean;
  existingApplication?: ExistingApplication;
  publicView?: boolean;
}

export default function ScholarshipCard({
  ad,
  variant = 'landing',
  applyBasePath = '/login',
  applyHref,
  showAction = true,
  detailHref,
  hidePrograms = false,
  existingApplication,
  publicView = false,
}: Props) {
  const deadline = new Date(ad.endDate);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOpen = daysLeft > 0;
  const canEdit = existingApplication ? canEditApplication(existingApplication) : false;
  const firstProgramId = ad.programs?.[0]?.id;
  const applyPath = applyHref ?? (firstProgramId ? `/apply/${ad.id}/${firstProgramId}` : applyBasePath);
  const continueHref = existingApplication
    ? `/apply/${ad.id}/${existingApplication.programId}`
    : applyPath;

  const body = (
    <>
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400" />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
              {ad.year}
            </span>
            {ad.minCgpa != null && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                Min CGPA {ad.minCgpa.toFixed(1)}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-md border shrink-0 ${
            existingApplication
              ? statusBadgeClasses(existingApplication.status)
              : (isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200')
          }`}>
            {existingApplication
              ? (STATUS_LABELS[existingApplication.status] || 'Applied')
              : (isOpen ? 'Open' : 'Closed')}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
          {ad.name}
        </h3>

        {existingApplication && (
          <p className="mt-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            You have already applied for this scholarship.
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Deadline: <strong className="text-slate-700">{deadline.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
          {isOpen && daysLeft <= 30 && (
            <span className="text-amber-600 font-medium">· {daysLeft}d left</span>
          )}
        </div>

        {!hidePrograms && ad.programs && ad.programs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {ad.programs.slice(0, 3).map((p) => (
              <span key={p.id} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200/80">
                {p.programName}
              </span>
            ))}
            {ad.programs.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 text-slate-400">+{ad.programs.length - 3}</span>
            )}
          </div>
        )}

        {showAction && (
          <div className="mt-auto pt-5 flex flex-col gap-2">
            {detailHref && (
              <Link
                to={detailHref}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-200 text-emerald-800 bg-white text-sm font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
              >
                View details
              </Link>
            )}
            {existingApplication ? (
              <>
                <Link to={`/application/${existingApplication.id}`} className={`${btnPrimary()} text-center py-2.5 rounded-xl font-semibold text-sm`}>
                  Track progress
                </Link>
                {canEdit && continueHref && (
                  <Link to={continueHref} className="text-center py-2.5 rounded-xl border border-emerald-600 text-emerald-800 text-sm font-semibold hover:bg-emerald-50 transition-colors">
                    {existingApplication.status === 'DRAFT' ? 'Continue draft' : 'Update application'}
                  </Link>
                )}
              </>
            ) : (
              isOpen && applyPath && (
                <Link
                  to={publicView && applyPath.startsWith('/apply') ? `/login?redirect=${encodeURIComponent(applyPath)}` : applyPath}
                  className={`${btnPrimary()} text-center py-2.5 rounded-xl font-semibold text-sm shadow-sm shadow-emerald-600/15`}
                >
                  {publicView ? 'Login to apply' : 'Apply now'}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </>
  );

  const className = `group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${variant === 'landing' ? 'flex flex-col h-full' : ''}`;

  return <article className={className}>{body}</article>;
}
