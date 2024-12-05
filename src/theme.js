import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    allVariants: {
      textAlign: 'center',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          display: 'flex',
          placeItems: 'center',
          minWidth: '320px',
          minHeight: '100vh',
          overflowY: 'scroll',
        },
        '#root': {
          maxWidth: '1280px', // Limits the max width of the container
          margin: '0 auto',   // Centers the container
          padding: '2rem',    // Adds padding around the content
          textAlign: 'center', // Centers text
        },
      }
    },
    MuiBox: {
      styleOverrides: {
        root: {
          backgroundColor: "#242424",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#3b3b3b",
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
