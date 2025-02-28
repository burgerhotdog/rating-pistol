import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  customStyles: {
    modal: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: 4,
      backgroundColor: "background.paper",
      borderRadius: 2,
      maxHeight: "80vh",
      overflowY: "auto",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.menuButton": {
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "80px", 
            fontWeight: "bold", 
            fontSize: "1.2rem", 
            color: "rgba(255, 255, 255, 0.87)",
            "&:hover": {
              opacity: 0.8,
            },
          },
        },
      },
    },
  },
});

export default theme;
