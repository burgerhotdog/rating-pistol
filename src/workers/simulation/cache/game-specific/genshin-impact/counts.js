import { GI, CHARACTER } from '@/data';

export function countMembersGI(memberIds) {
  const counts = {
    element: {},
    hexerei: 0,
  };

  for (const memberId of memberIds) {
    const { element, tagged = [] } = CHARACTER[GI][memberId];

    // Element
    counts.element[element] = (counts.element[element] ?? 0) + 1;

    // Hexerei
    if (tagged.includes('hexerei')) counts.hexerei++;
  }

  return counts;
}
