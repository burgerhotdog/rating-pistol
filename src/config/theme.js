import { createTheme, alpha } from '@mui/material';

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
  typography: { button: { textTransform: 'none', fontWeight: 'bold' } },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          // Webkit (Chrome, Edge, Safari)
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.text.disabled, 0.5),
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: alpha(theme.palette.text.secondary, 0.7),
          },

          // Firefox
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha(theme.palette.text.disabled, 0.5)} transparent`,
        },
      }),
    },
    MuiAvatar: { defaultProps: { variant: 'square' } },
    MuiCheckbox: { defaultProps: { size: 'small' } },
    MuiFormControl: { defaultProps: { size: 'small' } },
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
      defaultProps: {
        arrow: true,
        slotProps: {
          popper: {
            modifiers: [{
              name: 'preventOverflow',
              options: { altAxis: true, tether: false },
            }],
          },
        },
      },
    },
  },
});

export default theme;
