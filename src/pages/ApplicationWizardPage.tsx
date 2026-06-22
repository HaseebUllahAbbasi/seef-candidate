import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api, apiUpload } from '../lib/api';
import { autofillSampleDocuments, WIZARD_DOC_TYPES } from '../lib/sampleDocuments';
import { SINDH_DISTRICTS } from '../lib/districts';
import { personalSchema, academicSchema, disabilitySchema, PersonalForm, AcademicForm } from '../lib/validation';
import { FormField, inputClass, btnPrimary, Card } from '../components/ui';
import DocumentPreview from '../components/DocumentPreview';

const STEPS = ['Personal', 'Academic', 'Disability', 'Family', 'Financial', 'Documents', 'Review'];
const DISTRICTS = SINDH_DISTRICTS;
const RELATIONS = ['Father', 'Mother', 'Brother', 'Sister', 'Guardian', 'Spouse', 'Other'];
const MARITAL = ['Single', 'Married', 'Widowed', 'Divorced'];
const EMPLOYMENT_TYPES = ['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Housewife', 'Student', 'Other'];
const DOC_TYPES = WIZARD_DOC_TYPES;

interface FamilyMemberForm {
  relationType: string;
  name: string;
  cnic: string;
  isAlive: boolean;
  maritalStatus: string;
  isWorking: boolean;
  profession: string;
  employmentType: string;
  monthlyIncome: number;
  educationStatus: string;
  institution: string;
}

interface IncomeForm {
  person: string;
  name: string;
  profession: string;
  employer: string;
  employmentType: string;
  monthlySalary: number;
  otherIncomeSources: string;
  otherIncomeAmount: number;
}

interface PropertyForm {
  propertyType: string;
  ownership: string;
  exactLocation: string;
  area: string;
  estimatedValue: number;
  remarks: string;
}

interface AppDoc {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
}

const emptyMember = (): FamilyMemberForm => ({
  relationType: 'Father',
  name: '',
  cnic: '',
  isAlive: true,
  maritalStatus: 'Married',
  isWorking: true,
  profession: '',
  employmentType: 'Employed',
  monthlyIncome: 0,
  educationStatus: '',
  institution: '',
});

const emptyProperty = (): PropertyForm => ({
  propertyType: 'House',
  ownership: 'Family Owned',
  exactLocation: '',
  area: '',
  estimatedValue: 0,
  remarks: '',
});

