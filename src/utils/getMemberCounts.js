import { CHARACTER, GI } from '@/data';

export function getMemberCounts(gameId, memberIds) {
  const counts = {
    element: {},
    ...(gameId === GI && {
      nightsoul: 0,
      moonsign: 0,
      hexerei: 0,
    }),
  };

  for (const memberId of memberIds) {
    const { element, nightsoul, moonsign, hexerei } = CHARACTER[gameId][memberId];

    counts.element[element] = (counts.element[element] ?? 0) + 1;

    if (gameId === GI) {
      if (nightsoul) counts.nightsoul++;
      if (moonsign) counts.moonsign++;
      if (hexerei) counts.hexerei++;
    }
  }

  counts.uniqueElements = Object.keys(counts.element).length;

  return counts;
}
