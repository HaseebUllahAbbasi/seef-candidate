import { Link } from 'react-router-dom';

export interface ScholarshipAd {
  id: string;
  name: string;
  year: number;
  catchyLine?: string;
  endDate: string;
  status?: string;
  programs?: { id: string; programName: string }[];
}

interface Props {
  ad: ScholarshipAd;
  variant?: 'landing' | 'compact';
  applyBasePath?: string;
  applyHref?: string;
  showAction?: boolean;
  detailHref?: string;
  hidePrograms?: boolean;
}

export default function ScholarshipCard({
  ad,
  variant = 'landing',
  applyBasePath = '/login',
  applyHref,
  showAction = true,
  detailHref,
  hidePrograms = false,
}: Props) {
  const deadline = new Date(ad.endDate);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOpen = daysLeft > 0;

  const body = (
    <>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400" />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            {ad.year} Session
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isOpen ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
          {ad.name}
        </h3>
        {ad.catchyLine && (
          <p className="text-sm text-slate-500 mt-2 line-clamp-2">{ad.catchyLine}</p>
        )}

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Deadline: <strong className="text-slate-700">{deadline.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
          {isOpen && daysLeft <= 30 && (
            <span className="text-amber-600 font-medium">· {daysLeft} days left</span>
          )}
        </div>

        {!hidePrograms && ad.programs && ad.programs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {ad.programs.slice(0, 4).map((p) => (
              <span key={p.id} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                {p.programName}
              </span>
            ))}
            {ad.programs.length > 4 && (
              <span className="text-[11px] px-2 py-0.5 text-slate-400">+{ad.programs.length - 4} more</span>
            )}
          </div>
        )}

        {showAction && (
          <div className="mt-auto pt-5 flex flex-col sm:flex-row gap-2">
            {detailHref && (
              <Link
                to={detailHref}
                className="inline-flex items-center justify-center flex-1 gap-2 px-4 py-2.5 border border-emerald-200 text-emerald-800 bg-white text-sm font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
              >
                View details
              </Link>
            )}
            {(applyHref || applyBasePath) && isOpen && (
              <Link
                to={applyHref || applyBasePath}
                className="inline-flex items-center justify-center flex-1 gap-2 px-4 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition-colors shadow-sm shadow-emerald-600/20"
              >
                Apply now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );

  const className = `group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 overflow-hidden ${variant === 'landing' ? 'flex flex-col h-full' : ''}`;

  return <article className={className}>{body}</article>;
}
