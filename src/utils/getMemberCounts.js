import { CHARACTER, GI } from '@/data';

export function getMemberCounts(gameId, memberIds) {
  const counts = {
    element: {},
  };

  for (const memberId of memberIds) {
    const { element, tagged = [] } = CHARACTER[gameId][memberId];

    // Element
    counts.element[element] = (counts.element[element] ?? 0) + 1;

    if (gameId === GI) {
      // Hexerei
      if (tagged.includes('hexerei')) {
        counts.hexerei = (counts.hexerei ?? 0) + 1;
      }
    }
  }

  return counts;
}
