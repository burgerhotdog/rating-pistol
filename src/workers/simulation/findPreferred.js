import { MISC } from '@/data';
import { mergeObj, sumRotationDmg } from '@/utils';
import { evaluateRotation } from './rotation';

export function findPreferred(cache, trial, currId, compiledRotation) {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];
  const { MAIN_STAT_TYPES } = MISC[gameId];

  return MAIN_STAT_TYPES.map((statOptions, costIndex) => {
    if (costIndex === 0 || costIndex === 2) return [];

    const preferred = [];
    for (const [id, data] of Object.entries(statOptions)) {
      const testDamage = evaluateRotation(compiledRotation, mergeObj(baseMap, { [id]: data.VALUE }));

      if (sumRotationDmg(testDamage) > sumRotationDmg(trial.scores[0])) {
        preferred.push(id);
      }
    }

    if (!preferred.length) return Object.keys(statOptions);
    return preferred;
  });
}
