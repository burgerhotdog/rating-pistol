import { CHARACTER, GI } from '@/data';

export function getMemberCounts(gameId, memberIds) {
  const counts = {
    element: {},
    ...(gameId === GI && { hexerei: 0 }),
  };

  for (const memberId of memberIds) {
    const charData = CHARACTER[gameId][memberId];
    const { element } = charData;

    counts.element[element] = (counts.element[element] ?? 0) + 1;

    if (gameId === GI) {
      if (charData.hexerei) {
        counts.hexerei++;
      }
    }
  }

  return counts;
}
