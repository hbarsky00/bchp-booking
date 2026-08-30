import { createTheme } from '@mui/material/styles';
import { c, r } from './tokens';

// Figtree: warm geometric with real personality in the heavier weights, and off the
// overused-font lists that Inter/Roboto/Space Grotesk sit on.
const font = 'Figtree, ui-sans-serif, system-ui, -apple-system, sans-serif';

export const theme = createTheme({
  palette: {
    primary: {
      main: c.coral600,
      light: c.coral500,
      dark: c.coral700,
      contrastText: '#ffffff',
    },
    secondary: {
      main: c.stone900,
      light: c.stone600,
      dark: '#000000',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: c.violet600,
      light: c.violet200,
      dark: c.violet600,
      contrastText: '#ffffff',
    },
    error: { main: c.red600, light: c.red400, dark: c.red800, contrastText: '#ffffff' },
    warning: { main: c.amber500, light: c.amber200, dark: c.amber800, contrastText: c.stone900 },
    info: { main: c.blue500, light: c.blue200, dark: c.blue800, contrastText: '#ffffff' },
    success: { main: c.green700, light: c.green400, dark: c.green900, contrastText: '#ffffff' },
    background: { default: '#FFFFFF', paper: '#FFFFFF' },
    text: { primary: c.stone900, secondary: c.stone600, disabled: c.stone500 },
    divider: c.stone200,
  },

  typography: {
    fontFamily: font,
    // Display sizes tighten as they grow; small text opens up.
    h1: { fontFamily: font, fontWeight: 800, fontSize: 'clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem)', lineHeight: 1.12, letterSpacing: '-0.03em' },
    h2: { fontFamily: font, fontWeight: 700, fontSize: 'clamp(1.5rem, 1.15rem + 1.6vw, 2rem)', lineHeight: 1.2, letterSpacing: '-0.022em' },
    h3: { fontFamily: font, fontWeight: 700, fontSize: 'clamp(1.3rem, 1.1rem + 0.9vw, 1.625rem)', lineHeight: 1.25, letterSpacing: '-0.018em' },
    h4: { fontFamily: font, fontWeight: 700, fontSize: 'clamp(1.15rem, 1.05rem + 0.5vw, 1.375rem)', lineHeight: 1.3, letterSpacing: '-0.014em' },
    h5: { fontFamily: font, fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4, letterSpacing: '-0.01em' },
    h6: { fontFamily: font, fontWeight: 600, fontSize: '1rem', lineHeight: 1.45, letterSpacing: '-0.006em' },
    subtitle1: { fontFamily: font, fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.5 },
    subtitle2: { fontFamily: font, fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.45 },
    body1: { fontFamily: font, fontSize: '1rem', lineHeight: 1.55 },
    body2: { fontFamily: font, fontSize: '0.9375rem', lineHeight: 1.5 },
    button: { fontFamily: font, fontWeight: 600, fontSize: '0.9375rem', textTransform: 'none', lineHeight: 1.4 },
    caption: { fontFamily: font, fontSize: '0.8125rem', lineHeight: 1.45, letterSpacing: '0.005em' },
    overline: { fontFamily: font, fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.6, letterSpacing: '0.06em', textTransform: 'uppercase' },
  },

  spacing: 8,
  shape: { borderRadius: r.md },

  components: {
    MuiTypography: {
      defaultProps: {
        // MUI maps these onto <h6>, which silently pollutes the heading outline.
        variantMapping: { subtitle1: 'p', subtitle2: 'p', body1: 'p', body2: 'p' },
      },
      styleOverrides: {
        body1: { maxWidth: '56ch' },
        body2: { maxWidth: '56ch' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: r.md,
          textTransform: 'none',
          fontWeight: 600,
          paddingTop: 11,
          paddingBottom: 11,
          paddingLeft: 20,
          paddingRight: 20,
          minHeight: 44, // thumb-sized
        },
        containedPrimary: {
          color: '#ffffff',
          backgroundColor: c.coral600,
          '&:hover': { backgroundColor: c.coral700 },
        },
        outlined: { borderColor: c.stone300, color: c.stone900, '&:hover': { borderColor: c.stone900, backgroundColor: c.stone50 } },
      },
      variants: [
        {
          // `soft`: an action repeated many times in a list. Twelve filled buttons on a
          // product grid leave the page's real primary action with nothing to stand out
          // against, so repeated actions get a tinted treatment instead.
          props: { variant: 'soft' },
          style: {
            backgroundColor: c.coral50,
            color: c.coral700,
            border: `1px solid ${c.coral100}`,
            '&:hover': { backgroundColor: c.coral100, borderColor: c.coral500 },
            '&.Mui-disabled': { backgroundColor: c.stone100, color: c.stone500, borderColor: c.stone200 },
          },
        },
      ],
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: r.lg,
          border: `1px solid ${c.stone200}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: r.pill, height: 'auto', minHeight: 28, paddingTop: 4, paddingBottom: 4, fontWeight: 600 },
        label: { lineHeight: 1.4 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: r.md,
            backgroundColor: '#FFFFFF',
            '& fieldset': { borderColor: c.stone300 },
            '&:hover fieldset': { borderColor: c.stone500 },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: r.md } },
    },
    MuiTable: {
      styleOverrides: { root: { fontVariantNumeric: 'tabular-nums' } },
    },
    MuiCssBaseline: {
      styleOverrides: {
        // Prices and dates should line up in columns.
        '.tnum': { fontVariantNumeric: 'tabular-nums' },
        // break-word only breaks a word that cannot fit on a line of its own.
        // 'anywhere' also lets flex children shrink to a single character, which turned
        // headings into vertical letter columns next to a chip.
        'p, h1, h2, h3, h4, h5, h6, span': { overflowWrap: 'break-word' },
        // Opt-in for genuinely unbreakable strings: wallet addresses, tx hashes, IDs.
        '.break-all': { overflowWrap: 'anywhere', wordBreak: 'break-all' },
        ':focus-visible': { outline: `2px solid ${c.coral600}`, outlineOffset: 2 },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette { tertiary: Palette['primary']; }
  interface PaletteOptions { tertiary?: PaletteOptions['primary']; }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides { soft: true; }
}
