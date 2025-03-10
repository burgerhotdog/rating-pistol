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
    MuiBox: {
      styleOverrides: {
        root: {
          '&[component="img"]': {
            objectFit: "contain",
          },
        },
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        disableClearable: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        slotProps: {
          inputLabel: {
            shrink: true,
          },
        },
      },
    },
  },
});

export default theme;
