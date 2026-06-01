import { MISC } from '@/data';
import { compileStatMap, computeTotalStat, sumRotationDmg } from '@/utils';
import { matchPenalty, evaluateRotationSummary } from './helpers';

export function findPreferred(trial, gameId, characterId, match, team, matchTargets, summary) {
  const { MAIN_STAT_TYPES } = MISC[gameId];

  return MAIN_STAT_TYPES.map((statOptions, costIndex) => {
    if (costIndex === 0 || costIndex === 2) return [];

    const preferred = [];
    for (const [id, data] of Object.entries(statOptions)) {
      const testObj = { mainStatId: id, mainStatValue: data.VALUE, subStatList: [] };
      const testBuild = { ...trial.build, equipList: [testObj] };

      const testDamage = evaluateRotationSummary(summary, compileStatMap(gameId, characterId, testBuild));
      
      const testPenalty = match.reduce((acc, stat, index) => {
        const currentValue = computeTotalStat(stat, compileStatMap(gameId, characterId, testBuild));
        const targetValue = matchTargets[index];
        return acc * matchPenalty(currentValue, targetValue);
      }, 1)

      if (sumRotationDmg(testDamage) * testPenalty > sumRotationDmg(trial.scores[0]) * trial.penalty) {
        preferred.push(id);
      }
    }

    if (!preferred.length) return Object.keys(statOptions);
    return preferred;
  });
}
