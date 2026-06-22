import { WW, MISC } from '@/data';
import { mergeObj, sumRotationDmg } from '@/utils';

const wwLoop = () => {
  const { MAIN_STAT_TYPES } = MISC[WW];
  const result = {};

  for (const cost in MAIN_STAT_TYPES) {
    const pool = MAIN_STAT_TYPES[cost];
    const validTypes = new Set();

    result[cost] = validTypes;
  }

  return result;
};

export const findPreferred = (cache, trial, currId, simulateRotation) => {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];
  const { MAIN_STAT_TYPES } = MISC[gameId];

  return MAIN_STAT_TYPES.map((statOptions, costIndex) => {
    if (gameId === WW) {
      if (costIndex === 0 || costIndex === 2) return [];
    }

    const preferred = [];
    for (const [id, data] of Object.entries(statOptions)) {
      const testSummary = simulateRotation(mergeObj(baseMap, { [id]: data.VALUE }));

      if (sumRotationDmg(testSummary) > sumRotationDmg(trial.weeklySummary[0])) {
        preferred.push(id);
      }
    }

    if (!preferred.length) return Object.keys(statOptions);
    return preferred;
  });
};
