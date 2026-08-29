import { createTheme } from '@mui/material/styles';
import { c } from './tokens';

// Strict Material Design 3 Theme
export const theme = createTheme({
  palette: {
    primary: {
      main: c.sky600,
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
      contrastText: '#ffffff',
    },
    info: {
      main: c.blue500,
      light: c.blue200,
      dark: c.blue800,
      contrastText: '#ffffff',
    },
    success: {
      main: c.green600,
      light: c.green400,
      dark: c.green700,
      contrastText: '#ffffff',
    },
    background: {
      default: c.slate50,
      paper: '#ffffff',
    },
    text: {
      primary: c.slate900,
      secondary: c.slate500,
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: c.slate200,
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontFamily: 'Raleway, sans-serif',
      fontWeight: 600,
      fontSize: 'clamp(1.75rem, 1.25rem + 2.2vw, 2.5rem)',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'Raleway, sans-serif',
      fontWeight: 600,
      fontSize: 'clamp(1.5rem, 1.15rem + 1.6vw, 2rem)',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: 'clamp(1.375rem, 1.15rem + 1vw, 1.75rem)',
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: 'clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none', // Sentence case
      lineHeight: 1.75,
    },
    caption: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '0.75rem',
      lineHeight: 1.66,
    },
    overline: {
      fontFamily: 'Roboto, sans-serif',
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
