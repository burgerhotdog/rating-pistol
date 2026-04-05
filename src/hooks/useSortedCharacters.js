import { useMemo } from 'react';
import { useUser } from '@/contexts';
import { CHARACTERS } from '@/data';
import { useCurrent } from '@/hooks';

// Sort characters alphabetically with pinned on top
export function useSortedCharacters() {
  const { gameId, builds } = useCurrent();
  const pinned = useUser().pinnedIds[gameId];

  const buildKeys = Object.keys(builds);
  
  return useMemo(() => buildKeys.sort((a, b) => {
    if (a === pinned) return -1;
    if (b === pinned) return 1;

    const aName = CHARACTERS[gameId][a].name;
    const bName = CHARACTERS[gameId][b].name;
    return aName.localeCompare(bName);
  }), [gameId, buildKeys, pinned]);
}