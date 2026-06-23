import { useEffect, useMemo, useState } from 'react';
import { api, getToken } from '../lib/api';

export interface MyApplication {
  id: string;
  status: string;
  advertisementId: string;
  programId: string;
  editUnlocked?: boolean;
  submittedAt?: string;
  advertisement: { id: string; name: string; year: number };
  program: { programName: string };
}

export function useMyApplications() {
  const [apps, setApps] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setApps([]);
      setLoading(false);
      return;
    }
    api<MyApplication[]>('/applications/mine')
      .then(setApps)
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, []);

  const byAdvertisementId = useMemo(() => {
    const map = new Map<string, MyApplication>();
    for (const app of apps) map.set(app.advertisementId, app);
    return map;
  }, [apps]);

  return {
    apps,
    loading,
    byAdvertisementId,
    getForAdvertisement: (advertisementId: string) => byAdvertisementId.get(advertisementId),
  };
}
