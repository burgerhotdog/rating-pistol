import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    rarityColor: {
      5: '#FFD700',
      4: '#DA70D6',
      3: '#6495ED',
      2: '#32CD32',
      1: '#708090',
    },
  },
  typography: {
    button: { textTransform: 'none', fontWeight: 'bold' }
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAvatar: {
      defaultProps: { variant: 'square' },
    },
    MuiCheckbox: {
      defaultProps: { size: 'small' },
    },
    MuiFormControl: {
      defaultProps: { size: 'small' },
    },
    MuiSelect: {
      defaultProps: {
        slotProps: { inputLabel: { shrink: true } },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 'bold' },
      },
    },
    MuiTabs: {
      defaultProps: {
        variant: 'fullWidth',
        centered: true,
      },
      styleOverrides: {
        root: { borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
      },
    },
    MuiTextField: {
      defaultProps: {
        slotProps: { inputLabel: { shrink: true } },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },
  },
});

export default theme;
