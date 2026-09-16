import { WW, CHARACTER } from '@/data';

export function countMembersWW(memberIds) {
  const counts = {
    fusion: 0,
  };

  for (const memberId of memberIds) {
    const { element } = CHARACTER[WW][memberId];

    // Fusion
    if (element === 'fusion') counts.fusion++;
  }

  return counts;
}
