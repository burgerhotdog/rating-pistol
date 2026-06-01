import { computeTotalStat, compileStatMap } from '@/utils';
import { matchPenalty, evaluateRotationSummary } from './helpers';

export function createTrial(matchTargets, gameId, characterId, build, match, team, summary) {
  const startingBuild = {
    weaponId: build.weaponId,
    equipList: build.equipList.map(() => null),
  };

  return {
    build: startingBuild,
    penalty: match.reduce((acc, stat, index) => {
      const currentValue = computeTotalStat(stat, compileStatMap(gameId, characterId, startingBuild));
      const targetValue = matchTargets[index];
      return acc * matchPenalty(currentValue, targetValue);
    }, 1),
    scores: [evaluateRotationSummary(summary, compileStatMap(gameId, characterId, startingBuild))],
  };
}
