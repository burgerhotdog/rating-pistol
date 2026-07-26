export const GI = 'genshin-impact';
export const HSR = 'honkai-star-rail';
export const WW = 'wuthering-waves';
export const ZZZ = 'zenless-zone-zero';

import GI_C from './genshin-impact/character.json';
import HSR_C from './honkai-star-rail/character.json';
import WW_C from './wuthering-waves/character.json';
import ZZZ_C from './zenless-zone-zero/character.json';
export const CHARACTER = { [GI]: GI_C, [HSR]: HSR_C, [WW]: WW_C, [ZZZ]: ZZZ_C };

import GI_A from './genshin-impact/actions.json';
import HSR_A from './honkai-star-rail/actions.json';
import WW_A from './wuthering-waves/actions.json';
import ZZZ_A from './zenless-zone-zero/actions.json';
export const ACTION = { [GI]: GI_A, [HSR]: HSR_A, [WW]: WW_A, [ZZZ]: ZZZ_A };

import GI_W from './genshin-impact/weapon.json';
import HSR_W from './honkai-star-rail/weapon.json';
import WW_W from './wuthering-waves/weapon.json';
import ZZZ_W from './zenless-zone-zero/weapon.json';
export const WEAPON = { [GI]: GI_W, [HSR]: HSR_W, [WW]: WW_W, [ZZZ]: ZZZ_W };

import GI_S from './genshin-impact/set.json';
import HSR_S from './honkai-star-rail/set.json';
import WW_S from './wuthering-waves/set.json';
import ZZZ_S from './zenless-zone-zero/set.json';
export const SET = { [GI]: GI_S, [HSR]: HSR_S, [WW]: WW_S, [ZZZ]: ZZZ_S };

export { default as ECHO } from './wuthering-waves/echo.json';

export { default as VERSION } from './version.json';
