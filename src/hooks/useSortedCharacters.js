import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useBuild, useUser } from '@/contexts';
import { CHARACTERS } from '@/data';

// Sort characters alphabetically with pinned on top
export function useSortedCharacters() {
  const { gameId } = useParams();
  const { getBuilds } = useBuild();
  const pinned = useUser().pinnedIds[gameId];

  const builds = getBuilds(gameId) ?? {};
  const buildKeys = Object.keys(builds);
  
  return useMemo(() => buildKeys.sort((a, b) => {
    if (a === pinned) return -1;
    if (b === pinned) return 1;

    const aName = CHARACTERS[gameId][a].name;
    const bName = CHARACTERS[gameId][b].name;
    return aName.localeCompare(bName);
  }), [gameId, buildKeys, pinned]);
}