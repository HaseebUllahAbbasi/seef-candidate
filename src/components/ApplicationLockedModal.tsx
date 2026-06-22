import { Link } from 'react-router-dom';
import { STATUS_LABELS } from '../lib/applicationStatus';

interface Props {
  open: boolean;
  onClose: () => void;
  applicationId?: string;
  status?: string;
  title?: string;
  message?: string;
}

export default function ApplicationLockedModal({
  open,
  onClose,
  applicationId,
  status,
  title = 'Application is locked',
  message = 'Your application has already been submitted and is being processed. You cannot edit it at this stage unless your university unlocks it for corrections.',
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xl mb-4">
            🔒
          </div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{message}</p>
          {status && (
            <p className="mt-3 inline-flex text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-100">
              Current status: {STATUS_LABELS[status] || status.replace(/_/g, ' ')}
            </p>
          )}
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          {applicationId && (
            <Link
              to={`/application/${applicationId}`}
              onClick={onClose}
              className="flex-1 text-center px-4 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition-colors"
            >
              View application & progress
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
