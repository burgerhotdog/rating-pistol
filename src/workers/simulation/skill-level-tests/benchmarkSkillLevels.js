import { CHARACTER, MISC } from '@/data';
import { getTotals, getMvIndex, resolveBuffValue } from '@/utils';
import { runRotation } from '../rotation';
import { computeDuration } from '../duration';
import { getSkillLevelRotations, updateSkillLevelAction } from '../skillLevelActions';

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
      const rotations = getSkillLevelRotations(mCache, charSkills, skillId, mvIndex);
      const effects = structuredClone(mCache.effects);

      // effects
      for (const effect of Object.values(effects)) {
        if (effect.apply) {
          for (const apply of effect.apply) {
            if (apply.durationRefRaw && apply.durationRef.split('.')[0] === skillId) {
              apply.duration = resolveBuffValue(apply.durationRefRaw.multipliers[0], 0, mvIndex);
            }
          }
        }

        if (effect.use) {
          for (const use of effect.use) {
            if (use.cooldownRefRaw && use.cooldownRef.split('.')[0] === skillId) {
              use.cooldown = resolveBuffValue(use.cooldownRefRaw.multipliers[0], 0, mvIndex);
            }

            for (const action of (use.action ?? [])) {
              updateSkillLevelAction(action, charSkills, skillId, mvIndex);
            }
          }
        }

        for (const buff of (effect.buff ?? [])) {
          if (buff.statRefsRaw) {
            for (const [id, { multipliers, baseAttrValue }] of Object.entries(buff.statRefsRaw)) {
              if (buff.statRefs[id].split('.')[0] !== skillId) continue;
              buff.stats[id] = resolveBuffValue(multipliers[0], baseAttrValue, mvIndex);
            }
          }

          if (buff.specRefsRaw) {
            for (const [id, fieldMap] of Object.entries(buff.specRefsRaw)) {
              for (const [field, { multipliers, baseAttrValue }] of Object.entries(fieldMap)) {
                if (buff.specRefs[id][field].split('.')[0] !== skillId) continue;
                buff.specs[id][field] = resolveBuffValue(multipliers[0], baseAttrValue, mvIndex);
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
            ...rotations,
            effects,
          },
        },
      };

      const { snapshots, bonusEnergy } = runRotation(testCache, equipMaps);
      const time = computeDuration(testCache, equipMaps, bonusEnergy);
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
