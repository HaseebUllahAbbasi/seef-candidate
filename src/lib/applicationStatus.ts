export const APPLICATION_STEPS = [
  { key: 'applied', label: 'Applied', icon: 'user' },
  { key: 'verified', label: 'Verified', icon: 'shield' },
  { key: 'shortlisted', label: 'Shortlisted', icon: 'list' },
  { key: 'interview', label: 'Interview', icon: 'calendar' },
  { key: 'conducted', label: 'Interview Done', icon: 'users' },
  { key: 'merit', label: 'Merit Review', icon: 'chart' },
  { key: 'awarded', label: 'Awarded', icon: 'award' },
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
    WAITING_LIST: 5,
    ON_HOLD_VERIFIED: 5,
    ON_HOLD_RESULT_PENDING: 5,
    AWARDED: 6,
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
  INTERVIEW_CONDUCTED: 'Interview Completed',
  AWARDED: 'Scholarship Awarded',
  REJECTED: 'Not Selected',
  WAITING_LIST: 'Waiting List',
  ON_HOLD_VERIFIED: 'On Hold — Verified',
  ON_HOLD_RESULT_PENDING: 'Result Pending',
};
