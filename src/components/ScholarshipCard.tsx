import { Link } from 'react-router-dom';
import { canEditApplication } from '../lib/applicationAccess';
import { STATUS_LABELS, statusBadgeClasses } from '../lib/applicationStatus';
import { uploadUrl } from '../lib/uploads';
import { SINDH_DISTRICTS } from '../lib/districts';
import { btnPrimary } from './ui';

export interface ScholarshipAd {
  id: string;
  name: string;
  year: number;
  regNo?: string;
  endDate: string;
  minCgpa?: number;
  province?: string;
  eligibleDistricts?: string[];
  eligibleCriteria?: string;
  documentUrl?: string | null;
  documentFileName?: string | null;
  status?: string;
  programs?: { id: string; programName: string }[];
  quotas?: { seats: number }[];
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

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-slate-600">
      <span className="text-emerald-600 shrink-0 mt-0.5">{icon}</span>
      <span>
        {label}: <strong className="text-slate-900 font-semibold">{value}</strong>
      </span>
    </div>
  );
}

const iconUsers = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const iconStar = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);
const iconBook = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const iconBriefcase = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const iconCap = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824 2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);
const iconMap = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

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

  const totalSeats = ad.quotas?.reduce((s, q) => s + q.seats, 0) ?? 0;
  const programCount = ad.programs?.length ?? 0;
  const districtLabel = !ad.eligibleDistricts?.length || ad.eligibleDistricts.length >= SINDH_DISTRICTS.length
    ? 'All Sindh'
    : `${ad.eligibleDistricts.length} districts`;
  const programLabel = programCount === 1
    ? ad.programs![0].programName
    : `${programCount} programs`;
  const docHref = ad.documentUrl ? uploadUrl(ad.documentUrl) : undefined;
  const deadlineLabel = deadline.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

  const body = (
    <>
      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
        <span className="text-[5.5rem] font-black text-emerald-600/[0.04] select-none tracking-tighter">SEEF</span>
      </div>

      <div className="relative p-5 sm:p-6 flex flex-col flex-1">
        {/* Top badges */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <span className="inline-flex items-center text-xs font-bold text-white bg-emerald-600 px-3 py-1 rounded-full shadow-sm">
            {ad.regNo ?? ad.year}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-red-500 px-3 py-1 rounded-full shadow-sm shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Last date: {deadlineLabel}
          </span>
        </div>

        {existingApplication && (
          <span className={`self-start text-[10px] font-semibold px-2 py-1 rounded-md border mb-3 ${statusBadgeClasses(existingApplication.status)}`}>
            {STATUS_LABELS[existingApplication.status] || 'Applied'}
          </span>
        )}

        <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 leading-tight line-clamp-2">
          {ad.name}
        </h3>

        <p className="mt-2 flex items-start gap-2 text-sm text-emerald-700/90 font-medium">
          {iconBriefcase}
          <span className="line-clamp-2"> SEEF Merit Scholarship {ad.year}</span>
        </p>

        {ad.eligibleCriteria && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed border-l-2 border-emerald-200 pl-2.5">
            {ad.eligibleCriteria}
          </p>
        )}

        {/* Details grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
          {totalSeats > 0 && (
            <DetailRow icon={iconUsers} label="Seats" value={totalSeats} />
          )}
          {ad.minCgpa != null && (
            <DetailRow icon={iconStar} label="Min CGPA" value={ad.minCgpa.toFixed(1)} />
          )}
          {!hidePrograms && programCount > 0 && (
            <DetailRow icon={iconCap} label="Programs" value={programLabel} />
          )}
          <DetailRow icon={iconBook} label="Type" value="Merit scholarship" />
          <DetailRow icon={iconMap} label="Districts" value={districtLabel} />
          <DetailRow icon={iconBriefcase} label="Province" value={ad.province ?? 'Sindh'} />
        </div>

        {isOpen && daysLeft <= 30 && !existingApplication && (
          <p className="mt-3 text-xs font-medium text-amber-700">Only {daysLeft} day{daysLeft === 1 ? '' : 's'} left to apply</p>
        )}

        {existingApplication && (
          <p className="mt-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            You have already applied for this scholarship.
          </p>
        )}

        {showAction && (
          <div className="mt-auto pt-5 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-100/80">
            <div className="flex flex-wrap gap-3">
              {docHref && (
                <a
                  href={docHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View advertisement
                </a>
              )}
              {detailHref && (
                <Link
                  to={detailHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  View details
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-2 ml-auto">
              {existingApplication ? (
                <>
                  <Link to={`/application/${existingApplication.id}`} className={`${btnPrimary()} text-sm py-2 px-4 rounded-full font-semibold`}>
                    Track progress
                  </Link>
                  {canEdit && continueHref && (
                    <Link to={continueHref} className="text-sm py-2 px-4 rounded-full border border-emerald-600 text-emerald-800 font-semibold hover:bg-emerald-50 transition-colors">
                      {existingApplication.status === 'DRAFT' ? 'Continue draft' : 'Update'}
                    </Link>
                  )}
                </>
              ) : (
                isOpen && applyPath && (
                  <Link
                    to={publicView && applyPath.startsWith('/apply') ? `/login?redirect=${encodeURIComponent(applyPath)}` : applyPath}
                    className={`${btnPrimary()} inline-flex items-center gap-2 text-sm py-2.5 px-5 rounded-full font-semibold shadow-md shadow-emerald-600/20`}
                  >
                    Apply now
                    <span aria-hidden>→</span>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );

  const className = `group relative bg-white rounded-2xl border-2 border-emerald-500/80 shadow-md shadow-emerald-900/5 hover:shadow-lg hover:border-emerald-600 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${variant === 'landing' ? 'flex flex-col h-full' : ''}`;

  return <article className={className}>{body}</article>;
}
