import { GI, HSR, WW, ZZZ, CHARACTER } from '@/data';
import { getAttr } from '@/utils';

const ENERGY_STAT = {
  [GI]: 'energyRecharge%',
  [HSR]: 'energyRegenerationRate%',
  [WW]: 'energyRegen%',
  [ZZZ]: 'energyRegen%',
};

const matchPenalty = (current, target) => {
  if (!target) return 1;

  const relativeDeficit = (target - current) / target;
  if (relativeDeficit <= 0) return 1;

  return Math.exp(-1 * relativeDeficit);
};

const getPenalty = (statMap, matchMap) => {
  let penalty = 1;

  for (const attr in matchMap) {
    const current = getAttr(attr, statMap);
    const target = matchMap[attr];

    penalty *= matchPenalty(current, target)
  }

  return penalty;
};

export const compilePenalty = (cache, currId) => {
  const { matchList = [], tagged = [] } = CHARACTER[cache.gameId][currId];
  const { statMap } = cache.member[currId];
  const matchMap = {};

  for (const attr of matchList) {
    matchMap[attr] = getAttr(attr, statMap);
  }

  if (!tagged.includes('noEnergy')) {
    const energyStat = ENERGY_STAT[cache.gameId];
    matchMap[energyStat] = getAttr(energyStat, statMap);
  }

  return (statMap) => getPenalty(statMap, matchMap);
};
