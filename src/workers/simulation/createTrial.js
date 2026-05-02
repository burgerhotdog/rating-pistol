import { computeTotalStat, compileStatMap } from '@/utils';
import { matchPenalty, simulateRotation } from './helpers';

export function createTrial(matchTargets, gameId, characterId, build, match, team) {
  const startingBuild = {
    weaponId: build.weaponId,
    equipList: build.equipList.map(() => null),
  };

  return {
    build: startingBuild,
    penalty: match.reduce((acc, stat, index) => {
      const currentValue = computeTotalStat(stat, compileStatMap(gameId, characterId, startingBuild, team, 'menu'));
      const targetValue = matchTargets[index];
      return acc * matchPenalty(currentValue, targetValue);
    }, 1),
    scores: [simulateRotation(gameId, team.map(member => member.memberId === characterId ? { ...member, build: startingBuild } : { ...member }))],
  };
}
