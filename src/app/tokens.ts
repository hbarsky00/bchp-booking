/**
 * Colour tokens.
 *
 * The pages were built against a Tailwind-style scale while the MUI theme was still on
 * stock Material blue, so the app carried two palettes that never agreed. These are the
 * scales the UI actually uses, named once here and consumed by both `theme.ts` and the
 * pages, so there is a single source of truth.
 */
export const c = {
  // Neutrals — slate
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate500: '#64748B',
  slate600: '#475569',
  slate800: '#1E293B',
  slate900: '#0F172A',

  // Neutrals — warm grey (borders, dividers)
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',

  // Accent — sky (primary)
  sky50: '#F0F9FF',
  sky100: '#E0F2FE',
  sky500: '#0EA5E9',
  sky600: '#0284C7',
  sky800: '#075985',

  // Accent — blue (informational)
  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  blue200: '#BFDBFE',
  blue500: '#3B82F6',
  blue800: '#1E40AF',

  // Success — green
  green50: '#F0FDF4',
  green100: '#DCFCE7',
  green200: '#BBF7D0',
  green300: '#86EFAC',
  green400: '#4ADE80',
  green500: '#22C55E',
  green600: '#16A34A',
  green700: '#15803D',
  green900: '#14532D',
  emerald100: '#D1FAE5',
  emerald800: '#065F46',

  // Warning — amber
  amber100: '#FEF3C7',
  amber200: '#FDE68A',
  amber500: '#F59E0B',
  amber800: '#92400E',

  // Danger — red
  red100: '#FEE2E2',
  red200: '#FECACA',
  red300: '#FCA5A5',
  red400: '#F87171',
  red500: '#EF4444',
  red600: '#DC2626',
  red800: '#991B1B',
  red900: '#7F1D1D',

  // Accent — violet
  violet100: '#EDE9FE',
  violet200: '#DDD6FE',
  violet600: '#7C3AED',
} as const;
