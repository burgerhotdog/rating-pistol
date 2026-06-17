import { CHARACTER } from '@/data';
import { getAttr } from '@/utils';

export const createMatchMap = (cache, currId) => {
  const { gameId, member } = cache;

  const { matchList = [], tagged = [] } = CHARACTER[gameId][currId];
  const { statMap } = member[currId];
  const matchMap = {};

  for (const attr of matchList) {
    matchMap[attr] = getAttr(attr, statMap);
  }

  if (!tagged.includes('noEnergy')) {
    matchMap.ER = getAttr('ER', statMap);
  }

  return matchMap;
};
