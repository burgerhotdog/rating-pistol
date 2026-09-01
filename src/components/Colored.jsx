import { alpha, darken, styled } from '@mui/material/styles';
import MuiButton from '@mui/material/Button';
import MuiSwitch from '@mui/material/Switch';
import MuiTabs from '@mui/material/Tabs';

export const Button = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'color',
})(({ theme, color }) => ({
  '&.MuiButton-contained': {
    color: theme.palette.getContrastText(color),
    backgroundColor: color,

    '&:hover': {
      backgroundColor: darken(color, 0.15),
    },

    '&.Mui-disabled': {
      backgroundColor: alpha(color, theme.palette.action.disabledOpacity),
    },
  },

  '&.MuiButton-outlined': {
    color,
    borderColor: color,

    '&:hover': {
      borderColor: color,
      backgroundColor: alpha(color, theme.palette.action.hoverOpacity),
    },

    '&.Mui-disabled': {
      color: alpha(color, theme.palette.action.disabledOpacity),
      borderColor: alpha(color, theme.palette.action.disabledOpacity),
    },
  },

  '&.MuiButton-text': {
    color,

    '&:hover': {
      backgroundColor: alpha(color, theme.palette.action.hoverOpacity),
    },

    '&.Mui-disabled': {
      color: alpha(color, theme.palette.action.disabledOpacity),
    },
  },
}));

export const Switch = styled(MuiSwitch, {
  shouldForwardProp: (prop) => prop !== 'color',
})(({ theme, color }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color,
    '&:hover': {
      backgroundColor: alpha(color, theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: color,
  },
}));

export const Tabs = styled(MuiTabs, {
  shouldForwardProp: (prop) => prop !== 'color',
})(({ color }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: color,
  },
}));
