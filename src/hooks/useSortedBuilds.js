import { useMemo } from 'react';
import { useBuild, useUser } from '@/contexts';
import { CHARACTER } from '@/data';

export function useSortedBuilds(gameId) {
  const builds = useBuild().getBuilds(gameId);
  const pinned = useUser().pinnedIds[gameId];
  const charData = CHARACTER[gameId];

  const sortedKeys = useMemo(() => Object.keys(builds).sort((a, b) => {
    if (a === pinned) return -1;
    if (b === pinned) return 1;
    return charData[b].version - charData[a].version;
  }), [builds, pinned, charData]);

  return { builds, sortedKeys };
}
