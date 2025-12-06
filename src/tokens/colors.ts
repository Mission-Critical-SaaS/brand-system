/**
 * MCS Brand Color Constants
 * TypeScript-friendly color values for all brands
 */

export const colors = {
  mcs: {
    primary: '#1E40AF',
    primaryLight: '#3B82F6',
    primaryDark: '#1E3A8A',
    primary50: '#EFF6FF',
    primary100: '#DBEAFE',
    primary200: '#BFDBFE',
    primary500: '#3B82F6',
    primary600: '#2563EB',
    primary700: '#1D4ED8',
    primary800: '#1E40AF',
    primary900: '#1E3A8A',
    accent: '#3B82F6',
    accentLight: '#60A5FA',
  },
  minute7: {
    primary: '#059669',
    primaryLight: '#10B981',
    primaryDark: '#047857',
    primary50: '#ECFDF5',
    primary100: '#D1FAE5',
    primary200: '#A7F3D0',
    primary500: '#10B981',
    primary600: '#059669',
    primary700: '#047857',
    primary800: '#065F46',
    primary900: '#064E3B',
    accent: '#22C55E',
    accentLight: '#4ADE80',
  },
  hour: {
    primary: '#EA580C',
    primaryLight: '#F97316',
    primaryDark: '#C2410C',
    primary50: '#FFF7ED',
    primary100: '#FFEDD5',
    primary200: '#FED7AA',
    primary500: '#F97316',
    primary600: '#EA580C',
    primary700: '#C2410C',
    primary800: '#9A3412',
    primary900: '#7C2D12',
    accent: '#F97316',
    accentLight: '#FB923C',
  },
  lmntl: {
    primary: '#7C3AED',
    primaryLight: '#8B5CF6',
    primaryDark: '#6D28D9',
    primary50: '#F5F3FF',
    primary100: '#EDE9FE',
    primary200: '#DDD6FE',
    primary500: '#8B5CF6',
    primary600: '#7C3AED',
    primary700: '#6D28D9',
    primary800: '#5B21B6',
    primary900: '#4C1D95',
    accent: '#A78BFA',
    accentLight: '#C4B5FD',
  },
  // Shared semantic colors
  semantic: {
    success: '#059669',
    successLight: '#D1FAE5',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    error: '#DC2626',
    errorLight: '#FEE2E2',
    info: '#0284C7',
    infoLight: '#E0F2FE',
  },
  // Shared neutrals
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
} as const;

export type Brand = 'mcs' | 'minute7' | 'hour' | 'lmntl';

export interface BrandColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primary50: string;
  primary100: string;
  primary200: string;
  primary500: string;
  primary600: string;
  primary700: string;
  primary800: string;
  primary900: string;
  accent: string;
  accentLight: string;
}

export function getBrandColors(brand: Brand): BrandColors {
  return colors[brand] as BrandColors;
}

export function getBrandPrimary(brand: Brand): string {
  return colors[brand].primary;
}
