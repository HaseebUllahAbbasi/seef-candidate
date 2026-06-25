import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { toast } from '../lib/toast';
import { Card } from '../components/ui';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api<Notification[]>('/notifications')
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await api(`/notifications/${id}/read`, { method: 'PATCH' });
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = async () => {
    await api('/notifications/read-all', { method: 'PATCH' });
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
        </div>
        {unread > 0 && (
          <button type="button" onClick={markAllRead} className="text-sm text-emerald-700 font-medium hover:underline">
            Mark all read
          </button>
        )}
      </div>

      <Card>
        {loading ? (
          <p className="text-sm text-slate-500 py-8 text-center">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No notifications yet</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((n) => (
              <li
                key={n.id}
                className={`py-4 px-1 first:pt-0 last:pb-0 cursor-pointer ${!n.read ? 'bg-emerald-50/50 -mx-2 px-3 rounded-lg' : ''}`}
                onClick={() => !n.read && markRead(n.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{n.type === 'welcome' ? '👋' : n.type === 'action' ? '📌' : '🔔'}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
