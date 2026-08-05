import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  qualityColors: {
    5: '#FCD34D',
    4: '#C4B5FD',
    3: '#7DD3FC',
    2: '#6EE7B7',
    1: '#94A3B8',
  },
  typography: {
    subtitle1: {
      fontWeight: 'bold',
    },
    subtitle2: {
      fontWeight: 'bold',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiCardHeader: {
      defaultProps: {
        slotProps: {
          title: {
            variant: 'subtitle1',
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiChip: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFormControlLabel: {
      defaultProps: {
        slotProps: {
          typography: {
            variant: 'caption',
            color: 'textSecondary',
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
      styleOverrides: {
        root: {
          minHeight: 0,
        },
      },
    },
    MuiSvgIcon: {
      defaultProps: {
        fontSize: 'small',
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTab: {
      defaultProps: {
        sx: { typography: 'subtitle1' },
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiToggleButton: {
      defaultProps: {
        size: 'small',
        sx: { typography: 'caption' },
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiToggleButtonGroup: {
      defaultProps: {
        size: 'small',
        exclusive: true,
      },
    },
  },
});

export default theme;
