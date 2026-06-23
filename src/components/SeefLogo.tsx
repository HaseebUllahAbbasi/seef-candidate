interface Props {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export default function SeefLogo({ className = '', showText = true, variant = 'dark' }: Props) {
  const textClass = variant === 'light' ? 'text-white' : 'text-slate-900';
  const subClass = variant === 'light' ? 'text-emerald-200' : 'text-slate-500';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center shadow-md shrink-0 ring-2 ring-white/20">
        <svg viewBox="0 0 32 32" className="w-7 h-7 text-white" fill="currentColor" aria-hidden>
          <path d="M16 3C10 3 5 7 4 12c-1 5 3 9 8 10v3l4-2v-2c5-1 9-5 8-10-1-5-6-9-12-9zm0 6c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" />
        </svg>
      </div>
      {showText && (
        <div className="leading-tight min-w-0">
          <p className={`font-bold text-sm sm:text-[15px] ${textClass} truncate`}>
            Sindh Education Endowment Foundation
          </p>
          <p className={`text-[10px] uppercase tracking-wider ${subClass}`}>Government of Sindh</p>
        </div>
      )}
    </div>
  );
}
