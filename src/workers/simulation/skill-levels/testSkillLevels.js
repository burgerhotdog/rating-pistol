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

  const getMvIndex = createMvIndexGetter(gameId, mCache);

  const skillLevelResults = [];

  for (const skillId of MISC[gameId].skillIds) {
    if (mCache.skillLevels[skillId] === MISC[gameId].maxSkillLevel) {
      skillLevelResults.push({ skillId, isMax: true });
      continue;
    }

    const mvIndex = getMvIndex(skillId) + 1;

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

    const variantCache = {
      ...cache,
      member: {
        ...cache.member,
        [charId]: {
          ...cache.member[charId],
          ...memberOverrides,
        },
      },
    };

    const snapshots = runRotation(variantCache, equipMaps);
    const actualRotationTime = computeActualRotationTime(variantCache, equipMaps);
    const dps = getTotals(snapshots).damage / actualRotationTime * 1000;

    skillLevelResults.push({ skillId, dps, newLevel: mCache.skillLevels[skillId] + 1 });
  }

  return skillLevelResults;
}
