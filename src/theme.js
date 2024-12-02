import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    allVariants: {
      color: "#e0e0e0",
    },
  },
  components: {
    MuiBox: {
      styleOverrides: {
        root: {
          backgroundColor: "#242424",
          color: "e0e0e0",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "#e0e0e0",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "#e0e0e0",
          backgroundColor: "#3b3b3b",
        },
        icon: {
          color: "#e0e0e0",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#333333",
        },
      },
    },
  },
});

export default theme;
