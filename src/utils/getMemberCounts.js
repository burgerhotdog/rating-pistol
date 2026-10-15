import { CHARACTER, GI } from '@/data';

export function getMemberCounts(gameId, memberIds) {
  const counts = {
    element: {},
    ...(gameId === GI && {
      liyue: 0,
      arkhe: 0,
      nightsoul: 0,
      moonsign: 0,
      hexerei: 0,
    }),
  };

  for (const memberId of memberIds) {
    const charData = CHARACTER[gameId][memberId];
    const charElem = charData.element;

    counts.element[charElem] = (counts.element[charElem] ?? 0) + 1;

    if (gameId === GI) {
      if (charData.liyue) counts.liyue++;
      if (charData.arkhe) counts.arkhe++;
      if (charData.nightsoul) counts.nightsoul++;
      if (charData.moonsign) counts.moonsign++;
      if (charData.hexerei) counts.hexerei++;
    }
  }

  counts.uniqueElements = Object.keys(counts.element).length;

  return counts;
}
