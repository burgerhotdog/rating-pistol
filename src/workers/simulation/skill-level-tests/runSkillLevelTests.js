import { CHARACTER, MISC } from '@/data';
import { computeActualRotationTime, getCompressed, getTotals, getMvIndex } from '@/utils';
import { runRotation } from '../rotation';

const parts = ['damage', 'healing', 'shield'];

export function runSkillLevelTests(cache, equipMaps, charId) {
  const gameId = cache.gameId;
  const mCache = cache.member[charId];
  const charSkills = CHARACTER[gameId][charId].skills;
  const { skillIds, maxSkillLevel } = MISC[gameId];

  const results = {};

  for (const skillId of skillIds) {
    const userLevel = mCache.skillLevels[skillId];
    results[skillId] = { skillId, userLevel, dpsArr: [] };

    for (let testSkillLevel = 1; testSkillLevel <= maxSkillLevel; testSkillLevel++) {
      const mvIndex = getMvIndex(gameId, charId, mCache.rank, skillId, testSkillLevel);
      const rotation = structuredClone(mCache.rotation);
      const effects = structuredClone(mCache.effects);

      // rotation
      for (const action of rotation) {
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
      for (const effect of Object.values(effects)) {
        if (effect.use) {
          for (const use of effect.use) {
            if (!use.action) continue;
            for (const action of use.action) {
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
        }

        if (effect.buff?.statRefsRaw) {
          for (const [id, { mvIndex: refMvIndex, baseAttrValue, multipliers }] of Object.entries(effect.buff.statRefsRaw)) {
            // only re-index refs pointing at the skill currently under test; otherwise keep the ref's real level
            const refMvIndexToUse = effect.buff.statRefs[id].split('.')[0] === skillId ? mvIndex : refMvIndex;

            const { mv, flat } = multipliers[0];
            const mvBuffValue = mv?.[refMvIndexToUse] ?? 0;
            const flatBuffValue = flat?.[refMvIndexToUse] ?? 0;
            effect.buff.stats[id] = mvBuffValue * baseAttrValue + flatBuffValue;
          }
        }

        if (effect.buff?.specRefsRaw) {
          for (const [id, fieldMap] of Object.entries(effect.buff.specRefsRaw)) {
            for (const [field, { mvIndex: refMvIndex, baseAttrValue, multipliers }] of Object.entries(fieldMap)) {
              const refMvIndexToUse = effect.buff.specRefs[id][field].split('.')[0] === skillId ? mvIndex : refMvIndex;

              const { mv, flat } = multipliers[0];
              const mvBuffValue = mv?.[refMvIndexToUse] ?? 0;
              const flatBuffValue = flat?.[refMvIndexToUse] ?? 0;
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
            rotation,
            effects,
          },
        },
      };

      const snapshots = runRotation(testCache, equipMaps);
      const { time } = computeActualRotationTime(testCache, equipMaps);
      const totals = getTotals(snapshots);
      const dps = (totals.damage + totals.healing + totals.shield) / time * 1000;

      results[skillId].dpsArr.push(dps);
    }
  }

  return results;
}
