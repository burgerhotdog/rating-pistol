export const GI = 'genshin-impact';
export const HSR = 'honkai-star-rail';
export const WW = 'wuthering-waves';
export const ZZZ = 'zenless-zone-zero';

import CHARACTER_GI from './genshin-impact/character.json';
import CHARACTER_HSR from './honkai-star-rail/character.json';
import CHARACTER_WW from './wuthering-waves/character.json';
import CHARACTER_ZZZ from './zenless-zone-zero/character.json';
export const CHARACTER = {
  [GI]: CHARACTER_GI,
  [HSR]: CHARACTER_HSR,
  [WW]: CHARACTER_WW,
  [ZZZ]: CHARACTER_ZZZ,
};

import WEAPON_GI from './genshin-impact/weapon.json';
import WEAPON_HSR from './honkai-star-rail/weapon.json';
import WEAPON_WW from './wuthering-waves/weapon.json';
import WEAPON_ZZZ from './zenless-zone-zero/weapon.json';
export const WEAPON = {
  [GI]: WEAPON_GI,
  [HSR]: WEAPON_HSR,
  [WW]: WEAPON_WW,
  [ZZZ]: WEAPON_ZZZ,
};

import SET_GI from './genshin-impact/set.json';
import SET_HSR from './honkai-star-rail/set.json';
import SET_WW from './wuthering-waves/set.json';
import SET_ZZZ from './zenless-zone-zero/set.json';
export const SET = {
  [GI]: SET_GI,
  [HSR]: SET_HSR,
  [WW]: SET_WW,
  [ZZZ]: SET_ZZZ,
};

export { default as ECHO } from './wuthering-waves/echo.json';
export { default as VERSION } from './version.json';

import {
  MAINSTAT_GI,
  MAINSTAT_HSR,
  MAINSTAT_WW,
  MAINSTAT_ZZZ,
  SUBSTAT_GI,
  SUBSTAT_HSR,
  SUBSTAT_WW,
  SUBSTAT_ZZZ,
} from './stats';

export const MAINSTAT = {
  [GI]: MAINSTAT_GI,
  [HSR]: MAINSTAT_HSR,
  [WW]: MAINSTAT_WW,
  [ZZZ]: MAINSTAT_ZZZ,
};

export const SUBSTAT = {
  [GI]: SUBSTAT_GI,
  [HSR]: SUBSTAT_HSR,
  [WW]: SUBSTAT_WW,
  [ZZZ]: SUBSTAT_ZZZ,
};

export const ELEMENT = {
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
    glacio: {
      id: 'glacio',
      icon: 'wuthering-waves/element/glacio.webp',
      color: '#41AEFB',
    },
    fusion: {
      id: 'fusion',
      icon: 'wuthering-waves/element/fusion.webp',
      color: '#F0744E',
    },
    electro: {
      id: 'electro',
      icon: 'wuthering-waves/element/electro.webp',
      color: '#B45BFF',
    },
    aero: {
      id: 'aero',
      icon: 'wuthering-waves/element/aero.webp',
      color: '#53F9B1',
    },
    spectro: {
      id: 'spectro',
      icon: 'wuthering-waves/element/spectro.webp',
      color: '#F8E56C',
    },
    havoc: {
      id: 'havoc',
      icon: 'wuthering-waves/element/havoc.webp',
      color: '#E649A6',
    },
  },
  [ZZZ]: {
    electric: '#2EB6FF',
    ether: '#FE437E',
    fire: '#FF5521',
    ice: '#98EFF0',
    physical: '#F0D12B',
    wind: '#A6C5FD',
  },
};

export const TYPE = {
  [GI]: {
    sword: {
      icon: '',
    },
    claymore: {
      icon: '',
    },
    polearm: {
      icon: '',
    },
    catalyst: {
      icon: '',
    },
    bow: {
      icon: '',
    },
  },
  [HSR]: {
    hunt: {
      icon: '',
    },
    abundance: {
      icon: '',
    },
    destruction: {
      icon: '',
    },
    preservation: {
      icon: '',
    },
    nihility: {
      icon: '',
    },
    harmony: {
      icon: '',
    },
    erudition: {
      icon: '',
    },
    remembrance: {
      icon: '',
    },
    elation: {
      icon: '',
    },
  },
  [WW]: {
    broadblade: {
      id: 'broadblade',
      icon: 'wuthering-waves/type/broadblade.webp',
    },
    sword: {
      id: 'sword',
      icon: 'wuthering-waves/type/sword.webp',
    },
    pistols: {
      id: 'pistols',
      icon: 'wuthering-waves/type/pistols.webp',
    },
    gauntlets: {
      id: 'gauntlets',
      icon: 'wuthering-waves/type/gauntlets.webp',
    },
    rectifier: {
      id: 'rectifier',
      icon: 'wuthering-waves/type/rectifier.webp',
    },
  },
  [ZZZ]: {
    attack: {
      icon: '',
    },
    support: {
      icon: '',
    },
    stun: {
      icon: '',
    },
    anomaly: {
      icon: '',
    },
    defense: {
      icon: '',
    },
    rupture: {
      icon: '',
    },
    armorer: {
      icon: '',
    },
  },
};
