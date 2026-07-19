export const GI = 'genshin-impact';
export const HSR = 'honkai-star-rail';
export const WW = 'wuthering-waves';
export const ZZZ = 'zenless-zone-zero';

export { default as VERSION } from './version.json';

import GI_CHAR from './genshin-impact/characters.json';
import HSR_CHAR from './honkai-star-rail/characters.json';
import WW_CHAR from './wuthering-waves/characters.json';
import ZZZ_CHAR from './zenless-zone-zero/characters.json';

export const CHARACTER = {
  [GI]: GI_CHAR,
  [HSR]: HSR_CHAR,
  [WW]: WW_CHAR,
  [ZZZ]: ZZZ_CHAR,
};

import GI_ACTIONS from './genshin-impact/actions.json';
import HSR_ACTIONS from './honkai-star-rail/actions.json';
import WW_ACTIONS from './wuthering-waves/actions.json';
import ZZZ_ACTIONS from './zenless-zone-zero/actions.json';

export const ACTION = {
  [GI]: GI_ACTIONS,
  [HSR]: HSR_ACTIONS,
  [WW]: WW_ACTIONS,
  [ZZZ]: ZZZ_ACTIONS,
};

import GI_WEAP from './genshin-impact/weapons.json';
import HSR_WEAP from './honkai-star-rail/weapons.json';
import WW_WEAP from './wuthering-waves/weapons.json';
import ZZZ_WEAP from './zenless-zone-zero/weapons.json';
export const WEAPON = {
  [GI]: GI_WEAP,
  [HSR]: HSR_WEAP,
  [WW]: WW_WEAP,
  [ZZZ]: ZZZ_WEAP,
};

import GI_SET from './genshin-impact/sets.json';
import HSR_SET from './honkai-star-rail/sets.json';
import WW_SET from './wuthering-waves/sets.json';
import ZZZ_SET from './zenless-zone-zero/sets.json';
export const SET = {
  [GI]: GI_SET,
  [HSR]: HSR_SET,
  [WW]: WW_SET,
  [ZZZ]: ZZZ_SET,
};
