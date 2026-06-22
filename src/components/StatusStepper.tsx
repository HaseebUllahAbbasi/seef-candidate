import { APPLICATION_STEPS, statusToStepIndex } from '../lib/applicationStatus';

function StepIcon({ type, className }: { type: string; className?: string }) {
  const cn = className ?? 'w-5 h-5';
  const icons: Record<string, React.ReactNode> = {
    user: (
      <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    shield: (
      <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    list: (
      <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    calendar: (
      <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    users: (
      <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    chart: (
      <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    award: (
      <svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-1.884 1.934M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
  };
  return <>{icons[type] ?? icons.user}</>;
}

interface Props {
  status: string;
  compact?: boolean;
}

export default function StatusStepper({ status, compact }: Props) {
  const current = statusToStepIndex(status);
  const isRejected = status === 'REJECTED';
  const isDraft = status === 'DRAFT';

  return (
    <div className={`w-full overflow-x-auto ${compact ? '' : 'py-2'}`}>
      <div className="flex items-start min-w-max px-1">
        {APPLICATION_STEPS.map((step, i) => {
          const completed = !isDraft && !isRejected && current >= i;
          const active = !isRejected && current === i;
          const failed = isRejected && i === Math.max(0, current === -2 ? 0 : current);

          let circleClass = 'bg-slate-200 text-slate-400 border-slate-200';
          let lineClass = 'bg-slate-200';
          let labelClass = 'text-slate-400';

          if (failed) {
            circleClass = 'bg-red-100 text-red-600 border-red-300';
            labelClass = 'text-red-600 font-medium';
          } else if (completed) {
            circleClass = 'bg-emerald-700 text-white border-emerald-700';
            lineClass = 'bg-emerald-600';
            labelClass = 'text-emerald-800 font-medium';
          } else if (active) {
            circleClass = 'bg-emerald-700 text-white border-emerald-700 ring-4 ring-emerald-100';
            labelClass = 'text-emerald-800 font-semibold';
          }

          return (
            <div key={step.key} className="flex items-start flex-1 min-w-[72px] max-w-[120px]">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${circleClass}`}>
                  <StepIcon type={step.icon} className="w-5 h-5" />
                </div>
                <p className={`mt-2 text-[10px] sm:text-xs text-center leading-tight px-0.5 ${labelClass}`}>
                  {step.label}
                </p>
              </div>
              {i < APPLICATION_STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mt-5 min-w-[12px] ${completed ? lineClass : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>
      {isRejected && (
        <p className="text-center text-sm text-red-600 mt-3 font-medium">Application was not selected at this stage</p>
      )}
      {isDraft && (
        <p className="text-center text-sm text-amber-600 mt-3">Complete and submit your application to begin tracking</p>
      )}
    </div>
  );
}
