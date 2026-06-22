export function canEditApplication(app: { status: string; editUnlocked?: boolean | null }) {
  return app.status === 'DRAFT' || (app.status === 'APPLIED_UNVERIFIED' && !!app.editUnlocked);
}
