import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "rgba(255, 255, 255, 0.87)",
      secondary: "rgba(255, 255, 255, 0.6)",
    },
    background: {
      default: '#121212',
      paper: '#1D1D1D',
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.menuButton': {
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '80px', 
            fontWeight: 'bold', 
            fontSize: '1.2rem', 
            color: "rgba(255, 255, 255, 0.87)",
            '&:hover': {
              opacity: 0.8,
            },
          },
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
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#3b3b3b",
        },
      },
    },
  },
});

export default theme;

/*
{
  "typography": {
    "textPrimary": "#fff",
    "textSecondary": "rgba(255, 255, 255, 0.7)",
    "textDisabled": "rgba(255, 255, 255, 0.5)"
  },
  "buttons": {
    "actionActive": "#fff",
    "actionHover": "rgba(255, 255, 255, 0.08)",
    "actionSelected": "rgba(255, 255, 255, 0.16)",
    "actionDisabled": "rgba(255, 255, 255, 0.3)",
    "actionDisabledBackground": "rgba(255, 255, 255, 0.12)"
  },
  "background": {
    "default": "#121212",
    "paper": "#121212"
  },
  "divider": {
    "divider": "rgba(255, 255, 255, 0.12)"
  },
  "table": {
    "background": "#1e1e1e",
    "rowHover": "rgba(255, 255, 255, 0.08)",
    "header": "#333333",
    "border": "rgba(255, 255, 255, 0.12)"
  },
  "modal": {
    "background": "#1c1c1c",
    "overlay": "rgba(0, 0, 0, 0.7)"
  },
  "dropdown": {
    "background": "#222222",
    "optionHover": "rgba(255, 255, 255, 0.1)",
    "optionSelected": "#444444",
    "border": "rgba(255, 255, 255, 0.15)"
  },
  "form": {
    "inputBackground": "#333333",
    "inputText": "#fff",
    "inputBorder": "rgba(255, 255, 255, 0.2)",
    "inputFocusBorder": "#fff",
    "inputPlaceholder": "rgba(255, 255, 255, 0.6)"
  }
}
*/