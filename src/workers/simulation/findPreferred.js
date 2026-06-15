import { sumRotationDmg, mergeObj } from '@/utils';
import { evaluateRotation } from './rotation/compile';

export function findPreferred(trial, characterId, compiledRotation, cache) {
  const { MAIN_STAT_TYPES } = cache.misc;

  return MAIN_STAT_TYPES.map((statOptions, costIndex) => {
    if (costIndex === 0 || costIndex === 2) return [];

    const preferred = [];
    for (const [id, data] of Object.entries(statOptions)) {
      const testDamage = evaluateRotation(compiledRotation, cache, mergeObj(cache.baseMap[characterId], { [id]: data.VALUE }));

      if (sumRotationDmg(testDamage) > sumRotationDmg(trial.scores[0])) {
        preferred.push(id);
      }
    }

    if (!preferred.length) return Object.keys(statOptions);
    return preferred;
  });
}
