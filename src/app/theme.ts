import { createTheme } from '@mui/material/styles';
import { c } from './tokens';

const font = '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", sans-serif';

// Strict Material Design 3 Theme
export const theme = createTheme({
  palette: {
    primary: {
      main: c.sky700,
      light: c.sky500,
      dark: c.sky800,
      contrastText: '#ffffff',
    },
    secondary: {
      main: c.violet600,
      light: c.violet200,
      dark: c.violet600,
      contrastText: '#ffffff',
    },
    tertiary: {
      main: c.amber500,
      light: c.amber200,
      dark: c.amber800,
      contrastText: '#000000',
    },
    error: {
      main: c.red600,
      light: c.red400,
      dark: c.red800,
      contrastText: '#ffffff',
    },
    warning: {
      main: c.amber500,
      light: c.amber200,
      dark: c.amber800,
      contrastText: c.slate900,
    },
    info: {
      main: c.blue500,
      light: c.blue200,
      dark: c.blue800,
      contrastText: '#ffffff',
    },
    success: {
      main: c.green700,
      light: c.green400,
      dark: c.green900,
      contrastText: '#ffffff',
    },
    background: {
      default: c.slate50,
      paper: '#ffffff',
    },
    text: {
      primary: c.slate900,
      secondary: c.slate600,
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: c.slate200,
  },
  typography: {
    fontFamily: font,
    h1: {
      fontFamily: font,
      fontWeight: 600,
      fontSize: 'clamp(1.75rem, 1.25rem + 2.2vw, 2.5rem)',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: font,
      fontWeight: 600,
      fontSize: 'clamp(1.5rem, 1.15rem + 1.6vw, 2rem)',
      letterSpacing: '-0.018em',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: font,
      fontWeight: 500,
      fontSize: 'clamp(1.375rem, 1.15rem + 1vw, 1.75rem)',
      letterSpacing: '-0.015em',
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: font,
      fontWeight: 500,
      fontSize: 'clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)',
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: font,
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: font,
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: font,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: font,
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontFamily: font,
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none', // Sentence case
      lineHeight: 1.75,
    },
    caption: {
      fontFamily: font,
      fontSize: '0.75rem',
      lineHeight: 1.66,
    },
    overline: {
      fontFamily: font,
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 2.66,
      textTransform: 'uppercase',
    },
  },
  spacing: 8, // 8dp base unit
  shape: {
    borderRadius: 12, // M3 medium corner radius
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          subtitle1: 'p',
          subtitle2: 'p',
          body1: 'p',
          body2: 'p',
        },
      },
      styleOverrides: {
        // Cap the reading measure at ~64 characters. This only bites on real prose;
        // short labels and values are unaffected because it is a max, not a width.
        body1: { maxWidth: '64ch' },
        body2: { maxWidth: '64ch' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // M3 button corner radius
          textTransform: 'none',
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: { fontVariantNumeric: 'tabular-nums' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 'auto',
          minHeight: 28,
          paddingTop: 4,
          paddingBottom: 4,
        },
        label: {
          lineHeight: 1.4,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}
