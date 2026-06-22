import { z } from 'zod';

export const MOBILE_REGEX = /^03\d{2}-\d{7}$/;

export const loginSchema = z.object({
  username: z.string().min(1, 'University email or username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Enter a valid university email'),
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string().min(8),
  mobile: z.string().regex(MOBILE_REGEX, 'Format: 03XX-XXXXXXX'),
  universityId: z.string().min(1, 'Select your university'),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string().min(8),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, 'Format: XXXXX-XXXXXXX-X').optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  mobile: z.string().regex(MOBILE_REGEX).optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
export type ProfileForm = z.infer<typeof profileSchema>;

// Application wizard schemas (unchanged)
export const CNIC_REGEX = /^\d{5}-\d{7}-\d$/;

export const personalSchema = z.object({
  fullName: z.string().min(2).max(100),
  fatherName: z.string().min(2).max(100),
  cnic: z.string().regex(CNIC_REGEX, 'Invalid CNIC format'),
  dateOfBirth: z.string().min(1),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  email: z.string().email(),
  mobile: z.string().regex(MOBILE_REGEX, 'Invalid mobile format'),
  permanentAddress: z.string().min(5).max(500),
  currentAddress: z.string().max(500).optional(),
  district: z.string().min(1),
  domicileDistrict: z.string().min(1),
  religion: z.string().min(1, 'Select religion'),
});

export const academicSchema = z.object({
  academicYear: z.string().min(1),
  currentSemester: z.string().optional(),
  enrollmentNumber: z.string().min(1),
  cgpa: z.coerce.number().min(0).max(4),
  percentage: z.coerce.number().optional(),
  previousQualification: z.string().min(1),
  previousInstitution: z.string().min(1),
  previousMarks: z.string().min(1),
});

export const disabilitySchema = z.object({
  hasDisability: z.boolean(),
  disabilityType: z.string().optional(),
  disabilityPercentage: z.coerce.number().min(0).max(100).optional(),
  isOrphan: z.boolean(),
  orphanDetails: z.string().optional(),
}).superRefine((d, ctx) => {
  if (d.hasDisability && !d.disabilityType) ctx.addIssue({ code: 'custom', message: 'Disability type required', path: ['disabilityType'] });
  if (d.isOrphan && !d.orphanDetails) ctx.addIssue({ code: 'custom', message: 'Orphan details required', path: ['orphanDetails'] });
});

export type PersonalForm = z.infer<typeof personalSchema>;
export type AcademicForm = z.infer<typeof academicSchema>;
