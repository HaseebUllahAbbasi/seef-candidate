import { SINDH_DISTRICTS } from './districts';

export function normalizeEligibleDistricts(districts?: string[] | null): string[] {
  if (!districts?.length || districts.length >= SINDH_DISTRICTS.length) {
    return [...SINDH_DISTRICTS];
  }
  return districts;
}

export function isDistrictEligible(districts: string[] | undefined | null, district: string): boolean {
  if (!district.trim()) return false;
  return normalizeEligibleDistricts(districts).includes(district.trim());
}

export function isProgramEligible(
  programs: { id: string }[] | undefined,
  programId: string | undefined,
): boolean {
  if (!programId || !programs?.length) return false;
  return programs.some((p) => p.id === programId);
}
