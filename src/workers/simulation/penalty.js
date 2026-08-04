import { GI, HSR, WW, ZZZ, CHARACTER } from '@/data';
import { toArray, getAttr, getTotals, toMergedObj } from '@/utils';

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

export const createEquipListEvaluator = (cache, evalId, runRotation) => {
  const { gameId, member } = cache;
  const { noEnergy, matchAttr } = CHARACTER[gameId][evalId];
  const { statMap } = member[evalId];
  const matchMap = {};

  for (const attr of toArray(matchAttr)) {
    matchMap[attr] = getAttr(attr, statMap);
  }

  if (!noEnergy) {
    const energyAttr = ENERGY_ATTR[gameId];
    matchMap[energyAttr] = getAttr(energyAttr, statMap);
  }

  const baseMap = cache.member[evalId].baseMap;

  return (equipMap = {}) => {
    const statMap = toMergedObj(baseMap, equipMap);
    const penalty = Object.entries(matchMap)
      .reduce((acc, [attr, target]) => {
        const attrValue = getAttr(attr, statMap);
        return acc * penaltyMult(attrValue, target);
      }, 1);

    const summary = runRotation(statMap);
    const totals = getTotals(summary);
    const baseScore = Object.values(totals)
      .reduce((acc, value) => acc + value, 0);
    const score = baseScore * penalty;

    return { summary, totals, score };
  }
};
