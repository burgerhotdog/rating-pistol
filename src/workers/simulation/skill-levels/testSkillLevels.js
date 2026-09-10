import { CHARACTER, MISC } from '@/data';
import {
  computeActualRotationTime,
  computeStaminaToUpgradeSkill,
  getCompressed,
  getTotals,
} from '@/utils';
import { runRotation } from '../rotation';
import { createMvIndexGetter } from '../cache/actions';

const parts = ['damage', 'healing', 'shield'];

export function testSkillLevels(cache, equipMaps, charId, userDps) {
  const gameId = cache.gameId;
  const mCache = cache.member[charId];
  const charSkills = CHARACTER[gameId][charId].skills;

  const getMvIndex = createMvIndexGetter(gameId, mCache);

  const results = {};

  for (const skillId of MISC[gameId].skillIds) {
    const { maxSkillLevel } = MISC[gameId];
    const userSkillLevel = mCache.skillLevels[skillId];

    if (userSkillLevel === maxSkillLevel) {
      results[skillId] = { skillId, isMax: true };
      continue;
    }

    results[skillId] = {
      skillId,
      dpsArr: [],
      baseLevel: userSkillLevel,
    };

    let prevDps = userDps;
    let testPlusLevels = 1;
    while (userSkillLevel + testPlusLevels <= maxSkillLevel) {
      const mvIndex = getMvIndex(skillId) + testPlusLevels;

      const memberOverrides = {
        rotation: structuredClone(mCache.rotation),
        effects: structuredClone(mCache.effects),
      };

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

      const upgradeCosts = MISC[gameId].skillLevelUpgradeCosts[userSkillLevel + testPlusLevels - 2];
      const staminaToUpgrade = computeStaminaToUpgradeSkill(gameId, upgradeCosts);
      const diff = dps / prevDps - 1;
      const rate = diff / staminaToUpgrade;

      prevDps = dps;

      if (rate < 0.004) {
        break;
      }

      testPlusLevels++;
    }
  }

  return results;
}
