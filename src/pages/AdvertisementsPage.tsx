import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ScholarshipCard, { ScholarshipAd } from '../components/ScholarshipCard';
import { DEMO_SCHOLARSHIPS } from '../lib/seefContent';

export default function AdvertisementsPage() {
  const { user } = useAuth();
  const [ads, setAds] = useState<ScholarshipAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = user?.universityId ? `?universityId=${user.universityId}` : '';
    api<ScholarshipAd[]>(`/advertisements/public${q}`)
      .then((data) => setAds(data.length > 0 ? data : DEMO_SCHOLARSHIPS))
      .catch(() => setAds(DEMO_SCHOLARSHIPS))
      .finally(() => setLoading(false));
  }, [user?.universityId]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/10">
        <h1 className="text-2xl font-bold">Apply for Scholarships</h1>
        <p className="text-emerald-100 text-sm mt-1">
          Browse open scholarships and apply with one click
          {user?.university && <> · <span className="text-white font-medium">{user.university.name}</span></>}
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {[1, 2].map((i) => <div key={i} className="h-56 bg-white rounded-2xl border border-slate-200 animate-pulse" />)}
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500">No scholarships available for your university right now.</p>
          <Link to="/" className="text-emerald-700 text-sm mt-2 inline-block hover:underline">Back to home</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {ads.map((ad) => {
            const firstProgramId = ad.programs?.[0]?.id;
            return (
              <ScholarshipCard
                key={ad.id}
                ad={ad}
                variant="compact"
                showAction
                hidePrograms
                detailHref={`/advertisement/${ad.id}`}
                applyHref={firstProgramId ? `/apply/${ad.id}/${firstProgramId}` : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
