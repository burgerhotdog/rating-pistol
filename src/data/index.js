export { default as VERSION } from './version.json';

import character_gi from './genshin-impact/character.json';
import character_hsr from './honkai-star-rail/character.json';
import character_ww from './wuthering-waves/character.json';
import character_zzz from './zenless-zone-zero/character.json';
export const CHARACTERS = {
  'genshin-impact': character_gi,
  'honkai-star-rail': character_hsr,
  'wuthering-waves': character_ww,
  'zenless-zone-zero': character_zzz,
};

import mv_ww from './wuthering-waves/mv.json';
export const MVS = {
  'wuthering-waves': mv_ww,
};

import weapon_gi from './genshin-impact/weapon.json';
import weapon_hsr from './honkai-star-rail/weapon.json';
import weapon_ww from './wuthering-waves/weapon.json';
import weapon_zzz from './zenless-zone-zero/weapon.json';
export const WEAPONS = {
  'genshin-impact': weapon_gi,
  'honkai-star-rail': weapon_hsr,
  'wuthering-waves': weapon_ww,
  'zenless-zone-zero': weapon_zzz,
};

import set_gi from './genshin-impact/set.json';
import set_hsr from './honkai-star-rail/set.json';
import set_ww from './wuthering-waves/set.json';
import set_zzz from './zenless-zone-zero/set.json';
export const SETS = {
  'genshin-impact': set_gi,
  'honkai-star-rail': set_hsr,
  'wuthering-waves': set_ww,
  'zenless-zone-zero': set_zzz,
};

import stat_gi from './genshin-impact/stat.json';
import stat_hsr from './honkai-star-rail/stat.json';
import stat_ww from './wuthering-waves/stat.json';
import stat_zzz from './zenless-zone-zero/stat.json';
export const STAT = {
  'genshin-impact': stat_gi,
  'honkai-star-rail': stat_hsr,
  'wuthering-waves': stat_ww,
  'zenless-zone-zero': stat_zzz,
};

import * as rating_gi from './genshin-impact/rating';
import * as rating_hsr from './honkai-star-rail/rating';
import * as rating_ww from './wuthering-waves/rating';
import * as rating_zzz from './zenless-zone-zero/rating';
export const RATING = {
  'genshin-impact': rating_gi,
  'honkai-star-rail': rating_hsr,
  'wuthering-waves': rating_ww,
  'zenless-zone-zero': rating_zzz,
};

import GI_MISC from './genshin-impact/misc.json';
import HSR_MISC from './honkai-star-rail/misc.json';
import WW_MISC from './wuthering-waves/misc.json';
import ZZZ_MISC from './zenless-zone-zero/misc.json';
export const MISC = {
  'genshin-impact': GI_MISC,
  'honkai-star-rail': HSR_MISC,
  'wuthering-waves': WW_MISC,
  'zenless-zone-zero': ZZZ_MISC,
};
