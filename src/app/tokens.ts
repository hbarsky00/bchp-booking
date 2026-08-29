/**
 * Colour tokens.
 *
 * Warm hospitality palette: stone neutrals carry the interface, a single deep coral
 * carries action, and a green "verify" role carries the on-chain trust signals. The
 * accent is deliberately darker than the coral you see on travel sites — theirs sits
 * around 3.6:1 on white, which fails WCAG AA the moment it holds a label.
 */
export const c = {
  // Warm neutrals — the whole interface sits on these
  stone50: '#FAF9F7',
  stone100: '#F4F2EE',
  stone200: '#E7E3DC',
  stone300: '#D5CFC5',
  stone500: '#857C70',
  stone600: '#645C52',
  stone800: '#332F2A',
  stone900: '#1C1917',

  // Hairlines and dividers
  gray100: '#F4F2EE',
  gray200: '#E7E3DC',
  gray300: '#D5CFC5',

  // Coral — the single action colour
  coral50: '#FFF5F5',
  coral100: '#FFE4E6',
  coral500: '#E14A63',
  coral600: '#C92A4B',
  coral700: '#A11D3C',
  coral800: '#7C1631',

  // Ink — used where coral would shout
  blue50: '#F5F3F0',
  blue100: '#E7E3DC',
  blue200: '#D5CFC5',
  blue500: '#645C52',
  blue800: '#332F2A',

  // Verified / success — the on-chain trust signal
  green50: '#F0FAF4',
  green100: '#D9F2E3',
  green200: '#B4E5C9',
  green300: '#86D5AA',
  green400: '#4FBF87',
  green500: '#22A06B',
  green600: '#158055',
  green700: '#0F6B47',
  green900: '#0A3D2A',
  emerald100: '#D9F2E3',
  emerald800: '#0F6B47',

  // Pending / caution
  amber100: '#FDF3E3',
  amber200: '#F8E3BE',
  amber500: '#C77F1A',
  amber800: '#7A4A0B',

  // Errors and cancellations
  red100: '#FDECEC',
  red200: '#FAD5D5',
  red300: '#F2AFAF',
  red400: '#E57373',
  red500: '#D64545',
  red600: '#B93030',
  red800: '#8A1F1F',
  red900: '#5E1414',

  // Premium accent — reserved for token / proof-of-stay moments
  violet100: '#F3EFE7',
  violet200: '#E5DCC9',
  violet600: '#8A6D3B',
} as const;
