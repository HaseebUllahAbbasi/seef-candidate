import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import StatusStepper from '../components/StatusStepper';
import DocumentPreview from '../components/DocumentPreview';
import {
  ApplicationRecordPanel,
  ApplicationRecordHeader,
  ApplicationRecordStepper,
  ApplicationRecordSection,
  DataGrid,
  DataField,
  DataRow,
} from '../components/ApplicationRecordPanel';
import { STATUS_LABELS, statusBadgeClasses } from '../lib/applicationStatus';

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

  if (loading) return <div className="h-72 bg-white rounded-xl border border-emerald-100 animate-pulse" />;

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
  const hasRejectedDocs = app.documents?.some((doc) => doc.verificationStatus === 'REJECTED');
  const canEdit = app.status === 'DRAFT' || (app.status === 'APPLIED_UNVERIFIED' && app.editUnlocked);

  const statusBadge = (
    <span className={`inline-flex text-xs font-semibold px-3 py-1.5 rounded-full border ${statusBadgeClasses(app.status)}`}>
      {STATUS_LABELS[app.status] || app.status.replace(/_/g, ' ')}
    </span>
  );

  return (
    <div className="space-y-4">
      <Link to="/applications" className="text-sm text-slate-500 hover:text-emerald-700 transition-colors">← My applications</Link>

      {msg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">{msg}</div>
      )}

      <ApplicationRecordPanel>
        <ApplicationRecordHeader
          title={app.advertisement.name}
          subtitle={app.program.programName}
          meta={`${app.university.name} · Session ${app.advertisement.year} · Ref ${app.advertisement.regNo}`}
          badge={statusBadge}
          advertisementId={app.advertisement.id}
          actions={(
            <>
              {canEdit && (
                <Link
                  to={`/apply/${app.advertisement.id}/${app.programId}`}
                  className="text-sm px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-medium transition-colors"
                >
                  {app.status === 'DRAFT' ? 'Continue application' : 'Update application'}
                </Link>
              )}
              {(hasRejectedDocs || app.editUnlocked) && app.status === 'APPLIED_UNVERIFIED' && !app.remarksResolvedAt && (
                <button
                  type="button"
                  onClick={markRemarksResolved}
                  className="text-sm px-4 py-2 bg-white border border-emerald-600 text-emerald-800 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  I&apos;ve addressed the remarks
                </button>
              )}
            </>
          )}
        />

        <ApplicationRecordStepper footer={app.submittedAt ? `Submitted ${new Date(app.submittedAt).toLocaleString()}` : undefined}>
          <StatusStepper status={app.status} />
        </ApplicationRecordStepper>

        {(app.editUnlocked || hasRejectedDocs) && app.status === 'APPLIED_UNVERIFIED' && (
          <div className="px-5 py-3 border-b border-amber-100 bg-amber-50/80 text-sm text-amber-900">
            {app.editUnlocked && (
              <p>
                <strong>Unlocked for editing.</strong>
                {app.verificationNote && <> {app.verificationNote}</>}
              </p>
            )}
            {hasRejectedDocs && !app.remarksResolvedAt && (
              <p className={app.editUnlocked ? 'mt-1' : ''}>Some documents need correction — see remarks below.</p>
            )}
          </div>
        )}

        <ApplicationRecordSection step={1} title="Scholarship advertisement">
          <div className="text-sm text-slate-600 space-y-2">
            {app.advertisement.catchyLine && <p className="font-medium text-slate-800">{app.advertisement.catchyLine}</p>}
            <p className="whitespace-pre-wrap leading-relaxed">{app.advertisement.eligibleCriteria}</p>
            <p className="text-xs text-slate-500">Application deadline: {new Date(app.advertisement.endDate).toLocaleDateString()}</p>
          </div>
        </ApplicationRecordSection>

        {p && (
          <ApplicationRecordSection step={2} title="Personal information submitted">
            <DataGrid cols={3}>
              <DataField label="Full Name" value={p.fullName} />
              <DataField label="Father's Name" value={p.fatherName} />
              <DataField label="CNIC" value={p.cnic} />
              <DataField label="Date of Birth" value={p.dateOfBirth ? new Date(String(p.dateOfBirth)).toLocaleDateString() : undefined} />
              <DataField label="Gender" value={p.gender} />
              <DataField label="Email" value={p.email} />
              <DataField label="Mobile" value={p.mobile} />
              <DataField label="District" value={p.district} />
              <DataField label="Domicile" value={p.domicileDistrict} />
              <DataField label="Permanent Address" value={p.permanentAddress} fullWidth />
              <DataField label="Current Address" value={p.currentAddress} fullWidth />
            </DataGrid>
          </ApplicationRecordSection>
        )}

        {a && (
          <ApplicationRecordSection step={3} title="Academic information submitted">
            <DataGrid cols={3}>
              <DataField label="Academic Year" value={a.academicYear} />
              <DataField label="Enrollment No." value={a.enrollmentNumber} />
              <DataField label="CGPA" value={a.cgpa} />
              <DataField label="Previous Qualification" value={a.previousQualification} />
              <DataField label="Previous Institution" value={a.previousInstitution} />
              <DataField label="Previous Marks" value={a.previousMarks} />
            </DataGrid>
          </ApplicationRecordSection>
        )}

        {d && (
          <ApplicationRecordSection step={4} title="Disability & orphan status">
            <DataGrid>
              <DataField label="Has Disability" value={d.hasDisability} />
              <DataField label="Disability Type" value={d.disabilityType} />
              <DataField label="Is Orphan" value={d.isOrphan} />
              <DataField label="Orphan Details" value={d.orphanDetails} fullWidth />
            </DataGrid>
          </ApplicationRecordSection>
        )}

        {app.familyMembers && app.familyMembers.length > 0 && (
          <ApplicationRecordSection step={5} title="Family members">
            <div className="space-y-3">
              {app.familyMembers.map((m, i) => (
                <DataRow key={i}>
                  <p className="font-semibold text-slate-900 mb-3">{String(m.relationType)} — {String(m.name)}</p>
                  <DataGrid cols={3}>
                    <DataField label="CNIC" value={m.cnic} />
                    <DataField label="Alive" value={m.isAlive} />
                    <DataField label="Marital Status" value={m.maritalStatus} />
                    <DataField label="Working" value={m.isWorking} />
                    <DataField label="Profession" value={m.profession} />
                    <DataField label="Employment Type" value={m.employmentType} />
                    <DataField label="Monthly Income (PKR)" value={m.monthlyIncome} />
                    <DataField label="Education" value={m.educationStatus} />
                    <DataField label="Institution" value={m.institution} />
                  </DataGrid>
                </DataRow>
              ))}
            </div>
          </ApplicationRecordSection>
        )}

        {app.incomeSources && app.incomeSources.length > 0 && (
          <ApplicationRecordSection step={6} title="Income sources">
            <div className="space-y-3">
              {app.incomeSources.map((inc, i) => (
                <DataRow key={i}>
                  <p className="font-semibold text-slate-900 mb-3">{String(inc.person)} — {String(inc.name)}</p>
                  <DataGrid cols={3}>
                    <DataField label="Profession" value={inc.profession} />
                    <DataField label="Employer" value={inc.employer} />
                    <DataField label="Employment Type" value={inc.employmentType} />
                    <DataField label="Monthly Salary (PKR)" value={inc.monthlySalary} />
                    <DataField label="Other Income" value={inc.otherIncomeSources} />
                    <DataField label="Other Amount (PKR)" value={inc.otherIncomeAmount} />
                  </DataGrid>
                </DataRow>
              ))}
            </div>
          </ApplicationRecordSection>
        )}

        {app.propertyAssets && app.propertyAssets.length > 0 && (
          <ApplicationRecordSection step={7} title="Property & assets">
            <div className="space-y-3">
              {app.propertyAssets.map((prop, i) => (
                <DataRow key={i}>
                  <DataGrid cols={3}>
                    <DataField label="Type" value={prop.propertyType} />
                    <DataField label="Ownership" value={prop.ownership} />
                    <DataField label="Location" value={prop.exactLocation} />
                    <DataField label="Area" value={prop.area} />
                    <DataField label="Estimated Value (PKR)" value={prop.estimatedValue} />
                    <DataField label="Remarks" value={prop.remarks} />
                  </DataGrid>
                </DataRow>
              ))}
            </div>
          </ApplicationRecordSection>
        )}

        <ApplicationRecordSection
          step={8}
          title="Uploaded documents"
          action={(app.documents?.length ?? 0) > 0 ? (
            <span className="text-xs text-slate-500">{app.documents?.length} file(s)</span>
          ) : undefined}
        >
          {(app.documents || []).length === 0 ? (
            <p className="text-sm text-slate-500">No documents uploaded.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {(app.documents || []).map((doc) => (
                <DocumentPreview key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </ApplicationRecordSection>
      </ApplicationRecordPanel>
    </div>
  );
}
