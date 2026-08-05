import { useParams } from 'react-router-dom';
import { GI, HSR, WW, ZZZ, CHARACTER } from '@/data';

const ELEMENT_COLORS_BY_GAME = {
  [GI]: {
    anemo: '#80FFD7',
    cryo: '#99FFFF',
    dendro: '#99FF88',
    electro: '#FFACFF',
    geo: '#FFE699',
    hydro: '#80C0FF',
    pyro: '#FF9999',
  },
  [HSR]: {
    fire: '#EE473D',
    ice: '#2692D3',
    imaginary: '#E6D863',
    lightning: '#C65ADE',
    physical: '#979797',
    quantum: '#7E74EB',
    wind: '#61CF93',
  },
  [WW]: {
    glacio: '#41AEFB',
    fusion: '#F0744E',
    electro: '#B45BFF',
    aero: '#53F9B1',
    spectro: '#F8E56C',
    havoc: '#E649A6',
  },
  [ZZZ]: {
    electric: '#2EB6FF',
    ether: '#FE437E',
    fire: '#FF5521',
    ice: '#98EFF0',
    physical: '#F0D12B',
    wind: '#A6C5FD',
  },
}

export function useElementColors(options) {
  const { gameId, charId } = useParams();
  const elementColors = ELEMENT_COLORS_BY_GAME[gameId];

  if (!options) return elementColors;

  if ('element' in options) return elementColors[options.element] ?? '#ffffff';
  
  const lookupChar = options.char === '$curr' ? charId : options.char;
  const charElement = CHARACTER[gameId][lookupChar]?.element;
  return elementColors[charElement] ?? '#ffffff';
}
