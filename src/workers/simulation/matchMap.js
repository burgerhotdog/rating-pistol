import { getAttr, mergeObj } from '@/utils';

export const createMatchMap = (currId, data, cache) => {
  const matchMap = {};
  const { tagged = [], matchList = [] } = data.character[currId];

  for (const attr of [
    ...(tagged.includes('noEnergy') ? [] : ['ER']),
    ...matchList,
  ]) {
    const statMap = mergeObj(cache.baseMap[currId], cache.member[currId].equipMap);
    const attrValue = getAttr(attr, statMap);

    matchMap[attr] = attrValue;
  }

  return matchMap;
};
