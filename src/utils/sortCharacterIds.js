import { ALL_CHARACTER_LOOKUP } from '@/lookups';

export function sortCharacterIds(gameId, pinnedId, characterIdList) {
  return characterIdList.sort((aId, bId) => {
    // Prioritize pinned character
    if (aId === pinnedId) return -1;
    if (bId === pinnedId) return 1;

    // Sort alphabetically by name
    const aName = ALL_CHARACTER_LOOKUP[gameId][aId]?.NAME || '';
    const bName = ALL_CHARACTER_LOOKUP[gameId][bId]?.NAME || '';
    return aName.localeCompare(bName);
  });
};
