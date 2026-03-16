import { createTheme, alpha } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    rarityColor: {
      5: '#FFD700',
      4: '#DA70D6',
      3: '#6495ED',
      2: '#32CD32',
      1: '#708090',
    },
  },
  typography: { button: { textTransform: 'none', fontWeight: 'bold' } },
});

export default theme;
