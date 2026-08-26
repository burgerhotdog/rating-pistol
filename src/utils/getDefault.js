import { GI, HSR, WW, ZZZ, CHARACTER, WEAPON } from '@/data';

const freeChars = {
  [GI]: new Set(),
  [HSR]: new Set([8001, 8003, 8005, 8007, 8009]),
  [WW]: new Set([1501, 1605, 1406, 1309]),
  [ZZZ]: new Set([1551]),
};

const freeWeaps = {
  [GI]: new Set([11521]),
  [HSR]: new Set([24000, 24001, 24002, 24003, 24004, 24005, 24006]),
  [WW]: new Set([21020046]),
  [ZZZ]: new Set([14155]),
};

export function getDefaultCharRank(gameId, charId) {
  if (freeChars[gameId].has(charId)) return 6;
  return CHARACTER[gameId][charId].quality === 5 ? 0 : 6;
}

export function getDefaultWeapRank(gameId, weapId) {
  if (freeWeaps[gameId].has(weapId)) return 5;
  return WEAPON[gameId][weapId].quality === 5 ? 1 : 5;
}
