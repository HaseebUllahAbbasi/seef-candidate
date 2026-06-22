import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PublicLayout from '../components/PublicLayout';

export default function RegisterVerifyPage() {
  const { token } = useParams<{ token: string }>();
  const { completeEmailLink } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }
    completeEmailLink(token)
      .then(() => {
        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 1500);
      })
      .catch((e) => {
        setStatus('error');
        setMessage((e as Error).message);
      });
  }, [token, completeEmailLink, navigate]);

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center">
          {status === 'loading' && (
            <>
              <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-slate-600">Verifying your email and creating your account...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="text-4xl mb-3">✓</div>
              <h1 className="text-xl font-bold text-emerald-800">Account verified!</h1>
              <p className="text-sm text-slate-500 mt-2">You are logged in. Redirecting to dashboard...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="text-4xl mb-3">✕</div>
              <h1 className="text-xl font-bold text-red-700">Verification failed</h1>
              <p className="text-sm text-slate-500 mt-2">{message}</p>
              <Link to="/register" className="inline-block mt-4 text-emerald-700 font-medium">Try registering again</Link>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
