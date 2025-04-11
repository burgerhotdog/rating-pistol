import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    gold: {
      main: "#FFD700",
      light: "#FFEC8B",
      dark: "#B8860B",
      contrastText: "#000",
    },
    grey: {
      main: "#808080",
      light: "#808080",
      dark: "#808080",
      contrastText: "#000",
    },
    rarityColor: {
      5: "goldenrod",
      4: "orchid",
      3: "cornflowerblue",
      2: "green",
      1: "slategrey",
    },
  },
  components: {
    MuiAutocomplete: {
      defaultProps: {
        size: "small",
        disableClearable: true,
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
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
    MuiAvatar: {
      defaultProps: {
        variant: "square",
      },
    },
  },
});

export default theme;
