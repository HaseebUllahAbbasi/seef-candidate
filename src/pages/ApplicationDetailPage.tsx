import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Card } from '../components/ui';
import StatusStepper from '../components/StatusStepper';
import DocumentPreview from '../components/DocumentPreview';
import { STATUS_LABELS } from '../lib/applicationStatus';

interface AppDetail {
  id: string;
  status: string;
  programId: string;
  submittedAt?: string;
  editUnlocked?: boolean;
  verificationNote?: string | null;
  remarksResolvedAt?: string | null;
  advertisement: {
    id: string;
    name: string;
    year: number;
    regNo: string;
    catchyLine?: string;
    eligibleCriteria: string;
    endDate: string;
  };
  program: { programName: string };
  university: { name: string };
  personal?: Record<string, unknown>;
  academic?: Record<string, unknown>;
  disability?: Record<string, unknown>;
  familyMembers?: Record<string, unknown>[];
  propertyAssets?: Record<string, unknown>[];
  incomeSources?: Record<string, unknown>[];
  siblingScholarships?: Record<string, unknown>[];
  documents?: {
    id: string;
    type: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    verificationStatus?: string;
    remarks?: string | null;
  }[];
}

function Field({ label, value }: { label: string; value?: unknown }) {
  if (value === undefined || value === null || value === '') return null;
  const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-900 font-medium mt-0.5">{display}</dd>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<AppDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    if (!id) return;
    api<AppDetail>(`/applications/${id}`)
      .then(setApp)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const markRemarksResolved = async () => {
    if (!id) return;
    await api(`/applications/${id}/remarks-resolved`, { method: 'POST' });
    setMsg('Thank you — your university will re-review your application.');
    load();
  };

  const hasRejectedDocs = app?.documents?.some((d) => d.verificationStatus === 'REJECTED');
  const canEdit = app?.status === 'DRAFT' || (app?.status === 'APPLIED_UNVERIFIED' && app?.editUnlocked);

  if (loading) return <div className="h-64 bg-white rounded-2xl border animate-pulse" />;

  if (error || !app) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600">{error || 'Application not found'}</p>
        <Link to="/applications" className="text-emerald-700 text-sm mt-2 inline-block">← Back to applications</Link>
      </div>
    );
  }

  const p = app.personal;
  const a = app.academic;
  const d = app.disability;

  return (
    <div className="space-y-6">
      <Link to="/applications" className="text-sm text-emerald-700 hover:underline">← Back to my applications</Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{app.advertisement.name}</h1>
          <p className="text-sm text-emerald-800 font-medium mt-1">{app.program.programName}</p>
          <p className="text-xs text-slate-500 mt-0.5">{app.university.name} · Year {app.advertisement.year}</p>
        </div>
        <span className="inline-flex self-start text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-100">
          {STATUS_LABELS[app.status] || app.status.replace(/_/g, ' ')}
        </span>
      </div>

      {msg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">{msg}</div>
      )}

      {app.editUnlocked && app.status === 'APPLIED_UNVERIFIED' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
          <p className="font-medium">Your application is unlocked for editing</p>
          {app.verificationNote && <p className="mt-1">{app.verificationNote}</p>}
          <p className="mt-2 text-xs">Update your details and re-upload any documents marked with remarks, then notify your university below.</p>
        </div>
      )}

      {hasRejectedDocs && !app.remarksResolvedAt && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-900">
          <p className="font-medium">Some documents need correction</p>
          <p className="mt-1 text-xs">See remarks under each document below. After fixing, click &quot;I&apos;ve addressed the remarks&quot;.</p>
        </div>
      )}

      {canEdit && (
        <Link
          to={`/apply/${app.advertisement.id}/${app.programId}`}
          className="inline-block text-sm px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
        >
          {app.status === 'DRAFT' ? 'Continue application' : 'Update application'}
        </Link>
      )}

      {(hasRejectedDocs || app.editUnlocked) && app.status === 'APPLIED_UNVERIFIED' && !app.remarksResolvedAt && (
        <button
          type="button"
          onClick={markRemarksResolved}
          className="text-sm px-4 py-2 bg-white border border-emerald-600 text-emerald-800 rounded-lg hover:bg-emerald-50"
        >
          I&apos;ve addressed the remarks
        </button>
      )}

      <Card title="Application progress">
        <StatusStepper status={app.status} />
        {app.submittedAt && (
          <p className="text-xs text-slate-500 mt-3">Submitted {new Date(app.submittedAt).toLocaleString()}</p>
        )}
      </Card>

      <Card title="Scholarship details">
        <div className="space-y-2 text-sm">
          <p><span className="text-slate-500">Registration:</span> <strong>{app.advertisement.regNo}</strong></p>
          {app.advertisement.catchyLine && <p className="text-slate-600">{app.advertisement.catchyLine}</p>}
          <p className="text-slate-600 whitespace-pre-wrap">{app.advertisement.eligibleCriteria}</p>
          <Link to={`/advertisement/${app.advertisement.id}`} className="text-emerald-700 text-sm hover:underline">
            View full advertisement →
          </Link>
        </div>
      </Card>

      {p && (
        <Card title="Personal information">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={p.fullName} />
            <Field label="Father's Name" value={p.fatherName} />
            <Field label="CNIC" value={p.cnic} />
            <Field label="Date of Birth" value={p.dateOfBirth ? new Date(String(p.dateOfBirth)).toLocaleDateString() : undefined} />
            <Field label="Gender" value={p.gender} />
            <Field label="Email" value={p.email} />
            <Field label="Mobile" value={p.mobile} />
            <Field label="District" value={p.district} />
            <Field label="Domicile" value={p.domicileDistrict} />
            <Field label="Permanent Address" value={p.permanentAddress} />
            <Field label="Current Address" value={p.currentAddress} />
          </dl>
        </Card>
      )}

      {a && (
        <Card title="Academic information">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Academic Year" value={a.academicYear} />
            <Field label="Enrollment No." value={a.enrollmentNumber} />
            <Field label="CGPA" value={a.cgpa} />
            <Field label="Previous Qualification" value={a.previousQualification} />
            <Field label="Previous Institution" value={a.previousInstitution} />
            <Field label="Previous Marks" value={a.previousMarks} />
          </dl>
        </Card>
      )}

      {d && (
        <Card title="Disability & orphan status">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Has Disability" value={d.hasDisability} />
            <Field label="Disability Type" value={d.disabilityType} />
            <Field label="Is Orphan" value={d.isOrphan} />
            <Field label="Orphan Details" value={d.orphanDetails} />
          </dl>
        </Card>
      )}

      {app.familyMembers && app.familyMembers.length > 0 && (
        <Card title="Family members">
          <div className="space-y-4">
            {app.familyMembers.map((m, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-semibold text-slate-900">{String(m.relationType)} — {String(m.name)}</p>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  <Field label="CNIC" value={m.cnic} />
                  <Field label="Alive" value={m.isAlive} />
                  <Field label="Marital Status" value={m.maritalStatus} />
                  <Field label="Working" value={m.isWorking} />
                  <Field label="Profession" value={m.profession} />
                  <Field label="Employment Type" value={m.employmentType} />
                  <Field label="Monthly Income (PKR)" value={m.monthlyIncome} />
                  <Field label="Education" value={m.educationStatus} />
                  <Field label="Institution" value={m.institution} />
                </dl>
              </div>
            ))}
          </div>
        </Card>
      )}

      {app.incomeSources && app.incomeSources.length > 0 && (
        <Card title="Income sources">
          <div className="space-y-3">
            {app.incomeSources.map((inc, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-semibold text-slate-900">{String(inc.person)} — {String(inc.name)}</p>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  <Field label="Profession" value={inc.profession} />
                  <Field label="Employer" value={inc.employer} />
                  <Field label="Employment Type" value={inc.employmentType} />
                  <Field label="Monthly Salary (PKR)" value={inc.monthlySalary} />
                  <Field label="Other Income" value={inc.otherIncomeSources} />
                  <Field label="Other Amount (PKR)" value={inc.otherIncomeAmount} />
                </dl>
              </div>
            ))}
          </div>
        </Card>
      )}

      {app.propertyAssets && app.propertyAssets.length > 0 && (
        <Card title="Property & assets">
          <div className="space-y-3">
            {app.propertyAssets.map((prop, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Field label="Type" value={prop.propertyType} />
                  <Field label="Ownership" value={prop.ownership} />
                  <Field label="Location" value={prop.exactLocation} />
                  <Field label="Area" value={prop.area} />
                  <Field label="Estimated Value (PKR)" value={prop.estimatedValue} />
                  <Field label="Remarks" value={prop.remarks} />
                </dl>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="Uploaded documents">
        {(app.documents || []).length === 0 ? (
          <p className="text-sm text-slate-500">No documents uploaded.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(app.documents || []).map((d) => (
              <DocumentPreview key={d.id} doc={d} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
