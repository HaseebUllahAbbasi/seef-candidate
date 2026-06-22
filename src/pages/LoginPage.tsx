import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { loginSchema, LoginForm } from '../lib/validation';
import PublicLayout from '../components/PublicLayout';
import { FormField, inputClass, btnPrimary } from '../components/ui';
import { SEEF } from '../lib/seefContent';

const DEMO_ACCOUNT = {
  username: 'candidate.ahmed',
  password: 'password123',
  label: 'Ahmed Raza Khaskheli',
  university: 'University of Sindh',
};

const STEPS = [
  { n: '1', title: 'Register', desc: 'University email + verification' },
  { n: '2', title: 'Complete profile', desc: 'Name, CNIC, and gender' },
  { n: '3', title: 'Apply', desc: 'Submit scholarship application' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const [error, setError] = useState('');
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const fillDemo = () => {
    setValue('username', DEMO_ACCOUNT.username, { shouldValidate: true });
    setValue('password', DEMO_ACCOUNT.password, { shouldValidate: true });
  };

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900">
        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <p className="text-emerald-200 text-sm font-medium uppercase tracking-widest mb-3">Candidate Portal</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">Sign in to {SEEF.shortName}</h1>
            <p className="text-emerald-100/90 mt-4 max-w-md leading-relaxed">
              Track applications, browse open scholarships, and complete your profile — all in one place.
            </p>

            <div className="mt-8 grid gap-3">
              {STEPS.map((s) => (
                <div key={s.n} className="flex items-start gap-3 rounded-xl bg-white/10 border border-white/10 px-4 py-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white text-sm font-bold flex items-center justify-center shrink-0">{s.n}</span>
                  <div>
                    <p className="font-semibold text-white">{s.title}</p>
                    <p className="text-sm text-emerald-100/80">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-emerald-200">
              New student?{' '}
              <Link to="/register" className="text-white font-semibold underline underline-offset-2 hover:text-emerald-100">
                Create a free account
              </Link>
            </p>
          </div>

          <div className="w-full max-w-md mx-auto lg:ml-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-7 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  SEEF
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
                  <p className="text-xs text-slate-500">Use university email or username</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">{error}</div>
              )}

              <form
                onSubmit={handleSubmit(async (d) => {
                  try {
                    setError('');
                    await login(d.username, d.password);
                    navigate(redirect);
                  } catch (e) {
                    setError((e as Error).message);
                  }
                })}
                className="space-y-4"
              >
                <FormField label="Username or Email" error={errors.username} required>
                  <input {...register('username')} className={inputClass(!!errors.username)} autoComplete="username" placeholder="you@student.usindh.edu.pk" />
                </FormField>
                <FormField label="Password" error={errors.password} required>
                  <input type="password" {...register('password')} className={inputClass(!!errors.password)} autoComplete="current-password" />
                </FormField>
                <button type="submit" disabled={isSubmitting} className={`${btnPrimary(isSubmitting)} w-full py-3`}>
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-800 mb-2">Demo account</p>
                <p className="text-sm font-medium text-slate-900">{DEMO_ACCOUNT.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{DEMO_ACCOUNT.university}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <code className="bg-white px-2 py-1 rounded border border-slate-200">{DEMO_ACCOUNT.username}</code>
                  <code className="bg-white px-2 py-1 rounded border border-slate-200">{DEMO_ACCOUNT.password}</code>
                </div>
                <button type="button" onClick={fillDemo} className="mt-3 w-full text-sm font-medium text-emerald-800 bg-white border border-emerald-200 rounded-lg py-2 hover:bg-emerald-50 transition-colors">
                  Use demo credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
