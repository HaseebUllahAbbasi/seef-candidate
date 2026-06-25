import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAvatar } from '../lib/avatar';
import { Card } from '../components/ui';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.firstName || user?.fullName?.split(' ')[0] || 'Student';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          {user && (
            <img src={userAvatar(user)} alt="" className="w-14 h-14 rounded-full bg-white/20 ring-2 ring-white/30" />
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome, {firstName}</h1>
            <p className="text-emerald-100 mt-2 text-sm md:text-base">
              Apply for Sindh Education Endowment Fund scholarships and track your application status in real time.
            </p>
          </div>
        </div>
      </div>

      {!user?.profileComplete && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium text-amber-900">Complete your profile</p>
            <p className="text-sm text-amber-800 mt-0.5">Add your name, CNIC, program, year, gender, religion, and district on your profile before applying.</p>
          </div>
          <Link to="/profile" className="shrink-0 px-4 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 text-center shadow-sm">
            Go to Profile
          </Link>
        </div>
      )}

      {user?.university && (
        <Card title="Your University">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl">🏛️</div>
            <div>
              <p className="font-semibold text-slate-900">{user.university.name}</p>
              <p className="text-sm text-slate-500">{user.university.code}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/advertisements" className="group block p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="text-2xl mb-3">📢</div>
          <p className="font-semibold text-slate-900 group-hover:text-emerald-800">Browse Scholarships</p>
          <p className="text-sm text-slate-500 mt-1">View open advertisements for your university</p>
        </Link>
        <Link to="/applications" className="group block p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="text-2xl mb-3">📋</div>
          <p className="font-semibold text-slate-900 group-hover:text-emerald-800">My Applications</p>
          <p className="text-sm text-slate-500 mt-1">Track progress with the step-by-step status tracker</p>
        </Link>
      </div>

      <Card title="How it works">
        <ol className="space-y-3 text-sm text-slate-600">
          <li className="flex gap-3"><span className="font-bold text-emerald-700">1.</span> Browse published scholarships for your university</li>
          <li className="flex gap-3"><span className="font-bold text-emerald-700">2.</span> Complete the 7-step application form with documents</li>
          <li className="flex gap-3"><span className="font-bold text-emerald-700">3.</span> University verifies your documents</li>
          <li className="flex gap-3"><span className="font-bold text-emerald-700">4.</span> Track scrutiny, interview, and merit list results online</li>
        </ol>
      </Card>
    </div>
  );
}
