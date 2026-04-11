import { computeDamage, computeTotalStat, compileStatMap } from "@/utils";
import { matchPenalty } from './helpers/matchPenalty';

export function createTrial(matchTargets, gameId, characterId, build, criteria, team) {
  const startingBuild = {
    weaponId: build.weaponId,
    equipList: build.equipList.map(() => null),
  };

  return {
    build: startingBuild,
    penalty: (criteria.match ?? []).reduce((acc, stat, index) => {
      const currentValue = computeTotalStat(stat, compileStatMap(gameId, characterId, startingBuild, team, "menu"));
      const targetValue = matchTargets[index];
      return acc * matchPenalty(currentValue, targetValue);
    }, 1),
    scores: [computeDamage(gameId, characterId, startingBuild, criteria, team)],
  };
}
