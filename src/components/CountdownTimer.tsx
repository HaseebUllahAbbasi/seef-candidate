import { useEffect, useState } from 'react';

function TimerBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-2 min-w-[3rem] sm:min-w-[4rem]">
      <span className="text-lg sm:text-2xl font-extrabold text-white tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-white/80 tracking-wider mt-1">
        {label}
      </span>
    </div>
  );
}

function calculateTimeLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface Props {
  endDate: string;
  /** hero = inside green header; panel = subtle box on white background */
  variant?: 'hero' | 'panel';
}

export default function CountdownTimer({ endDate, variant = 'panel' }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft(endDate)), 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    const expiredClass = variant === 'hero'
      ? 'text-red-100 bg-red-500/25 border-red-400/30'
      : 'text-red-700 bg-red-50 border-red-200';
    return (
      <span className={`inline-flex items-center text-sm font-semibold px-3 py-2 rounded-lg border ${expiredClass}`}>
        <span className="w-2 h-2 bg-current rounded-full mr-2 opacity-70" />
        Application closed
      </span>
    );
  }

  const boxes = (
    <div className="flex gap-1.5 sm:gap-2">
      <TimerBox value={timeLeft.days} label="Days" />
      <TimerBox value={timeLeft.hours} label="Hrs" />
      <TimerBox value={timeLeft.minutes} label="Min" />
      <TimerBox value={timeLeft.seconds} label="Sec" />
    </div>
  );

  if (variant === 'hero') {
    return (
      <div className="shrink-0">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-200/90 mb-2 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Time remaining
        </p>
        {boxes}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-3 flex items-center gap-1.5">
        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Time remaining
      </p>
      <div className="flex gap-2">
        {(['days', 'hours', 'minutes', 'seconds'] as const).map((key, i) => (
          <div key={key} className="flex flex-col items-center flex-1 rounded-lg border border-emerald-200 bg-white py-2 px-1">
            <span className="text-xl font-bold text-emerald-900 tabular-nums">{String(timeLeft[key]).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase font-semibold text-emerald-600 tracking-wide mt-0.5">
              {['Days', 'Hrs', 'Min', 'Sec'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
