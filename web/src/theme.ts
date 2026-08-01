import { createTheme } from '@mui/material/styles'

export const DARK = '#282828'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#FF5252', contrastText: '#FFFFFF' },
    secondary: { main: '#E53935', contrastText: '#FFFFFF' },
    background: { default: '#FFFFFF', paper: '#FFFFFF' },
    text: { primary: '#282828', secondary: '#6B6B6B' },
    divider: '#EFEFEF',
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: 36,
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.015em',
    },
    h3: { fontSize: 24, fontWeight: 600, lineHeight: 1.25 },
    h4: { fontSize: 20, fontWeight: 600 },
    h5: { fontSize: 18, fontWeight: 600 },
    h6: { fontSize: 16, fontWeight: 600 },
    body1: { fontSize: 16 },
    body2: { fontSize: 14 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#FFFFFF' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20, paddingBlock: 10 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #F0F0F0',
          boxShadow: '0 10px 30px -18px rgba(40,40,40,0.18)',
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'medium' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12, backgroundColor: '#FAFAFA' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { backgroundColor: '#FFFFFF', borderBottom: '1px solid #F0F0F0' },
      },
    },
  },
})
