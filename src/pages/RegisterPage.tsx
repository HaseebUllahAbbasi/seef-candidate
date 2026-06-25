import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { registerSchema, RegisterForm } from '../lib/validation';
import PublicLayout from '../components/PublicLayout';
import VerifyRegistrationModal from '../components/VerifyRegistrationModal';
import { toast } from '../lib/toast';
import { FormField, inputClass, selectClass, btnPrimary } from '../components/ui';
import { SEEF } from '../lib/seefContent';

interface Uni {
  id: string;
  name: string;
  code: string;
  city: string;
  emailDomains?: string | null;
}

export default function RegisterPage() {
  const { registerStart, registerVerify } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/profile';
  const [unis, setUnis] = useState<Uni[]>([]);
  const [error, setError] = useState('');
  const [verifyInfo, setVerifyInfo] = useState<{
    pendingId: string;
    email: string;
    mobile: string;
    emailOtp: string;
    smsOtp: string;
    emailVerifyUrl: string;
  } | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const selectedUniId = watch('universityId');
  const selectedUni = unis.find((u) => u.id === selectedUniId);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'}/universities/public`)
      .then((r) => r.json())
      .then(setUnis)
      .catch(() => {});
  }, []);

  const sortedUnis = useMemo(
    () => [...unis].sort((a, b) => a.name.localeCompare(b.name)),
    [unis],
  );

  const autofill = () => {
    const siba = sortedUnis.find((u) => u.code === 'SIBA') ?? sortedUnis[0];
    setValue('email', 'haseebmscsf26@iba-suk.edu.pk');
    setValue('password', 'password123');
    setValue('confirmPassword', 'password123');
    setValue('mobile', '0307-8901234');
    if (siba) setValue('universityId', siba.id);
  };

  const emailHint = selectedUni?.emailDomains
    ? `@${selectedUni.emailDomains.split(',')[0].trim()}`
    : 'your university email only';

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-emerald-50 via-white to-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-10 lg:py-14 grid lg:grid-cols-5 gap-8 items-start">
          <aside className="lg:col-span-2 space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Step 1 of 2</p>
              <h1 className="text-3xl font-bold text-slate-900 mt-2">Create your account</h1>
              <p className="text-slate-600 mt-3 leading-relaxed">
                Register with your official university email. You will add your name and personal details after signing in.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900 mb-3">What you need</p>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>
                    SEEF panel university in Sindh —{' '}
                    <Link to="/universities" className="text-emerald-700 font-medium hover:underline">check the list</Link>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  Active university email address
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  Mobile number for SMS verification
                </li>
              </ul>
            </div>
            <p className="text-sm text-slate-500">
              Already registered?{' '}
              <Link to={redirect.startsWith('/') ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'} className="text-emerald-700 font-semibold hover:underline">Sign in</Link>
            </p>
          </aside>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 md:p-8">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{SEEF.shortName} registration</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Name and CNIC are collected on your profile after login</p>
                </div>
                <button type="button" onClick={autofill} className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shrink-0">
                  Autofill demo
                </button>
              </div>

              {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">{error}</div>}

              <form
                onSubmit={handleSubmit(async (d) => {
                  try {
                    setError('');
                    const res = await registerStart(d);
                    setVerifyInfo({
                      pendingId: res.pendingId,
                      email: res.channels.email,
                      mobile: res.channels.sms,
                      emailOtp: res.demo.emailOtp,
                      smsOtp: res.demo.smsOtp,
                      emailVerifyUrl: res.demo.emailVerifyUrl,
                    });
                  } catch (e) {
                    setError((e as Error).message);
                  }
                })}
                className="space-y-4"
              >
                <FormField label="University" error={errors.universityId} required hint={<>Select your enrolled university. <Link to="/universities" className="text-emerald-700 font-medium hover:underline">Browse full panel list</Link></>}>
                  <select {...register('universityId')} className={selectClass(!!errors.universityId)}>
                    <option value="">Choose university...</option>
                    {sortedUnis.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} — {u.city}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="University Email" error={errors.email} required hint={`Personal emails not accepted — use ${emailHint}`}>
                  <input type="email" {...register('email')} className={inputClass(!!errors.email)} autoComplete="email" placeholder="haseebmscsf26@iba-suk.edu.pk" />
                </FormField>

                <FormField label="Mobile" error={errors.mobile} required>
                  <input {...register('mobile')} placeholder="03XX-XXXXXXX" className={inputClass(!!errors.mobile)} autoComplete="tel" />
                </FormField>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Password" error={errors.password} required>
                    <input type="password" {...register('password')} className={inputClass(!!errors.password)} autoComplete="new-password" />
                  </FormField>
                  <FormField label="Confirm Password" error={errors.confirmPassword} required>
                    <input type="password" {...register('confirmPassword')} className={inputClass(!!errors.confirmPassword)} autoComplete="new-password" />
                  </FormField>
                </div>

                <button type="submit" disabled={isSubmitting} className={`${btnPrimary(isSubmitting)} w-full py-3 mt-2`}>
                  {isSubmitting ? 'Sending verification...' : 'Continue to Verification'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {verifyInfo && (
        <VerifyRegistrationModal
          info={verifyInfo}
          onClose={() => setVerifyInfo(null)}
          onVerify={async (method, code) => {
            await registerVerify(verifyInfo.pendingId, method, code);
            toast.success('Account created successfully');
            navigate(redirect, { state: { welcome: true } });
          }}
        />
      )}
    </PublicLayout>
  );
}
