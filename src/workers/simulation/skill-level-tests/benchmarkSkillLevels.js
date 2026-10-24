import { CHARACTER, MISC } from '@/data';
import { getCompressed, getTotals, getMvIndex } from '@/utils';
import { runRotation } from '../rotation';
import { computeDuration } from '../duration';

const parts = ['damage', 'healing', 'shield'];

export function benchmarkSkillLevels(cache, equipMaps, charId, userDps) {
  const gameId = cache.gameId;
  const mCache = cache.member[charId];
  const charSkills = CHARACTER[gameId][charId].skills;
  const { skillIds, maxSkillLevel, skillLevelUpgradeCostsPrecomputed, staminaPerDay } = MISC[gameId];

  const benchmarkLevels = {};
  const benchmarkLevelsSource = {};

  for (const skillId of skillIds) {
    const userLevel = mCache.skillLevels[skillId];

    let benchmarkLevel = userLevel;
    let benchmarkDps = userDps;

    const currentSource = benchmarkLevelsSource[skillId] = { skillId, userLevel, benchmarkLevel, dpsArr: [userDps] };

    while (benchmarkLevel < maxSkillLevel) {
      const mvIndex = getMvIndex(gameId, charId, mCache.rank, skillId, benchmarkLevel + 1);
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
        if (effect.apply) {
          for (const apply of effect.apply) {
            if (apply.durationRefRaw) {
              const { mvIndex: refMvIndex, baseAttrValue, multipliers } = apply.durationRefRaw;
              const refMvIndexToUse = apply.durationRef.split('.')[0] === skillId ? mvIndex : refMvIndex;

              const { mv, flat } = multipliers[0];
              const mvBuffValue = mv?.[refMvIndexToUse] ?? 0;
              const flatBuffValue = flat?.[refMvIndexToUse] ?? 0;
              apply.duration = mvBuffValue * baseAttrValue + flatBuffValue;
            }
          }
        }

        if (effect.use) {
          for (const use of effect.use) {
            if (use.cooldownRefRaw) {
              const { mvIndex: refMvIndex, baseAttrValue, multipliers } = use.cooldownRefRaw;
              const refMvIndexToUse = use.cooldownRef.split('.')[0] === skillId ? mvIndex : refMvIndex;

              const { mv, flat } = multipliers[0];
              const mvBuffValue = mv?.[refMvIndexToUse] ?? 0;
              const flatBuffValue = flat?.[refMvIndexToUse] ?? 0;
              use.cooldown = mvBuffValue * baseAttrValue + flatBuffValue;
            }

            if (use.action) {
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
        }

        for (const buff of effect.buff ?? []) {
          if (buff.statRefsRaw) {
            for (const [id, { mvIndex: refMvIndex, baseAttrValue, multipliers }] of Object.entries(buff.statRefsRaw)) {
              // only re-index refs pointing at the skill currently under test; otherwise keep the ref's real level
              const refMvIndexToUse = buff.statRefs[id].split('.')[0] === skillId ? mvIndex : refMvIndex;

              const { mv, flat } = multipliers[0];
              const mvBuffValue = mv?.[refMvIndexToUse] ?? 0;
              const flatBuffValue = flat?.[refMvIndexToUse] ?? 0;
              buff.stats[id] = mvBuffValue * baseAttrValue + flatBuffValue;
            }
          }

          if (buff.specRefsRaw) {
            for (const [id, fieldMap] of Object.entries(buff.specRefsRaw)) {
              for (const [field, { mvIndex: refMvIndex, baseAttrValue, multipliers }] of Object.entries(fieldMap)) {
                const refMvIndexToUse = buff.specRefs[id][field].split('.')[0] === skillId ? mvIndex : refMvIndex;

                const { mv, flat } = multipliers[0];
                const mvBuffValue = mv?.[refMvIndexToUse] ?? 0;
                const flatBuffValue = flat?.[refMvIndexToUse] ?? 0;
                buff.specs[id][field] = mvBuffValue * baseAttrValue + flatBuffValue;
              }
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

      const { snapshots, bonusEnergy } = runRotation(testCache, equipMaps);
      const { time } = computeDuration(testCache, equipMaps, bonusEnergy);
      const totals = getTotals(snapshots);
      const dps = totals.damage / time * 1000;

      const improvement = dps / benchmarkDps - 1;
      const cost = skillLevelUpgradeCostsPrecomputed[benchmarkLevel - 1];
      const costInDays = cost / staminaPerDay;
      const improvementRate = improvement / costInDays;

      if (improvementRate < 0.01) break;

      benchmarkLevel++;
      benchmarkDps = dps;
      currentSource.dpsArr.push(dps);
    }

    benchmarkLevels[skillId] = benchmarkLevel;
    currentSource.benchmarkLevel = benchmarkLevel;
  }

  return { benchmarkLevels, benchmarkLevelsSource };
}
