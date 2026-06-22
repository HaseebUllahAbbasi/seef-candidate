export function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(seed)}`;
}

export function userAvatar(user: { firstName?: string | null; lastName?: string | null; fullName?: string; email?: string }): string {
  const seed = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.fullName || user.email || 'User';
  return avatarUrl(seed);
}
