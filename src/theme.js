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
  customStyles: {
    modal: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "background.paper",
      p: 4,
      borderRadius: 2,
      maxHeight: "80vh",
      maxWidth: "80vw",
      overflow: "auto",
    },
  },
  components: {
    MuiAutocomplete: {
      defaultProps: {
        size: "small",
        disableClearable: true,
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
    MuiSelect: {
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
