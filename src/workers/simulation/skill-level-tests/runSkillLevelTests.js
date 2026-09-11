import { CHARACTER, MISC } from '@/data';
import { computeActualRotationTime, getCompressed, getTotals } from '@/utils';
import { runRotation } from '../rotation';
import { createMvIndexGetter } from '../cache/actions';

const parts = ['damage', 'healing', 'shield'];

export function runSkillLevelTests(cache, equipMaps, charId) {
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
        if (effect.use?.action?.length) {
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

        if (effect.buff?.statRefsRaw) {
          for (const [id, { baseAttrValue, multipliers }] of Object.entries(effect.buff.statRefsRaw)) {
            const { mv, flat } = multipliers[0];
            const mvBuffValue = mv?.[mvIndex] ?? 0;
            const flatBuffValue = flat?.[mvIndex] ?? 0;
            effect.buff.stats[id] = mvBuffValue * baseAttrValue + flatBuffValue;
          }
        }

        if (effect.buff?.specRefsRaw) {
          for (const [id, fieldMap] of Object.entries(effect.buff.specRefsRaw)) {
            for (const [field, { baseAttrValue, multipliers }] of Object.entries(fieldMap)) {
              const { mv, flat } = multipliers[0];
              const mvBuffValue = mv?.[mvIndex] ?? 0;
              const flatBuffValue = flat?.[mvIndex] ?? 0;
              effect.buff.specs[id][field] = mvBuffValue * baseAttrValue + flatBuffValue;
            }
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
