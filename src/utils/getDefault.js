import { GI, HSR, WW, ZZZ, CHARACTER, WEAPON } from '@/data';

const freeChars = {
  [GI]: new Set(),
  [HSR]: new Set(),
  [WW]: new Set([
    '1501', '1502',
    '1604', '1605',
    '1406', '1408',
    '1309', '1310',
  ]),
  [ZZZ]: new Set(),
};

const freeWeaps = {
  [GI]: new Set(),
  [HSR]: new Set(),
  [WW]: new Set(),
  [ZZZ]: new Set(),
};

export function getDefaultCharRank(gameId, charId) {
  if (freeChars[gameId].has(charId)) return 6;
  return CHARACTER[gameId][charId].quality === 5 ? 0 : 6;
}

export function getDefaultWeapRank(gameId, weapId) {
  if (freeWeaps[gameId].has(weapId)) return 5;
  return WEAPON[gameId][weapId].quality === 5 ? 1 : 5;
}
