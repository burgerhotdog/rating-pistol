import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    rarityColor: {
      5: '#FCD34D',
      4: '#C4B5FD',
      3: '#7DD3FC',
      2: '#6EE7B7',
      1: '#94A3B8',
    },
  },
});

export default theme;
