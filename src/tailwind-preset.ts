/**
 * MCS Brand Tailwind CSS Preset
 * Drop-in preset with all brand colors and utilities
 */

import type { Config } from 'tailwindcss';
import { colors } from './tokens/colors';

export const mcsBrandPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // MCS Brand
        'mcs-blue': colors.mcs.primary,
        'mcs-light-blue': colors.mcs.primaryLight,

        // Minute7 Brand
        'minute7-green': colors.minute7.primary,
        'minute7-light': colors.minute7.primaryLight,

        // Hour Timesheet Brand
        'hour-orange': colors.hour.primary,
        'hour-light': colors.hour.primaryLight,

        // LMNTL.AI Brand
        'lmntl-purple': colors.lmntl.primary,
        'lmntl-light': colors.lmntl.primaryLight,
        'lmntl-dark': colors.lmntl.primaryDark,

        // Semantic colors
        'brand-success': colors.semantic.success,
        'brand-warning': colors.semantic.warning,
        'brand-error': colors.semantic.error,
        'brand-info': colors.semantic.info,

        // Neutrals
        'brand-neutral': colors.neutral,
      },
      fontFamily: {
        heading: ['Geist Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        body: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        brand: '0.5rem',
      },
      boxShadow: {
        'brand-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'brand-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'brand-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      transitionDuration: {
        'brand-fast': '150ms',
        'brand-normal': '200ms',
        'brand-slow': '300ms',
      },
    },
  },
};

export default mcsBrandPreset;
