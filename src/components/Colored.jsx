import { alpha, styled } from '@mui/material/styles';
import MuiSwitch from '@mui/material/Switch';
import MuiTabs from '@mui/material/Tabs';

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
