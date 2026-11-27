import { CHARACTER } from '@/data';
import { toMergedObj, getTotals, getMvIndex, resolveBuffValue } from '@/utils';
import { runRotation } from '../rotation';
import { computeDuration } from '../duration';
import { getEffectDefs } from '../cache/effects';
import { getSkillLevelRotations, updateSkillLevelAction } from '../skillLevelActions';

function modifySkillLevel(testCache, skillId) {
  const { gameId, charId } = testCache;
  const mCache = testCache.member[charId];
  const charSkills = CHARACTER[gameId][charId].skills;

  const mvIndex = getMvIndex(gameId, charId, mCache.rank, skillId, mCache.skillLevels[skillId]);
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

  Object.assign(mCache, rotations);
  mCache.effects = effects;
}

function getTestCache(cache, charId, rank) {
  const testCache = structuredClone(cache);
  const mCache = testCache.member[charId];
  mCache.rank = rank;

  const {
    charEffectDefs,
    weapEffectDefs,
    setEffectDefs,
  } = getEffectDefs(testCache.gameId, mCache, { memberIds: testCache.memberIds, actionDefs: mCache.actions, counts: testCache.counts });

  mCache.charEffectDefs = charEffectDefs;
  mCache.weapEffectDefs = weapEffectDefs;
  mCache.setEffectDefs = setEffectDefs;

  const effectDefs = {
    ...charEffectDefs,
    ...weapEffectDefs,
    ...setEffectDefs,
  };

  mCache.staticMap = Object.values(effectDefs)
    .filter((effect) => effect.static)
    .reduce((acc, effect) => toMergedObj(acc, ...effect.buff.map(({ stats }) => stats)), {});

  mCache.staticEffects = Object.fromEntries(
    Object.entries(effectDefs)
      .filter(([, effect]) => effect.static)
  );

  mCache.effects = Object.fromEntries(
    Object.entries(effectDefs)
      .filter(([, effect]) => !effect.static)
  );

  for (const [skillId, { rankModify }] of Object.entries(CHARACTER[cache.gameId][charId].skills)) {
    if (rankModify != null) {
      modifySkillLevel(testCache, skillId);
    }
  }

  return testCache;
}

export function rankTests(cache, equipMaps, charId) {
  const rankResults = [];

  for (let i = 0; i <= 6; i++) {
    const testCache = getTestCache(cache, charId, i);
    const { snapshots, bonusEnergy } = runRotation(testCache, equipMaps);
    const time = computeDuration(testCache, equipMaps, bonusEnergy);
    const dps = getTotals(snapshots).damage / time * 1000;

    rankResults.push(dps);
  }

  return rankResults;
}
