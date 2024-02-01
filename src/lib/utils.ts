import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtCurrency(value: number, locale = 'en-US') {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
