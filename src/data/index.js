import { toArray } from '@/utils';

const GI = 'genshin-impact';
const HSR = 'honkai-star-rail';
const WW = 'wuthering-waves';
const ZZZ = 'zenless-zone-zero';

export { default as VERSION } from './version.json';

import GI_CHAR from './genshin-impact/character.json';
import HSR_CHAR from './honkai-star-rail/character.json';
import WW_CHAR from './wuthering-waves/character.json';
import ZZZ_CHAR from './zenless-zone-zero/character.json';
export const CHARACTERS = { [GI]: GI_CHAR, [HSR]: HSR_CHAR, [WW]: WW_CHAR, [ZZZ]: ZZZ_CHAR };

import WW_MV from './wuthering-waves/mv.json';

const normalizeActions = (gameId, json) => {
  const resolved = {};

  for (const [charId, charRaw] of Object.entries(json)) {
    const charDef = {};
    const charElement = CHARACTERS[gameId][charId].element;

    for (const [skillId, skillRaw] of Object.entries(charRaw)) {
      const skillDef = {};

      for (const [actionId, actionRaw] of Object.entries(skillRaw)) {
        const actionDef = {};

        actionDef.key = `${charId}-${skillId}-${actionId}`;
        actionDef.owner = charId;
        actionDef.skill = skillId;

        actionDef.name = actionRaw.name;
        actionDef.type = actionRaw.type ?? 'damage';

        actionDef.cast = toArray(actionRaw.cast);
        actionDef.considered = toArray(actionRaw.considered);

        if (actionDef.type === 'damage') {
          const actionElement = actionRaw.element ?? charElement;

          actionDef.element = actionElement;
          actionDef.considered.push(actionElement);
        }

        if (actionRaw.duration != null) {
          actionDef.duration = actionRaw.duration;
        } else if (!actionDef.cast.length) {
          actionDef.duration = 0;
        } else if (['OS', 'CA'].some(type => actionDef.cast.includes(type))) {
          actionDef.duration = 0;
        } else {
          actionDef.duration = 600;
        }

        if (actionRaw.offset != null) {
          actionDef.offset = actionRaw.offset;
        } else {
          actionDef.offset = actionDef.duration / 2;
        }

        if (actionRaw.multipliers) {
          actionDef.attr = actionRaw.attr ?? 'ATK';
          actionDef.multipliers = actionRaw.multipliers;
        }

        if (actionRaw.prefix) {
          actionDef.prefix = actionRaw.prefix;
        }

        skillDef[actionId] = actionDef;
      }

      charDef[skillId] = skillDef;
    }

    resolved[charId] = charDef;
  }

  return resolved;
};

export const MVS = {
  [GI]: {},
  [HSR]: {},
  [WW]: normalizeActions(WW, WW_MV),
  [ZZZ]: {},
};

import GI_WEAP from './genshin-impact/weapon.json';
import HSR_WEAP from './honkai-star-rail/weapon.json';
import WW_WEAP from './wuthering-waves/weapon.json';
import ZZZ_WEAP from './zenless-zone-zero/weapon.json';
export const WEAPONS = { [GI]: GI_WEAP, [HSR]: HSR_WEAP, [WW]: WW_WEAP, [ZZZ]: ZZZ_WEAP };

import GI_SET from './genshin-impact/set.json';
import HSR_SET from './honkai-star-rail/set.json';
import WW_SET from './wuthering-waves/set.json';
import ZZZ_SET from './zenless-zone-zero/set.json';
export const SETS = { [GI]: GI_SET, [HSR]: HSR_SET, [WW]: WW_SET, [ZZZ]: ZZZ_SET };

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
