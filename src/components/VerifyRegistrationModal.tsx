import { useState } from 'react';
import { toast } from '../lib/toast';

interface VerifyInfo {
  pendingId: string;
  email: string;
  mobile: string;
  emailOtp: string;
  smsOtp: string;
  emailVerifyUrl: string;
}

interface Props {
  info: VerifyInfo;
  onVerify: (method: 'email_otp' | 'sms_otp', code: string) => Promise<void>;
  onClose: () => void;
}

export default function VerifyRegistrationModal({ info, onVerify, onClose }: Props) {
  const [tab, setTab] = useState<'email_otp' | 'sms_otp' | 'email_link'>('email_otp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitOtp = async () => {
    if (tab === 'email_link') return;
    if (code.length < 6) {
      setError('Enter the 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onVerify(tab, code);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(info.emailVerifyUrl);
    toast.success('Verification link copied');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Verify your account</h2>
          <p className="text-sm text-slate-500 mt-1">Choose any method below to complete registration</p>
        </div>

        <div className="flex border-b border-slate-100">
          {[
            { id: 'email_otp' as const, label: 'Email OTP' },
            { id: 'sms_otp' as const, label: 'SMS OTP' },
            { id: 'email_link' as const, label: 'Email link' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setCode(''); setError(''); }}
              className={`flex-1 py-3 text-xs sm:text-sm font-medium transition-colors ${
                tab === t.id ? 'text-emerald-800 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {tab === 'email_otp' && (
            <>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-sm text-emerald-900">
                <p>We sent a 6-digit code to <strong>{info.email}</strong></p>
                <p className="text-xs text-emerald-700 mt-2">Demo code: <code className="bg-white px-2 py-0.5 rounded font-mono">{info.emailOtp}</code></p>
              </div>
              <label className="block text-sm font-medium text-slate-700">Enter email OTP</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                placeholder="000000"
              />
            </>
          )}

          {tab === 'sms_otp' && (
            <>
              <div className="p-4 bg-violet-50 rounded-xl border border-violet-100 text-sm text-violet-900">
                <p>We sent a 6-digit SMS to <strong>{info.mobile}</strong></p>
                <p className="text-xs text-violet-700 mt-2">Demo code: <code className="bg-white px-2 py-0.5 rounded font-mono">{info.smsOtp}</code></p>
              </div>
              <label className="block text-sm font-medium text-slate-700">Enter SMS OTP</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                placeholder="000000"
              />
            </>
          )}

          {tab === 'email_link' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-sm text-emerald-900">
                <p>We sent a verification link to <strong>{info.email}</strong>. Open it in this browser to auto-login.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-xs break-all font-mono text-slate-600 border">
                {info.emailVerifyUrl}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={copyLink} className="flex-1 py-2.5 text-sm font-medium border border-slate-300 rounded-xl hover:bg-slate-50">
                  Copy link
                </button>
                <a
                  href={info.emailVerifyUrl}
                  className="flex-1 py-2.5 text-sm font-medium text-center bg-emerald-700 text-white rounded-xl hover:bg-emerald-800"
                >
                  Open link
                </a>
              </div>
              <p className="text-xs text-slate-500 text-center">Opening the link verifies your email and logs you in automatically.</p>
            </div>
          )}

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900">
            Cancel
          </button>
          {tab !== 'email_link' && (
            <button
              type="button"
              onClick={submitOtp}
              disabled={loading}
              className="flex-1 py-2.5 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
