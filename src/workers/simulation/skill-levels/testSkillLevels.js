import { CHARACTER, MISC } from '@/data';
import {
  computeActualRotationTime,
  getCompressed,
  getTotals,
} from '@/utils';
import { runRotation } from '../rotation';
import { createMvIndexGetter } from '../cache/actions';

const parts = ['damage', 'healing', 'shield'];

export function testSkillLevels(cache, equipMaps, charId) {
  const gameId = cache.gameId;
  const mCache = cache.member[charId];
  const charSkills = CHARACTER[gameId][charId].skills;
  const { maxSkillLevel } = MISC[gameId];

  const getMvIndex = createMvIndexGetter(gameId, mCache);

  const results = {};

  for (const skillId of MISC[gameId].skillIds) {
    const userLevel = mCache.skillLevels[skillId];

    results[skillId] = {
      skillId,
      dpsArr: [],
      userLevel,
    };

    const getMvIndexForLevel = getMvIndex(skillId) - userLevel;

    for (let testSkillLevel = 1; testSkillLevel <= maxSkillLevel; testSkillLevel++) {
      const mvIndex = getMvIndexForLevel + testSkillLevel;

      const memberOverrides = {
        rotation: structuredClone(mCache.rotation),
        effects: structuredClone(mCache.effects),
      };

      // rotation
      for (const action of memberOverrides.rotation) {
        if (action.category !== skillId) continue;

        for (const part of parts) {
          const actionPart = action[part];
          if (!actionPart) continue;

          const rawPartDef = charSkills[skillId].actions[action.index]?.[part];
          if (!rawPartDef) continue;

          actionPart.compressed = getCompressed(
            rawPartDef.multipliers,
            rawPartDef.attr ?? 'atk',
            { index: mvIndex },
          );
        }
      }

      // effects
      for (const effect of Object.values(memberOverrides.effects)) {
        if (!effect.use?.action?.length) continue;

        for (const action of effect.use.action) {
          if (action.category !== skillId) continue;

          for (const part of parts) {
            const actionPart = action[part];
            if (!actionPart) continue;

            const rawPartDef = charSkills[skillId].actions[action.index]?.[part];
            if (!rawPartDef) continue;

            actionPart.compressed = getCompressed(
              rawPartDef.multipliers,
              rawPartDef.attr ?? 'atk',
              { index: mvIndex },
            );
          }
        }
      }

      const testCache = {
        ...cache,
        member: {
          ...cache.member,
          [charId]: {
            ...cache.member[charId],
            ...memberOverrides,
          },
        },
      };

      const snapshots = runRotation(testCache, equipMaps);
      const actualRotationTime = computeActualRotationTime(testCache, equipMaps);
      const dps = getTotals(snapshots).damage / actualRotationTime * 1000;

      results[skillId].dpsArr.push(dps);
    }
  }

  return results;
}
