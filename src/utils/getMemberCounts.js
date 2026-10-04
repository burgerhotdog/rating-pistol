import { CHARACTER, GI } from '@/data';

export function getMemberCounts(gameId, memberIds) {
  const counts = {
    element: {},
    ...(gameId === GI && {
      moonsign: 0,
      hexerei: 0,
    }),
  };

  for (const memberId of memberIds) {
    const { element, moonsign, hexerei } = CHARACTER[gameId][memberId];

    counts.element[element] = (counts.element[element] ?? 0) + 1;

    if (gameId === GI) {
      if (moonsign) counts.moonsign++;
      if (hexerei) counts.hexerei++;
    }
  }

  return counts;
}
