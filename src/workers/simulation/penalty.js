import { GI, HSR, WW, ZZZ, CHARACTER } from '@/data';
import { toArray, getAttr } from '@/utils';

const ENERGY_ATTR = {
  [GI]: 'energyRecharge%',
  [HSR]: 'energyRegenerationRate%',
  [WW]: 'energyRegen%',
  [ZZZ]: 'energyRegen%',
};

const penaltyMult = (current, target) => {
  if (!target) return 1;

  const relativeDeficit = (target - current) / target;
  if (relativeDeficit <= 0) return 1;

  return Math.exp(-relativeDeficit);
};

export const createGetPenalty = (cache, currId) => {
  const { gameId, member } = cache;
  const { tagged, matchAttr } = CHARACTER[gameId][currId];
  const { statMap } = member[currId];
  const matchMap = {};

  for (const attr of toArray(matchAttr)) {
    matchMap[attr] = getAttr(attr, statMap);
  }

  if (!toArray(tagged).includes('noEnergy')) {
    const energyAttr = ENERGY_ATTR[gameId];
    matchMap[energyAttr] = getAttr(energyAttr, statMap);
  }

  return (statMap) => (
    Object.entries(matchMap).reduce((acc, [attr, target]) => (
      acc * penaltyMult(getAttr(attr, statMap), target)
    ), 1)
  );
};
