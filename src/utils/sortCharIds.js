import { CHARACTER_LOOKUP } from '@/lookups';

export function sortCharIds(gameId, pinnedId, charIdList) {
  return charIdList.sort((aId, bId) => {
    // Prioritize pinned character
    if (aId === pinnedId) return -1;
    if (bId === pinnedId) return 1;

    // Sort alphabetically by name
    const aName = CHARACTER_LOOKUP[gameId][aId]?.NAME || '';
    const bName = CHARACTER_LOOKUP[gameId][bId]?.NAME || '';
    return aName.localeCompare(bName);
  });
};
