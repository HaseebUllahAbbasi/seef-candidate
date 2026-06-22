import { Link } from 'react-router-dom';

export function ApplicationRecordPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-emerald-200/70 shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

export function ApplicationRecordHeader({
  title,
  subtitle,
  meta,
  badge,
  advertisementId,
  advertisementLabel = 'View scholarship advertisement',
  actions,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: React.ReactNode;
  advertisementId?: string;
  advertisementLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-white to-white">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="text-sm font-medium text-emerald-800">{subtitle}</p>}
          {meta && <p className="text-xs text-slate-500 mt-0.5">{meta}</p>}
          {advertisementId && (
            <Link
              to={`/advertisement/${advertisementId}`}
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-900 border border-emerald-200 bg-white px-3 py-1.5 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
            >
              {advertisementLabel}
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export function ApplicationRecordStepper({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="px-5 py-5 border-b border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white">
      {children}
      {footer && <p className="text-xs text-slate-500 mt-3 text-center">{footer}</p>}
    </div>
  );
}

export function ApplicationRecordSection({
  step,
  title,
  action,
  children,
}: {
  step: number | string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-200/90 last:border-b-0 transition-colors hover:bg-emerald-50/30">
      <div className="flex items-center gap-3 px-5 py-3 bg-slate-50/80 border-b border-slate-100">
        <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
          {step}
        </span>
        <h2 className="font-semibold text-slate-800 flex-1 text-sm md:text-base">{title}</h2>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export function DataGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const colClass = cols === 4 ? 'lg:grid-cols-4' : cols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2';
  return <dl className={`grid grid-cols-1 sm:grid-cols-2 ${colClass} gap-x-6 gap-y-4`}>{children}</dl>;
}

export function DataField({ label, value, fullWidth }: { label: string; value?: React.ReactNode; fullWidth?: boolean }) {
  if (value === undefined || value === null || value === '') return null;
  const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
  return (
    <div className={fullWidth ? 'sm:col-span-2 lg:col-span-full' : ''}>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-900 font-medium mt-0.5 whitespace-pre-wrap">{display}</dd>
    </div>
  );
}

export function DataRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-lg border border-slate-200/90 bg-slate-50/50 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors">
      {children}
    </div>
  );
}
