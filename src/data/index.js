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
    anemo: {
      key: 'anemo',
      icon: 'genshin-impact/element/anemo.webp',
      color: '#80FFD7',
    },
    cryo: {
      key: 'cryo',
      icon: 'genshin-impact/element/cryo.webp',
      color: '#99FFFF',
    },
    dendro: {
      key: 'dendro',
      icon: 'genshin-impact/element/dendro.webp',
      color: '#99FF88',
    },
    electro: {
      key: 'electro',
      icon: 'genshin-impact/element/electro.webp',
      color: '#FFACFF',
    },
    geo: {
      key: 'geo',
      icon: 'genshin-impact/element/geo.webp',
      color: '#FFE699',
    },
    hydro: {
      key: 'hydro',
      icon: 'genshin-impact/element/hydro.webp',
      color: '#80C0FF',
    },
    pyro: {
      key: 'pyro',
      icon: 'genshin-impact/element/pyro.webp',
      color: '#FF9999',
    },
  },
  [HSR]: {
    fire: {
      key: 'fire',
      icon: 'honkai-star-rail/element/fire.webp',
      color: '#EE473D',
    },
    ice: {
      key: 'ice',
      icon: 'honkai-star-rail/element/ice.webp',
      color: '#2692D3',
    },
    imaginary: {
      key: 'imaginary',
      icon: 'honkai-star-rail/element/imaginary.webp',
      color: '#E6D863',
    },
    lightning: {
      key: 'lightning',
      icon: 'honkai-star-rail/element/lightning.webp',
      color: '#C65ADE',
    },
    physical: {
      key: 'physical',
      icon: 'honkai-star-rail/element/physical.webp',
      color: '#979797',
    },
    quantum: {
      key: 'quantum',
      icon: 'honkai-star-rail/element/quantum.webp',
      color: '#7E74EB',
    },
    wind: {
      key: 'wind',
      icon: 'honkai-star-rail/element/wind.webp',
      color: '#61CF93',
    },
  },
  [WW]: {
    glacio: {
      key: 'glacio',
      icon: 'wuthering-waves/element/glacio.webp',
      color: '#41AEFB',
    },
    fusion: {
      key: 'fusion',
      icon: 'wuthering-waves/element/fusion.webp',
      color: '#F0744E',
    },
    electro: {
      key: 'electro',
      icon: 'wuthering-waves/element/electro.webp',
      color: '#B45BFF',
    },
    aero: {
      key: 'aero',
      icon: 'wuthering-waves/element/aero.webp',
      color: '#53F9B1',
    },
    spectro: {
      key: 'spectro',
      icon: 'wuthering-waves/element/spectro.webp',
      color: '#F8E56C',
    },
    havoc: {
      key: 'havoc',
      icon: 'wuthering-waves/element/havoc.webp',
      color: '#E649A6',
    },
  },
  [ZZZ]: {
    electric: {
      key: 'electric',
      icon: 'zenless-zone-zero/element/electric.webp',
      color: '#2EB6FF',
    },
    ether: {
      key: 'ether',
      icon: 'zenless-zone-zero/element/ether.webp',
      color: '#FE437E',
    },
    fire: {
      key: 'fire',
      icon: 'zenless-zone-zero/element/fire.webp',
      color: '#FF5521',
    },
    ice: {
      key: 'ice',
      icon: 'zenless-zone-zero/element/ice.webp',
      color: '#98EFF0',
    },
    physical: {
      key: 'physical',
      icon: 'zenless-zone-zero/element/physical.webp',
      color: '#F0D12B',
    },
    wind: {
      key: 'wind',
      icon: 'zenless-zone-zero/element/wind.webp',
      color: '#A6C5FD',
    },
    lumiflux: {
      key: 'lumiflux',
      icon: 'zenless-zone-zero/element/lumiflux.webp',
      color: '#ffa9dd',
    },
  },
};

export const TYPE = {
  [GI]: {
    sword: {
      id: 1,
      key: 'sword',
      icon: 'genshin-impact/type/sword.webp',
    },
    claymore: {
      id: 2,
      key: 'claymore',
      icon: 'genshin-impact/type/claymore.webp',
    },
    polearm: {
      id: 3,
      key: 'polearm',
      icon: 'genshin-impact/type/polearm.webp',
    },
    catalyst: {
      id: 4,
      key: 'catalyst',
      icon: 'genshin-impact/type/catalyst.webp',
    },
    bow: {
      id: 5,
      key: 'bow',
      icon: 'genshin-impact/type/bow.webp',
    },
  },
  [HSR]: {
    hunt: {
      id: 1,
      key: 'hunt',
      icon: 'honkai-star-rail/type/hunt.webp',
    },
    abundance: {
      id: 2,
      key: 'abundance',
      icon: 'honkai-star-rail/type/abundance.webp',
    },
    destruction: {
      id: 3,
      key: 'destruction',
      icon: 'honkai-star-rail/type/destruction.webp',
    },
    preservation: {
      id: 4,
      key: 'preservation',
      icon: 'honkai-star-rail/type/preservation.webp',
    },
    nihility: {
      id: 5,
      key: 'nihility',
      icon: 'honkai-star-rail/type/nihility.webp',
    },
    harmony: {
      id: 6,
      key: 'harmony',
      icon: 'honkai-star-rail/type/harmony.webp',
    },
    erudition: {
      id: 7,
      key: 'erudition',
      icon: 'honkai-star-rail/type/erudition.webp',
    },
    remembrance: {
      id: 8,
      key: 'remembrance',
      icon: 'honkai-star-rail/type/remembrance.webp',
    },
    elation: {
      id: 9,
      key: 'elation',
      icon: 'honkai-star-rail/type/elation.webp',
    },
  },
  [WW]: {
    broadblade: {
      id: 1,
      key: 'broadblade',
      icon: 'wuthering-waves/type/broadblade.webp',
    },
    sword: {
      id: 2,
      key: 'sword',
      icon: 'wuthering-waves/type/sword.webp',
    },
    pistols: {
      id: 3,
      key: 'pistols',
      icon: 'wuthering-waves/type/pistols.webp',
    },
    gauntlets: {
      id: 4,
      key: 'gauntlets',
      icon: 'wuthering-waves/type/gauntlets.webp',
    },
    rectifier: {
      id: 5,
      key: 'rectifier',
      icon: 'wuthering-waves/type/rectifier.webp',
    },
  },
  [ZZZ]: {
    attack: {
      id: 1,
      key: 'attack',
      icon: 'zenless-zone-zero/type/attack.webp',
    },
    support: {
      id: 2,
      key: 'support',
      icon: 'zenless-zone-zero/type/support.webp',
    },
    stun: {
      id: 3,
      key: 'stun',
      icon: 'zenless-zone-zero/type/stun.webp',
    },
    anomaly: {
      id: 4,
      key: 'anomaly',
      icon: 'zenless-zone-zero/type/anomaly.webp',
    },
    defense: {
      id: 5,
      key: 'defense',
      icon: 'zenless-zone-zero/type/defense.webp',
    },
    rupture: {
      id: 6,
      key: 'rupture',
      icon: 'zenless-zone-zero/type/rupture.webp',
    },
    armorer: {
      id: 7,
      key: 'armorer',
      icon: 'zenless-zone-zero/type/armorer.webp',
    },
  },
};
