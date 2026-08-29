import { alpha, styled } from '@mui/material/styles';
import MuiSwitch from '@mui/material/Switch';

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
