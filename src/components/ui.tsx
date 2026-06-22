import { FieldError } from 'react-hook-form';

export function FormField({ label, error, required, hint, children }: { label: string; error?: FieldError; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {hint && <p className="text-xs text-slate-500 -mt-0.5">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </div>
  );
}

export function inputClass(error?: boolean) {
  return `w-full px-3 py-2.5 border rounded-lg text-sm bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500 ${
    error ? 'border-red-400 bg-red-50/30' : 'border-slate-300 hover:border-slate-400'
  }`;
}

export function selectClass(error?: boolean) {
  return inputClass(error);
}

export function btnPrimary(disabled?: boolean) {
  return `inline-flex items-center justify-center px-4 py-2.5 bg-primary-700 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`;
}

export function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-emerald-200/60 shadow-sm overflow-hidden transition-colors hover:border-emerald-300/80">
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="font-semibold text-slate-800">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
