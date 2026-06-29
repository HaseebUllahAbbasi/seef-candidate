import { z } from 'zod';

export const CNIC_REGEX = /^\d{5}-\d{7}-\d$/;
export const MOBILE_REGEX = /^03\d{2}-\d{7}$/;

export const CNIC_PLACEHOLDER = 'XXXXX-XXXXXXX-X';
export const MOBILE_PLACEHOLDER = '03XX-XXXXXXX';

export const CNIC_ERROR = 'CNIC must be 13 digits in format XXXXX-XXXXXXX-X (e.g. 42101-1234567-1). Dashes are added automatically.';
export const MOBILE_ERROR = 'Mobile must be 11 digits starting with 03, in format 03XX-XXXXXXX (e.g. 0300-1234567). Dash is added automatically.';

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCnicInput(value: string): string {
  const d = digitsOnly(value).slice(0, 13);
  if (d.length <= 5) return d;
  if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
}

export function formatMobileInput(value: string): string {
  const d = digitsOnly(value).slice(0, 11);
  if (d.length <= 4) return d;
  return `${d.slice(0, 4)}-${d.slice(4)}`;
}

export const cnicFieldSchema = z.string()
  .transform((v) => formatCnicInput(v))
  .pipe(z.string().regex(CNIC_REGEX, CNIC_ERROR));

export const optionalCnicFieldSchema = z.string()
  .transform((v) => formatCnicInput(v))
  .pipe(z.union([
    z.literal(''),
    z.string().regex(CNIC_REGEX, CNIC_ERROR),
  ]));

export const mobileFieldSchema = z.string()
  .transform((v) => formatMobileInput(v))
  .pipe(z.string().regex(MOBILE_REGEX, MOBILE_ERROR));

export const optionalMobileFieldSchema = z.string()
  .transform((v) => formatMobileInput(v))
  .pipe(z.union([
    z.literal(''),
    z.string().regex(MOBILE_REGEX, MOBILE_ERROR),
  ]));
