import { createTheme } from '@mui/material';
import { GI, HSR, WW, ZZZ } from '@/data';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  rarityColors: {
    5: '#FCD34D',
    4: '#C4B5FD',
    3: '#7DD3FC',
    2: '#6EE7B7',
    1: '#94A3B8',
  },
  accentColor: {
    [GI]: {
      anemo: '#80FFD7',
      cryo: '#99FFFF',
      dendro: '#99FF88',
      electro: '#FFACFF',
      geo: '#FFE699',
      hydro: '#80C0FF',
      pyro: '#FF9999'
    },
    [HSR]: {
      fire: '#EE473D',
      ice: '#2692D3',
      imaginary: '#E6D863',
      lightning: '#C65ADE',
      physical: '#979797',
      quantum: '#7E74EB',
      wind: '#61CF93'
    },
    [WW]: {
      glacio: '#41AEFB',
      fusion: '#F0744E',
      electro: '#B45BFF',
      aero: '#53F9B1',
      spectro: '#F8E56C',
      havoc: '#E649A6'
    },
    [ZZZ]: {
      electric: '#2EB6FF',
      ether: '#FE437E',
      fire: '#FF5521',
      ice: '#98EFF0',
      physical: '#F0D12B',
      wind: '#A6C5FD'
    },
  },
  typography: {
    subtitle1: {
      fontWeight: 'bold',
    },
    subtitle2: {
      fontWeight: 'bold',
    },
  },
  stack: {
    useFlexGap: true,
  },
});

export default theme;
