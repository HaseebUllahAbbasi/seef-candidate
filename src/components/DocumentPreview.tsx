import { uploadUrl, isImageMime } from '../lib/uploads';

interface Doc {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  verificationStatus?: string;
  remarks?: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending review',
  VERIFIED: 'Verified',
  REJECTED: 'Needs correction',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  VERIFIED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function DocumentPreview({ doc }: { doc: Doc }) {
  const url = uploadUrl(doc.fileUrl);
  const isImage = isImageMime(doc.mimeType);
  const status = doc.verificationStatus ?? 'PENDING';

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <div className="px-3 py-2 bg-slate-50 border-b flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">{doc.type.replace(/_/g, ' ')}</span>
          <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${STATUS_COLORS[status] ?? STATUS_COLORS.PENDING}`}>
            {STATUS_LABELS[status] ?? status}
          </span>
        </div>
        <a href={url} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 hover:underline">
          Open
        </a>
      </div>
      {doc.remarks && (
        <div className="px-3 py-2 bg-red-50 border-b text-xs text-red-800">
          <strong>Remarks:</strong> {doc.remarks}
        </div>
      )}
      {isImage ? (
        <a href={url} target="_blank" rel="noreferrer" className="block">
          <img src={url} alt={doc.fileName} className="w-full max-h-48 object-contain bg-slate-100" />
        </a>
      ) : (
        <div className="p-4 text-center text-sm text-slate-500">
          <span className="text-2xl block mb-1">📄</span>
          {doc.fileName}
        </div>
      )}
    </div>
  );
}

export function DocumentGrid({ documents }: { documents: Doc[] }) {
  if (documents.length === 0) {
    return <p className="text-sm text-slate-500">No documents uploaded.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((d) => <DocumentPreview key={d.id} doc={d} />)}
    </div>
  );
}
