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

export const ELEMENTS = {
  [GI]: [
    {
      key: 'anemo',
      icon: 'genshin-impact/element/anemo.webp',
      color: '#80FFD7',
    },
    {
      key: 'cryo',
      icon: 'genshin-impact/element/cryo.webp',
      color: '#99FFFF',
    },
    {
      key: 'dendro',
      icon: 'genshin-impact/element/dendro.webp',
      color: '#99FF88',
    },
    {
      key: 'electro',
      icon: 'genshin-impact/element/electro.webp',
      color: '#FFACFF',
    },
    {
      key: 'geo',
      icon: 'genshin-impact/element/geo.webp',
      color: '#FFE699',
    },
    {
      key: 'hydro',
      icon: 'genshin-impact/element/hydro.webp',
      color: '#80C0FF',
    },
    {
      key: 'pyro',
      icon: 'genshin-impact/element/pyro.webp',
      color: '#FF9999',
    },
  ],
  [HSR]: [
    {
      key: 'fire',
      icon: 'honkai-star-rail/element/fire.webp',
      color: '#EE473D',
    },
    {
      key: 'ice',
      icon: 'honkai-star-rail/element/ice.webp',
      color: '#2692D3',
    },
    {
      key: 'imaginary',
      icon: 'honkai-star-rail/element/imaginary.webp',
      color: '#E6D863',
    },
    {
      key: 'lightning',
      icon: 'honkai-star-rail/element/lightning.webp',
      color: '#C65ADE',
    },
    {
      key: 'physical',
      icon: 'honkai-star-rail/element/physical.webp',
      color: '#979797',
    },
    {
      key: 'quantum',
      icon: 'honkai-star-rail/element/quantum.webp',
      color: '#7E74EB',
    },
    {
      key: 'wind',
      icon: 'honkai-star-rail/element/wind.webp',
      color: '#61CF93',
    },
  ],
  [WW]: [
    {
      key: 'glacio',
      icon: 'wuthering-waves/element/glacio.webp',
      color: '#41AEFB',
    },
    {
      key: 'fusion',
      icon: 'wuthering-waves/element/fusion.webp',
      color: '#F0744E',
    },
    {
      key: 'electro',
      icon: 'wuthering-waves/element/electro.webp',
      color: '#B45BFF',
    },
    {
      key: 'aero',
      icon: 'wuthering-waves/element/aero.webp',
      color: '#53F9B1',
    },
    {
      key: 'spectro',
      icon: 'wuthering-waves/element/spectro.webp',
      color: '#F8E56C',
    },
    {
      key: 'havoc',
      icon: 'wuthering-waves/element/havoc.webp',
      color: '#E649A6',
    },
  ],
  [ZZZ]: [
    {
      key: 'electric',
      icon: 'zenless-zone-zero/element/electric.webp',
      color: '#2EB6FF',
    },
    {
      key: 'ether',
      icon: 'zenless-zone-zero/element/ether.webp',
      color: '#FE437E',
    },
    {
      key: 'fire',
      icon: 'zenless-zone-zero/element/fire.webp',
      color: '#FF5521',
    },
    {
      key: 'ice',
      icon: 'zenless-zone-zero/element/ice.webp',
      color: '#98EFF0',
    },
    {
      key: 'physical',
      icon: 'zenless-zone-zero/element/physical.webp',
      color: '#F0D12B',
    },
    {
      key: 'wind',
      icon: 'zenless-zone-zero/element/wind.webp',
      color: '#A6C5FD',
    },
    {
      key: 'lumiflux',
      icon: 'zenless-zone-zero/element/lumiflux.webp',
      color: '#ffa9dd',
    },
  ],
};

export const TYPES = {
  [GI]: [
    {
      id: 1,
      key: 'sword',
      icon: 'genshin-impact/type/sword.webp',
    },
    {
      id: 2,
      key: 'claymore',
      icon: 'genshin-impact/type/claymore.webp',
    },
    {
      id: 3,
      key: 'polearm',
      icon: 'genshin-impact/type/polearm.webp',
    },
    {
      id: 4,
      key: 'catalyst',
      icon: 'genshin-impact/type/catalyst.webp',
    },
    {
      id: 5,
      key: 'bow',
      icon: 'genshin-impact/type/bow.webp',
    },
  ],
  [HSR]: [
    {
      id: 1,
      key: 'hunt',
      icon: 'honkai-star-rail/type/hunt.webp',
    },
    {
      id: 2,
      key: 'abundance',
      icon: 'honkai-star-rail/type/abundance.webp',
    },
    {
      id: 3,
      key: 'destruction',
      icon: 'honkai-star-rail/type/destruction.webp',
    },
    {
      id: 4,
      key: 'preservation',
      icon: 'honkai-star-rail/type/preservation.webp',
    },
    {
      id: 5,
      key: 'nihility',
      icon: 'honkai-star-rail/type/nihility.webp',
    },
    {
      id: 6,
      key: 'harmony',
      icon: 'honkai-star-rail/type/harmony.webp',
    },
    {
      id: 7,
      key: 'erudition',
      icon: 'honkai-star-rail/type/erudition.webp',
    },
    {
      id: 8,
      key: 'remembrance',
      icon: 'honkai-star-rail/type/remembrance.webp',
    },
    {
      id: 9,
      key: 'elation',
      icon: 'honkai-star-rail/type/elation.webp',
    },
  ],
  [WW]: [
    {
      id: 1,
      key: 'broadblade',
      icon: 'wuthering-waves/type/broadblade.webp',
    },
    {
      id: 2,
      key: 'sword',
      icon: 'wuthering-waves/type/sword.webp',
    },
    {
      id: 3,
      key: 'pistols',
      icon: 'wuthering-waves/type/pistols.webp',
    },
    {
      id: 4,
      key: 'gauntlets',
      icon: 'wuthering-waves/type/gauntlets.webp',
    },
    {
      id: 5,
      key: 'rectifier',
      icon: 'wuthering-waves/type/rectifier.webp',
    },
  ],
  [ZZZ]: [
    {
      id: 1,
      key: 'attack',
      icon: 'zenless-zone-zero/type/attack.webp',
    },
    {
      id: 2,
      key: 'support',
      icon: 'zenless-zone-zero/type/support.webp',
    },
    {
      id: 3,
      key: 'stun',
      icon: 'zenless-zone-zero/type/stun.webp',
    },
    {
      id: 4,
      key: 'anomaly',
      icon: 'zenless-zone-zero/type/anomaly.webp',
    },
    {
      id: 5,
      key: 'defense',
      icon: 'zenless-zone-zero/type/defense.webp',
    },
    {
      id: 6,
      key: 'rupture',
      icon: 'zenless-zone-zero/type/rupture.webp',
    },
    {
      id: 7,
      key: 'armorer',
      icon: 'zenless-zone-zero/type/armorer.webp',
    },
  ],
};