export default function ApplicationWizardPage() {
  const { adId, programId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [appId, setAppId] = useState<string | null>(null);
  const [declared, setDeclared] = useState(false);
  const [members, setMembers] = useState<FamilyMemberForm[]>([emptyMember(), { ...emptyMember(), relationType: 'Mother', isWorking: false, employmentType: 'Housewife' }]);
  const [incomes, setIncomes] = useState<IncomeForm[]>([]);
  const [properties, setProperties] = useState<PropertyForm[]>([]);
  const [documents, setDocuments] = useState<AppDoc[]>([]);
  const [docLinks, setDocLinks] = useState<Record<string, string>>({});
  const [docAutofillLoading, setDocAutofillLoading] = useState(false);

  const personalForm = useForm<PersonalForm>({ resolver: zodResolver(personalSchema), mode: 'onBlur' });
  const academicForm = useForm<AcademicForm>({ resolver: zodResolver(academicSchema), mode: 'onBlur' });
  const disabilityForm = useForm({ resolver: zodResolver(disabilitySchema), mode: 'onBlur', defaultValues: { hasDisability: false, isOrphan: false } });

  useEffect(() => {
    if (adId && programId) {
      api<{ id: string }>('/applications', { method: 'POST', body: JSON.stringify({ advertisementId: adId, programId }) })
        .then((a) => setAppId(a.id))
        .catch(async () => {
          const mine = await api<{ id: string; advertisementId: string; programId: string }[]>('/applications/mine');
          const existing = mine.find((a) => a.advertisementId === adId && a.programId === programId);
          if (existing) setAppId(existing.id);
        });
    }
  }, [adId, programId]);

  useEffect(() => {
    if (!appId) return;
    api<{
      personal?: PersonalForm & { dateOfBirth: string };
      academic?: AcademicForm;
      disability?: { hasDisability: boolean; isOrphan: boolean; orphanDetails?: string; disabilityType?: string };
      familyMembers?: FamilyMemberForm[];
      incomeSources?: IncomeForm[];
      propertyAssets?: PropertyForm[];
      documents?: AppDoc[];
    }>(`/applications/${appId}`).then((data) => {
      if (data.personal) {
        personalForm.reset({
          ...data.personal,
          dateOfBirth: data.personal.dateOfBirth?.slice(0, 10) || '',
        });
      }
      if (data.academic) academicForm.reset(data.academic);
      if (data.disability) disabilityForm.reset(data.disability);
      if (data.familyMembers?.length) {
        setMembers(data.familyMembers.map((m) => ({
          relationType: m.relationType || 'Other',
          name: m.name || '',
          cnic: m.cnic || '',
          isAlive: m.isAlive ?? true,
          maritalStatus: m.maritalStatus || '',
          isWorking: m.isWorking ?? false,
          profession: m.profession || '',
          employmentType: m.employmentType || '',
          monthlyIncome: m.monthlyIncome ?? 0,
          educationStatus: m.educationStatus || '',
          institution: m.institution || '',
        })));
      }
      if (data.incomeSources?.length) setIncomes(data.incomeSources as IncomeForm[]);
      if (data.propertyAssets?.length) setProperties(data.propertyAssets as PropertyForm[]);
      if (data.documents) setDocuments(data.documents);
    }).catch(() => {});
  }, [appId]);

  // Sync income rows when entering financial step
  useEffect(() => {
    if (step === 4 && incomes.length === 0 && members.some((m) => m.name)) {
      setIncomes(
        members.filter((m) => m.name).map((m) => ({
          person: m.relationType,
          name: m.name,
          profession: m.profession,
          employer: '',
          employmentType: m.employmentType || (m.isWorking ? 'Employed' : 'Unemployed'),
          monthlySalary: m.monthlyIncome || 0,
          otherIncomeSources: '',
          otherIncomeAmount: 0,
        })),
      );
    }
  }, [step, members, incomes.length]);

  const updateMember = (idx: number, patch: Partial<FamilyMemberForm>) => {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)));
  };

  const autofillStep = () => {
    if (step === 0) {
      personalForm.reset({
        fullName: 'Ahmed Raza Khaskheli',
        fatherName: 'Abdul Razzaq Khaskheli',
        cnic: '42801-8901234-8',
        dateOfBirth: '2002-05-15',
        gender: 'MALE',
        email: 'ahmed.raza@student.usindh.edu.pk',
        mobile: '0307-8901234',
        permanentAddress: 'House No. 45, Main Road, Latifabad, Hyderabad, Sindh',
        currentAddress: 'House No. 45, Main Road, Latifabad, Hyderabad, Sindh',
        district: 'Hyderabad',
        domicileDistrict: 'Hyderabad',
      });
    } else if (step === 1) {
      academicForm.reset({
        academicYear: '3rd Year',
        enrollmentNumber: 'ENR-2023-4521',
        cgpa: 3.45,
        previousQualification: 'Intermediate (Pre-Engineering)',
        previousInstitution: 'Government College Hyderabad',
        previousMarks: '82%',
      });
    } else if (step === 2) {
      disabilityForm.reset({ hasDisability: false, isOrphan: false });
    } else if (step === 3) {
      setMembers([
        { relationType: 'Father', name: 'Abdul Razzaq Khaskheli', cnic: '42101-1111111-1', isAlive: true, maritalStatus: 'Married', isWorking: true, profession: 'Shopkeeper', employmentType: 'Self-Employed', monthlyIncome: 35000, educationStatus: 'Matric', institution: '' },
        { relationType: 'Mother', name: 'Razia Bibi', cnic: '42102-2222222-2', isAlive: true, maritalStatus: 'Married', isWorking: false, profession: 'Housewife', employmentType: 'Housewife', monthlyIncome: 0, educationStatus: 'Primary', institution: '' },
        { relationType: 'Brother', name: 'Ali Khaskheli', cnic: '', isAlive: true, maritalStatus: 'Single', isWorking: false, profession: 'Student', employmentType: 'Student', monthlyIncome: 0, educationStatus: 'Intermediate', institution: 'Govt College Hyderabad' },
      ]);
    } else if (step === 4) {
      setIncomes([
        { person: 'Father', name: 'Abdul Razzaq Khaskheli', profession: 'Shopkeeper', employer: 'Self', employmentType: 'Self-Employed', monthlySalary: 35000, otherIncomeSources: '', otherIncomeAmount: 0 },
        { person: 'Mother', name: 'Razia Bibi', profession: 'Housewife', employer: '', employmentType: 'Housewife', monthlySalary: 0, otherIncomeSources: '', otherIncomeAmount: 0 },
      ]);
      setProperties([{ propertyType: 'House', ownership: 'Family Owned', exactLocation: 'Hyderabad', area: '120 sq yards', estimatedValue: 2500000, remarks: '' }]);
    } else if (step === 5 && appId) {
      setDocAutofillLoading(true);
      autofillSampleDocuments(appId, api)
        .then(setDocuments)
        .finally(() => setDocAutofillLoading(false));
    }
  };

  const saveStep = async () => {
    if (!appId) return;
    if (step === 0) {
      const valid = await personalForm.trigger();
      if (!valid) return;
      await api(`/applications/${appId}/personal`, { method: 'PUT', body: JSON.stringify(personalForm.getValues()) });
    } else if (step === 1) {
      const valid = await academicForm.trigger();
      if (!valid) return;
      await api(`/applications/${appId}/academic`, { method: 'PUT', body: JSON.stringify(academicForm.getValues()) });
    } else if (step === 2) {
      await api(`/applications/${appId}/disability`, { method: 'PUT', body: JSON.stringify(disabilityForm.getValues()) });
    } else if (step === 3) {
      const validMembers = members.filter((m) => m.name.trim());
      if (validMembers.length === 0) return;
      await api(`/applications/${appId}/family`, {
        method: 'PUT',
        body: JSON.stringify({ members: validMembers }),
      });
    } else if (step === 4) {
      await api(`/applications/${appId}/financial`, {
        method: 'PUT',
        body: JSON.stringify({ properties, incomeSources: incomes }),
      });
    }
    setStep(step + 1);
  };

  const uploadDoc = async (type: string, file: File) => {
    if (!appId) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    const doc = await apiUpload<AppDoc>(`/applications/${appId}/documents`, fd);
    setDocuments((prev) => {
      const filtered = prev.filter((d) => d.type !== type);
      return [...filtered, doc];
    });
  };

  const linkDoc = async (type: string, url: string) => {
    if (!appId || !url.trim()) return;
    const doc = await api<AppDoc>(`/applications/${appId}/documents/link`, {
      method: 'POST',
      body: JSON.stringify({ type, url: url.trim() }),
    });
    setDocuments((prev) => {
      const filtered = prev.filter((d) => d.type !== type);
      return [...filtered, doc];
    });
    setDocLinks((prev) => ({ ...prev, [type]: '' }));
  };

  const submit = async () => {
    if (!appId || !declared) return;
    await api(`/applications/${appId}/submit`, { method: 'POST' });
    navigate(`/application/${appId}`);
  };

  const totalIncome = incomes.reduce((s, i) => s + (i.monthlySalary || 0) + (i.otherIncomeAmount || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scholarship Application</h1>
      <div className="flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <span key={s} className={`text-xs px-3 py-1 rounded-full ${i === step ? 'bg-emerald-700 text-white' : i < step ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
            {i + 1}. {s}
          </span>
        ))}
      </div>
      <Card title={`Step ${step + 1}: ${STEPS[step]}`} action={
        <button
          type="button"
          onClick={autofillStep}
          disabled={docAutofillLoading}
          className="text-xs px-3 py-1 bg-emerald-50 text-emerald-700 border rounded"
        >
          {docAutofillLoading ? 'Filling docs...' : 'Autofill'}
        </button>
      }>
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name" error={personalForm.formState.errors.fullName} required><input {...personalForm.register('fullName')} className={inputClass(!!personalForm.formState.errors.fullName)} /></FormField>
            <FormField label="Father's Name" error={personalForm.formState.errors.fatherName} required><input {...personalForm.register('fatherName')} className={inputClass()} /></FormField>
            <FormField label="CNIC" error={personalForm.formState.errors.cnic} required><input {...personalForm.register('cnic')} className={inputClass(!!personalForm.formState.errors.cnic)} /></FormField>
            <FormField label="Date of Birth" error={personalForm.formState.errors.dateOfBirth} required><input type="date" {...personalForm.register('dateOfBirth')} className={inputClass()} /></FormField>
            <FormField label="Gender" required>
              <select {...personalForm.register('gender')} className={inputClass()}>
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </FormField>
            <FormField label="Email" error={personalForm.formState.errors.email} required><input {...personalForm.register('email')} className={inputClass()} /></FormField>
            <FormField label="Mobile" error={personalForm.formState.errors.mobile} required><input {...personalForm.register('mobile')} className={inputClass()} /></FormField>
            <FormField label="District" required>
              <select {...personalForm.register('district')} className={inputClass()}>
                <option value="">Select</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="Domicile District" required>
              <select {...personalForm.register('domicileDistrict')} className={inputClass()}>
                <option value="">Select</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Permanent Address" required><textarea {...personalForm.register('permanentAddress')} className={inputClass()} rows={2} /></FormField>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Academic Year" required><input {...academicForm.register('academicYear')} className={inputClass()} /></FormField>
            <FormField label="Enrollment No" required><input {...academicForm.register('enrollmentNumber')} className={inputClass()} /></FormField>
            <FormField label="CGPA" error={academicForm.formState.errors.cgpa} required><input type="number" step="0.01" {...academicForm.register('cgpa')} className={inputClass()} /></FormField>
            <FormField label="Previous Qualification" required><input {...academicForm.register('previousQualification')} className={inputClass()} /></FormField>
            <FormField label="Previous Institution" required><input {...academicForm.register('previousInstitution')} className={inputClass()} /></FormField>
            <FormField label="Previous Marks" required><input {...academicForm.register('previousMarks')} className={inputClass()} /></FormField>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...disabilityForm.register('hasDisability')} /> Has Disability</label>
            {disabilityForm.watch('hasDisability') && <input {...disabilityForm.register('disabilityType')} placeholder="Disability type" className={inputClass()} />}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...disabilityForm.register('isOrphan')} /> Is Orphan</label>
            {disabilityForm.watch('isOrphan') && <textarea {...disabilityForm.register('orphanDetails')} placeholder="Orphan details" className={inputClass()} rows={2} />}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <p className="text-sm text-slate-600">Add all family members. You will enter their income details in the next step.</p>
            {members.map((m, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-slate-800">Family member {idx + 1}</p>
                  {members.length > 1 && (
                    <button type="button" onClick={() => setMembers(members.filter((_, i) => i !== idx))} className="text-xs text-red-600">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField label="Relation">
                    <select value={m.relationType} onChange={(e) => updateMember(idx, { relationType: e.target.value })} className={inputClass()}>
                      {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Full Name" required>
                    <input value={m.name} onChange={(e) => updateMember(idx, { name: e.target.value })} className={inputClass()} />
                  </FormField>
                  <FormField label="CNIC"><input value={m.cnic} onChange={(e) => updateMember(idx, { cnic: e.target.value })} placeholder="XXXXX-XXXXXXX-X" className={inputClass()} /></FormField>
                  <FormField label="Marital Status">
                    <select value={m.maritalStatus} onChange={(e) => updateMember(idx, { maritalStatus: e.target.value })} className={inputClass()}>
                      {MARITAL.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </FormField>
                  <label className="flex items-center gap-2 text-sm md:col-span-2">
                    <input type="checkbox" checked={m.isAlive} onChange={(e) => updateMember(idx, { isAlive: e.target.checked })} /> Alive
                  </label>
                  <label className="flex items-center gap-2 text-sm md:col-span-2">
                    <input type="checkbox" checked={m.isWorking} onChange={(e) => updateMember(idx, { isWorking: e.target.checked })} /> Currently working / earning
                  </label>
                  <FormField label="Profession">
                    <input value={m.profession} onChange={(e) => updateMember(idx, { profession: e.target.value })} className={inputClass()} />
                  </FormField>
                  <FormField label="Employment Type">
                    <select value={m.employmentType} onChange={(e) => updateMember(idx, { employmentType: e.target.value })} className={inputClass()}>
                      {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Monthly Income (PKR)">
                    <input type="number" value={m.monthlyIncome} onChange={(e) => updateMember(idx, { monthlyIncome: +e.target.value })} className={inputClass()} />
                  </FormField>
                  <FormField label="Education Status">
                    <input value={m.educationStatus} onChange={(e) => updateMember(idx, { educationStatus: e.target.value })} placeholder="e.g. Graduate, Matric" className={inputClass()} />
                  </FormField>
                  <FormField label="Institution (if student)">
                    <input value={m.institution} onChange={(e) => updateMember(idx, { institution: e.target.value })} className={inputClass()} />
                  </FormField>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setMembers([...members, emptyMember()])} className="text-sm text-emerald-700 font-medium">
              + Add family member
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Income by family member</h3>
              <p className="text-xs text-slate-500 mb-4">Based on family members you added. Update salary and other income for each person.</p>
              {incomes.length === 0 ? (
                <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">Go back and add family members first.</p>
              ) : (
                <div className="space-y-4">
                  {incomes.map((inc, idx) => (
                    <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                      <p className="font-medium text-slate-900">{inc.person} — {inc.name}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField label="Profession">
                          <input value={inc.profession} onChange={(e) => setIncomes(incomes.map((x, i) => i === idx ? { ...x, profession: e.target.value } : x))} className={inputClass()} />
                        </FormField>
                        <FormField label="Employer">
                          <input value={inc.employer} onChange={(e) => setIncomes(incomes.map((x, i) => i === idx ? { ...x, employer: e.target.value } : x))} className={inputClass()} />
                        </FormField>
                        <FormField label="Employment Type">
                          <select value={inc.employmentType} onChange={(e) => setIncomes(incomes.map((x, i) => i === idx ? { ...x, employmentType: e.target.value } : x))} className={inputClass()}>
                            {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </FormField>
                        <FormField label="Monthly Salary (PKR)">
                          <input type="number" value={inc.monthlySalary} onChange={(e) => setIncomes(incomes.map((x, i) => i === idx ? { ...x, monthlySalary: +e.target.value } : x))} className={inputClass()} />
                        </FormField>
                        <FormField label="Other Income Source">
                          <input value={inc.otherIncomeSources} onChange={(e) => setIncomes(incomes.map((x, i) => i === idx ? { ...x, otherIncomeSources: e.target.value } : x))} className={inputClass()} />
                        </FormField>
                        <FormField label="Other Income Amount (PKR)">
                          <input type="number" value={inc.otherIncomeAmount} onChange={(e) => setIncomes(incomes.map((x, i) => i === idx ? { ...x, otherIncomeAmount: +e.target.value } : x))} className={inputClass()} />
                        </FormField>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm font-semibold text-emerald-800">Total monthly family income: PKR {totalIncome.toLocaleString()}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Property & assets</h3>
              {properties.map((prop, idx) => (
                <div key={idx} className="p-4 border rounded-xl mb-3 space-y-3">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Property {idx + 1}</p>
                    <button type="button" onClick={() => setProperties(properties.filter((_, i) => i !== idx))} className="text-xs text-red-600">Remove</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField label="Type"><input value={prop.propertyType} onChange={(e) => setProperties(properties.map((p, i) => i === idx ? { ...p, propertyType: e.target.value } : p))} className={inputClass()} /></FormField>
                    <FormField label="Ownership"><input value={prop.ownership} onChange={(e) => setProperties(properties.map((p, i) => i === idx ? { ...p, ownership: e.target.value } : p))} className={inputClass()} /></FormField>
                    <FormField label="Location"><input value={prop.exactLocation} onChange={(e) => setProperties(properties.map((p, i) => i === idx ? { ...p, exactLocation: e.target.value } : p))} className={inputClass()} /></FormField>
                    <FormField label="Area"><input value={prop.area} onChange={(e) => setProperties(properties.map((p, i) => i === idx ? { ...p, area: e.target.value } : p))} className={inputClass()} /></FormField>
                    <FormField label="Estimated Value (PKR)"><input type="number" value={prop.estimatedValue} onChange={(e) => setProperties(properties.map((p, i) => i === idx ? { ...p, estimatedValue: +e.target.value } : p))} className={inputClass()} /></FormField>
                    <FormField label="Remarks"><input value={prop.remarks} onChange={(e) => setProperties(properties.map((p, i) => i === idx ? { ...p, remarks: e.target.value } : p))} className={inputClass()} /></FormField>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setProperties([...properties, emptyProperty()])} className="text-sm text-emerald-700 font-medium">+ Add property</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <p className="text-sm text-slate-600">Upload a file from your device or paste a public link (e.g. sample PDF/image URL).</p>
            {DOC_TYPES.map((type) => {
              const uploaded = documents.find((d) => d.type === type);
              return (
                <div key={type} className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <label className="text-sm font-medium text-slate-800">{type.replace(/_/g, ' ')}</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="block text-sm w-full"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadDoc(type, file);
                    }}
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="Or paste document link (https://...)"
                      value={docLinks[type] ?? ''}
                      onChange={(e) => setDocLinks({ ...docLinks, [type]: e.target.value })}
                      className={inputClass()}
                    />
                    <button
                      type="button"
                      onClick={() => linkDoc(type, docLinks[type] ?? '')}
                      disabled={!docLinks[type]?.trim()}
                      className="text-sm px-4 py-2 border border-emerald-600 text-emerald-800 rounded-lg hover:bg-emerald-50 shrink-0 disabled:opacity-50"
                    >
                      Use link
                    </button>
                  </div>
                  {uploaded && (
                    <div className="mt-3 max-w-xs">
                      <DocumentPreview doc={uploaded} />
                      <p className="text-xs text-emerald-700 mt-1">✓ {uploaded.fileName}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {step === 6 && (
          <div>
            <p className="text-sm text-slate-600 mb-4">Review your application and submit. You cannot edit after submission.</p>
            <ul className="text-sm text-slate-600 space-y-1 mb-4">
              <li>Family members: {members.filter((m) => m.name).length}</li>
              <li>Documents uploaded: {documents.length} / {DOC_TYPES.length}</li>
              <li>Total family income: PKR {totalIncome.toLocaleString()}/month</li>
            </ul>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={declared} onChange={(e) => setDeclared(e.target.checked)} />
              I declare all information is true and correct
            </label>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className={btnSecondary()}>Previous</button>}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={saveStep} className={btnPrimary()}>Next</button>
          ) : (
            <button type="button" onClick={submit} disabled={!declared} className={btnPrimary(!declared)}>Submit Application</button>
          )}
        </div>
      </Card>
    </div>
  );
}

function btnSecondary() {
  return 'px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50';
}
