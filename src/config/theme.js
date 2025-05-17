import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90CAF9",
      light: "#E3F2FD",
      dark: "#42A5F5",
      contrastText: "#000",
    },
    secondary: {
      main: "#CE93D8",
      light: "#F3E5F5",
      dark: "#AB47BC",
      contrastText: "#000",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    gold: {
      main: "#FFD700",
      light: "#FFEC8B",
      dark: "#B8860B",
      contrastText: "#000",
    },
    rarityColor: {
      5: "#FFD700",
      4: "#DA70D6",
      3: "#6495ED",
      2: "#32CD32",
      1: "#708090",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: "none",
      fontWeight: "bold",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
        },
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        size: "small",
      },
    },
    MuiAvatar: {
      defaultProps: {
        variant: "square",
      },
    },
    MuiBadge: {
      defaultProps: {
        overlap: "circular",
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      },
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
        badge: {
          fontWeight: "bold",
          textShadow: "0 0 8px rgba(0, 0, 0, 1)",
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
        slotProps: {
          inputLabel: {
            shrink: true,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        slotProps: {
          inputLabel: {
            shrink: true,
          },
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
    MuiTabs: {
      defaultProps: {
        variant: "fullWidth",
        centered: true,
      },
      styleOverrides: {
        root: {
          borderBottom: "1px solid",
        },
        indicator: {
          height: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
  },
});

export default theme;
