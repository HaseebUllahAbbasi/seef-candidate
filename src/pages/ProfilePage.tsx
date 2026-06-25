import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { profileSchema, changePasswordSchema, ProfileForm, ChangePasswordForm } from '../lib/validation';
import { userAvatar } from '../lib/avatar';
import { RELIGIONS } from '../lib/religions';
import { api } from '../lib/api';
import { toast } from '../lib/toast';
import { FormField, inputClass, selectClass, btnPrimary, Card } from '../components/ui';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const location = useLocation();
  const welcome = (location.state as { welcome?: boolean } | null)?.welcome;
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [programs, setPrograms] = useState<string[]>([]);
  const [academicYears, setAcademicYears] = useState<string[]>([]);

  const locked = user?.profileComplete ?? false;

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      cnic: '',
      gender: undefined,
      religion: '',
      enrolledProgram: '',
      academicYear: '',
      mobile: '',
    },
  });

  useEffect(() => {
    if (!user) return;
    profileForm.reset({
      firstName: user.firstName || user.fullName?.split(' ')[0] || '',
      lastName: user.lastName || user.fullName?.split(' ').slice(1).join(' ') || '',
      cnic: user.cnic || '',
      gender: (user.gender as ProfileForm['gender']) || undefined,
      religion: user.religion || '',
      enrolledProgram: user.enrolledProgram || '',
      academicYear: user.academicYear || '',
      mobile: user.mobile || '',
    });
  }, [user, profileForm]);

  useEffect(() => {
    api<{ programs: string[]; academicYears: string[] }>('/auth/profile-programs')
      .then((data) => {
        setPrograms(data.programs ?? []);
        setAcademicYears(data.academicYears ?? []);
      })
      .catch(() => {});
  }, []);

  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  if (!user) return null;

  const readOnlyClass = `${inputClass()} bg-slate-50 text-slate-700 cursor-not-allowed`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={userAvatar(user)}
          alt=""
          className="w-16 h-16 rounded-full bg-slate-100 ring-2 ring-emerald-200"
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      {!locked && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
          {welcome ? (
            <p className="font-medium">Welcome! Complete your profile once — it will be locked and used for all scholarship applications.</p>
          ) : (
            <p>Fill in your details below. After saving, your profile cannot be edited. University comes from registration; choose your program and current year carefully.</p>
          )}
        </div>
      )}

      {locked && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900">
          Your profile is complete and locked. This information is used when you apply for scholarships.
        </div>
      )}

      <Card title="Enrollment & personal details">
        {profileError && <p className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">{profileError}</p>}
        {locked ? (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">University</dt>
              <dd className="font-medium text-slate-900 mt-0.5">{user.university?.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Program</dt>
              <dd className="font-medium text-slate-900 mt-0.5">{user.enrolledProgram ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Current year</dt>
              <dd className="font-medium text-slate-900 mt-0.5">{user.academicYear ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">First name</dt>
              <dd className="font-medium text-slate-900 mt-0.5">{user.firstName ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Last name</dt>
              <dd className="font-medium text-slate-900 mt-0.5">{user.lastName ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">CNIC</dt>
              <dd className="font-medium text-slate-900 mt-0.5 font-mono">{user.cnic ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Gender</dt>
              <dd className="font-medium text-slate-900 mt-0.5">{user.gender?.replace(/_/g, ' ') ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Religion</dt>
              <dd className="font-medium text-slate-900 mt-0.5">{user.religion ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Mobile</dt>
              <dd className="font-medium text-slate-900 mt-0.5">{user.mobile ?? '—'}</dd>
            </div>
          </dl>
        ) : (
          <form
            onSubmit={profileForm.handleSubmit(async (d) => {
              setProfileError('');
              try {
                await updateProfile(d);
                toast.success('Profile saved and locked for scholarship applications');
              } catch (e) {
                setProfileError((e as Error).message);
              }
            })}
            className="space-y-3"
          >
            <FormField label="University" hint="Selected when you registered — cannot be changed here">
              <input
                value={user.university?.name ?? ''}
                disabled
                className={readOnlyClass}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Degree program" error={profileForm.formState.errors.enrolledProgram} required hint="Used on your scholarship applications">
                <select {...profileForm.register('enrolledProgram')} className={selectClass(!!profileForm.formState.errors.enrolledProgram)}>
                  <option value="">Select program...</option>
                  {programs.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Current year" error={profileForm.formState.errors.academicYear} required>
                <select {...profileForm.register('academicYear')} className={selectClass(!!profileForm.formState.errors.academicYear)}>
                  <option value="">Select year...</option>
                  {academicYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="First Name" error={profileForm.formState.errors.firstName} required>
                <input {...profileForm.register('firstName')} className={inputClass()} autoComplete="given-name" />
              </FormField>
              <FormField label="Last Name" error={profileForm.formState.errors.lastName} required>
                <input {...profileForm.register('lastName')} className={inputClass()} autoComplete="family-name" />
              </FormField>
            </div>
            <FormField label="CNIC" error={profileForm.formState.errors.cnic} required hint="Required for applications">
              <input {...profileForm.register('cnic')} placeholder="XXXXX-XXXXXXX-X" className={inputClass()} />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Gender" error={profileForm.formState.errors.gender} required>
                <select {...profileForm.register('gender')} className={selectClass(!!profileForm.formState.errors.gender)}>
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </FormField>
              <FormField label="Religion" error={profileForm.formState.errors.religion} required hint="Saved on your profile — not asked again when applying">
                <select {...profileForm.register('religion')} className={selectClass(!!profileForm.formState.errors.religion)}>
                  <option value="">Select religion</option>
                  {RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </FormField>
            </div>
            <FormField label="Mobile" error={profileForm.formState.errors.mobile}>
              <input {...profileForm.register('mobile')} className={inputClass()} />
            </FormField>
            <button type="submit" disabled={profileForm.formState.isSubmitting} className={btnPrimary()}>
              Save & lock profile
            </button>
          </form>
        )}
      </Card>

      <Card title="Change password">
        {passwordError && <p className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">{passwordError}</p>}
        <form
          onSubmit={passwordForm.handleSubmit(async (d) => {
            setPasswordError('');
            try {
              await changePassword(d);
              toast.success('Password changed successfully');
              passwordForm.reset();
            } catch (e) {
              setPasswordError((e as Error).message);
            }
          })}
          className="space-y-3"
        >
          <FormField label="Current Password" error={passwordForm.formState.errors.currentPassword} required>
            <input type="password" {...passwordForm.register('currentPassword')} className={inputClass()} autoComplete="current-password" />
          </FormField>
          <FormField label="New Password" error={passwordForm.formState.errors.newPassword} required>
            <input type="password" {...passwordForm.register('newPassword')} className={inputClass()} autoComplete="new-password" />
          </FormField>
          <FormField label="Confirm New Password" error={passwordForm.formState.errors.confirmPassword} required>
            <input type="password" {...passwordForm.register('confirmPassword')} className={inputClass()} autoComplete="new-password" />
          </FormField>
          <button type="submit" disabled={passwordForm.formState.isSubmitting} className={btnPrimary()}>
            Update Password
          </button>
        </form>
      </Card>
    </div>
  );
}
