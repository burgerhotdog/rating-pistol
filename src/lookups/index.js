export { default as VERSION } from "./version.json";

import GI_CHARACTERS from './genshin-impact/CHARACTERS.json';
import HSR_CHARACTERS from './honkai-star-rail/CHARACTERS.json';
import WW_CHARACTERS from './wuthering-waves/CHARACTERS.json';
import ZZZ_CHARACTERS from './zenless-zone-zero/CHARACTERS.json';
export const CHARACTERS = {
  "genshin-impact": GI_CHARACTERS,
  "honkai-star-rail": HSR_CHARACTERS,
  "wuthering-waves": WW_CHARACTERS,
  "zenless-zone-zero": ZZZ_CHARACTERS,
};

import GI_WEAPONS from './genshin-impact/WEAPONS.json';
import HSR_WEAPONS from './honkai-star-rail/WEAPONS.json';
import WW_WEAPONS from './wuthering-waves/WEAPONS.json';
import ZZZ_WEAPONS from './zenless-zone-zero/WEAPONS.json';
export const WEAPONS = {
  "genshin-impact": GI_WEAPONS,
  "honkai-star-rail": HSR_WEAPONS,
  "wuthering-waves": WW_WEAPONS,
  "zenless-zone-zero": ZZZ_WEAPONS,
};

import GI_SETS from './genshin-impact/SETS.json';
import HSR_SETS from './honkai-star-rail/SETS.json';
import WW_SETS from './wuthering-waves/SETS.json';
import ZZZ_SETS from './zenless-zone-zero/SETS.json';
export const SETS = {
  "genshin-impact": GI_SETS,
  "honkai-star-rail": HSR_SETS,
  "wuthering-waves": WW_SETS,
  "zenless-zone-zero": ZZZ_SETS,
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
