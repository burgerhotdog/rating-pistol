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
