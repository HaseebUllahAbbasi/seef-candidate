import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { profileSchema, changePasswordSchema, ProfileForm, ChangePasswordForm } from '../lib/validation';
import { userAvatar } from '../lib/avatar';
import { FormField, inputClass, btnPrimary, Card } from '../components/ui';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const location = useLocation();
  const welcome = (location.state as { welcome?: boolean } | null)?.welcome;
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || user?.fullName?.split(' ')[0] || '',
      lastName: user?.lastName || user?.fullName?.split(' ').slice(1).join(' ') || '',
      cnic: user?.cnic || '',
      gender: (user?.gender as ProfileForm['gender']) || undefined,
      mobile: user?.mobile || '',
    },
  });

  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  if (!user) return null;

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
          {user.university && <p className="text-xs text-emerald-700 mt-0.5">{user.university.name}</p>}
        </div>
      </div>

      {!user.profileComplete && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
          {welcome ? (
            <p className="font-medium">Welcome! Please add your first name, last name, CNIC, and gender before applying for scholarships.</p>
          ) : (
            <p>Complete your profile — first name, last name, CNIC, and gender are required before submitting scholarship applications.</p>
          )}
        </div>
      )}

      <Card title="Personal details">
        {profileMsg && <p className="mb-3 text-sm text-emerald-700 bg-emerald-50 p-2 rounded-lg">{profileMsg}</p>}
        {profileError && <p className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">{profileError}</p>}
        <form
          onSubmit={profileForm.handleSubmit(async (d) => {
            setProfileMsg('');
            setProfileError('');
            try {
              await updateProfile(d);
              setProfileMsg('Profile updated successfully');
            } catch (e) {
              setProfileError((e as Error).message);
            }
          })}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="First Name" error={profileForm.formState.errors.firstName} required>
              <input {...profileForm.register('firstName')} className={inputClass()} autoComplete="given-name" />
            </FormField>
            <FormField label="Last Name" error={profileForm.formState.errors.lastName} required>
              <input {...profileForm.register('lastName')} className={inputClass()} autoComplete="family-name" />
            </FormField>
          </div>
          <FormField label="CNIC" error={profileForm.formState.errors.cnic} hint="Required for applications">
            <input {...profileForm.register('cnic')} placeholder="XXXXX-XXXXXXX-X" className={inputClass()} />
          </FormField>
          <FormField label="Gender" error={profileForm.formState.errors.gender}>
            <select {...profileForm.register('gender')} className={inputClass()}>
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </FormField>
          <FormField label="Mobile" error={profileForm.formState.errors.mobile}>
            <input {...profileForm.register('mobile')} className={inputClass()} />
          </FormField>
          <button type="submit" disabled={profileForm.formState.isSubmitting} className={btnPrimary()}>
            Save Profile
          </button>
        </form>
      </Card>

      <Card title="Change password">
        {passwordMsg && <p className="mb-3 text-sm text-emerald-700 bg-emerald-50 p-2 rounded-lg">{passwordMsg}</p>}
        {passwordError && <p className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">{passwordError}</p>}
        <form
          onSubmit={passwordForm.handleSubmit(async (d) => {
            setPasswordMsg('');
            setPasswordError('');
            try {
              await changePassword(d);
              setPasswordMsg('Password changed successfully');
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
