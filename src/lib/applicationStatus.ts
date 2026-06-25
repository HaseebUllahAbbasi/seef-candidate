export const APPLICATION_STEPS = [
  { key: 'applied', label: 'Applied', icon: 'user' },
  { key: 'verified', label: 'Verified', icon: 'shield' },
  { key: 'shortlisted', label: 'Shortlisted', icon: 'list' },
  { key: 'interview', label: 'Interview Scheduled', icon: 'calendar' },
  { key: 'conducted', label: 'Interview Conducted', icon: 'users' },
  { key: 'result', label: 'Result', icon: 'award' },
] as const;

/** Maps status to the highest completed step index (0-based). */
export function statusToStepIndex(status: string): number {
  const map: Record<string, number> = {
    DRAFT: -1,
    APPLIED_UNVERIFIED: 0,
    APPLIED_VERIFIED: 1,
    SCRUTINY_IN_PROGRESS: 1,
    SHORTLISTED: 2,
    INTERVIEW_SCHEDULED: 3,
    INTERVIEW_CONDUCTED: 4,
    ON_HOLD_VERIFIED: 4,
    ON_HOLD_RESULT_PENDING: 4,
    AWARDED: 5,
    WAITING_LIST: 5,
    REJECTED: -2,
  };
  return map[status] ?? -1;
}

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft — Not Submitted',
  APPLIED_UNVERIFIED: 'Submitted — Under Review',
  APPLIED_VERIFIED: 'Documents Verified',
  SCRUTINY_IN_PROGRESS: 'Under Scrutiny',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  INTERVIEW_CONDUCTED: 'Result Pending',
  AWARDED: 'Scholarship Awarded',
  REJECTED: 'Not Selected',
  WAITING_LIST: 'Waiting List',
  ON_HOLD_VERIFIED: 'On Hold — Verified',
  ON_HOLD_RESULT_PENDING: 'Result Pending',
};

export function statusBadgeClasses(status: string): string {
  if (status === 'DRAFT') {
    return 'bg-amber-100 text-amber-900 border-amber-200';
  }
  if (status === 'REJECTED') {
    return 'bg-red-100 text-red-800 border-red-200';
  }
  if (status === 'WAITING_LIST' || status.startsWith('ON_HOLD')) {
    return 'bg-slate-100 text-slate-700 border-slate-200';
  }
  return 'bg-emerald-100 text-emerald-800 border-emerald-200';
}
