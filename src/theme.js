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
    MuiToggleButtonGroup: {
      defaultProps: {
        size: 'small',
        exclusive: true,
      },
    },
  },
});

export default theme;
