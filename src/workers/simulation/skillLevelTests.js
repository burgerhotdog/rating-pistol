import { CHARACTER, MISC } from '@/data';
import { runVariantDps } from './variantDps';
import { createMvIndexGetter, getCompressed } from './cache/actions';

const parts = ['damage', 'healing', 'shield'];

export function skillLevelTests(cache, equipMaps, charId) {
  const { skillIds, maxSkillLevel } = MISC[cache.gameId];
  const mCache = cache.member[charId];

  const getMvIndex = createMvIndexGetter(cache.gameId, mCache);

  const skillLevelResults = [];

  for (const skillId of skillIds) {
    if (mCache.skillLevels[skillId] === maxSkillLevel) {
      skillLevelResults.push({ skillId, isMax: true });
      continue;
    }

    const mvIndex = getMvIndex(skillId) + 1;

    const testCache = structuredClone(cache);
    const tmCache = testCache.member[charId];

    for (const action of tmCache.rotation) {
      if (action.category !== skillId) continue;

      for (const part of parts) {
        const actionPart = action[part];
        if (!actionPart) continue;

        const rawPartDef = CHARACTER[cache.gameId][charId].skills[skillId].actions[action.index]?.[part];
        if (!rawPartDef) continue;
        actionPart.compressed = getCompressed(rawPartDef.multipliers, rawPartDef.attr ?? 'atk', { index: mvIndex });
      }
    }

    // effects
    for (const effect of Object.values(testCache.effects)) {
      if (effect.sourceId !== charId) continue;
      if (!effect.use?.action?.length) continue;

      for (const action of effect.use.action) {
        if (action.category !== skillId) continue;
        for (const part of parts) {
          const actionPart = action[part];
          if (!actionPart) continue;

          const rawPartDef = CHARACTER[cache.gameId][charId].skills[skillId].actions[action.index]?.[part];
          if (!rawPartDef) continue;
          actionPart.compressed = getCompressed(rawPartDef.multipliers, rawPartDef.attr ?? 'atk', { index: mvIndex });
        }
      }
    }

    const dps = runVariantDps(cache, equipMaps, charId, { effects: testCache.effects, memberOverride: tmCache });
    skillLevelResults.push({ skillId, dps });
  }

  return skillLevelResults;
}
