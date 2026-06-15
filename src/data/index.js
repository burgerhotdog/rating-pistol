import { normalizeCharacters, normalizeActions, normalizeWeapons, normalizeSets } from './normalize';

const GI = 'genshin-impact';
const HSR = 'honkai-star-rail';
const WW = 'wuthering-waves';
const ZZZ = 'zenless-zone-zero';

export { default as VERSION } from './version.json';

import GI_STAT from './genshin-impact/stat.json';
import HSR_STAT from './honkai-star-rail/stat.json';
import WW_STAT from './wuthering-waves/stat.json';
import ZZZ_STAT from './zenless-zone-zero/stat.json';
export const STAT = { [GI]: GI_STAT, [HSR]: HSR_STAT, [WW]: WW_STAT, [ZZZ]: ZZZ_STAT };

import GI_MISC from './genshin-impact/misc.json';
import HSR_MISC from './honkai-star-rail/misc.json';
import WW_MISC from './wuthering-waves/misc.json';
import ZZZ_MISC from './zenless-zone-zero/misc.json';
export const MISC = { [GI]: GI_MISC, [HSR]: HSR_MISC, [WW]: WW_MISC, [ZZZ]: ZZZ_MISC };

import GI_CHAR from './genshin-impact/characters.json';
import HSR_CHAR from './honkai-star-rail/characters.json';
import WW_CHAR from './wuthering-waves/characters.json';
import ZZZ_CHAR from './zenless-zone-zero/characters.json';

const convert = (json) => {
  const resolved = {};

  for (const entry of json) {
    const { id } = entry;
    resolved[id] = entry;
  }

  return resolved;
};

export const CHARACTER = {
  [GI]: normalizeCharacters(GI_CHAR),
  [HSR]: normalizeCharacters(HSR_CHAR),
  [WW]: normalizeCharacters(WW_CHAR),
  [ZZZ]: normalizeCharacters(ZZZ_CHAR),
};

import WW_ACTIONS from './wuthering-waves/actions.json';

export const ACTION = {
  [GI]: {},
  [HSR]: {},
  [WW]: normalizeActions(WW_ACTIONS, CHARACTER[WW]),
  [ZZZ]: {},
};

import GI_WEAP from './genshin-impact/weapons.json';
import HSR_WEAP from './honkai-star-rail/weapons.json';
import WW_WEAP from './wuthering-waves/weapons.json';
import ZZZ_WEAP from './zenless-zone-zero/weapons.json';
export const WEAPON = {
  [GI]: convert(GI_WEAP),
  [HSR]: convert(HSR_WEAP),
  [WW]: normalizeWeapons(WW_WEAP),
  [ZZZ]: convert(ZZZ_WEAP),
};

import GI_SET from './genshin-impact/sets.json';
import HSR_SET from './honkai-star-rail/sets.json';
import WW_SET from './wuthering-waves/sets.json';
import ZZZ_SET from './zenless-zone-zero/sets.json';
export const SET = {
  [GI]: convert(GI_SET),
  [HSR]: convert(HSR_SET),
  [WW]: normalizeSets(WW_SET),
  [ZZZ]: convert(ZZZ_SET),
};
