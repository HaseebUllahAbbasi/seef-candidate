import type { ChangeEvent } from 'react';
import type { FieldPath, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import {
  CNIC_PLACEHOLDER,
  MOBILE_PLACEHOLDER,
  formatCnicInput,
  formatMobileInput,
} from './pakistanIdFormat';

export function cnicInputProps<T extends FieldValues>(
  register: UseFormRegister<T>,
  setValue: UseFormSetValue<T>,
  name: FieldPath<T>,
) {
  const reg = register(name);
  return {
    ...reg,
    placeholder: CNIC_PLACEHOLDER,
    maxLength: 15,
    inputMode: 'numeric' as const,
    autoComplete: 'off',
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCnicInput(e.target.value);
      setValue(name, formatted as never, { shouldValidate: true, shouldDirty: true });
    },
  };
}

export function mobileInputProps<T extends FieldValues>(
  register: UseFormRegister<T>,
  setValue: UseFormSetValue<T>,
  name: FieldPath<T>,
) {
  const reg = register(name);
  return {
    ...reg,
    placeholder: MOBILE_PLACEHOLDER,
    maxLength: 12,
    inputMode: 'numeric' as const,
    autoComplete: 'tel',
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = formatMobileInput(e.target.value);
      setValue(name, formatted as never, { shouldValidate: true, shouldDirty: true });
    },
  };
}
