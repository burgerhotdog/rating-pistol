export { default as VERSION } from "./version.json";

import character_gi from './genshin-impact/character.json';
import character_hsr from './honkai-star-rail/character.json';
import character_ww from './wuthering-waves/character.json';
import character_zzz from './zenless-zone-zero/character.json';
export const CHARACTERS = {
  "genshin-impact": character_gi,
  "honkai-star-rail": character_hsr,
  "wuthering-waves": character_ww,
  "zenless-zone-zero": character_zzz,
};

import weapon_gi from './genshin-impact/weapon.json';
import weapon_hsr from './honkai-star-rail/weapon.json';
import weapon_ww from './wuthering-waves/weapon.json';
import weapon_zzz from './zenless-zone-zero/weapon.json';
export const WEAPONS = {
  "genshin-impact": weapon_gi,
  "honkai-star-rail": weapon_hsr,
  "wuthering-waves": weapon_ww,
  "zenless-zone-zero": weapon_zzz,
};

import set_gi from './genshin-impact/set.json';
import set_hsr from './honkai-star-rail/set.json';
import set_ww from './wuthering-waves/set.json';
import set_zzz from './zenless-zone-zero/set.json';
export const SETS = {
  "genshin-impact": set_gi,
  "honkai-star-rail": set_hsr,
  "wuthering-waves": set_ww,
  "zenless-zone-zero": set_zzz,
};

import GI_GENERAL from './genshin-impact/GENERAL.json';
import HSR_GENERAL from './honkai-star-rail/GENERAL.json';
import WW_GENERAL from './wuthering-waves/GENERAL.json';
import ZZZ_GENERAL from './zenless-zone-zero/GENERAL.json';
export const STATS = {
  "genshin-impact": GI_GENERAL,
  "honkai-star-rail": HSR_GENERAL,
  "wuthering-waves": WW_GENERAL,
  "zenless-zone-zero": ZZZ_GENERAL,
};
