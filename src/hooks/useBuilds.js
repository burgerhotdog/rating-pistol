import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useBuild, useUser } from '@/contexts';
import { useData } from './useData';

export function useBuilds() {
  const { gameId } = useParams();
  return useBuild().getBuilds(gameId);
}

export function useSortedBuilds() {
  const builds = useBuilds();
  const { gameId } = useParams();
  const pinnedId = useUser().pinnedIds[gameId];
  const characterDatas = useData('character');

  const sortedKeys = useMemo(
    () => Object.values(builds)
      .sort((a, b) => {
        if (a.id === pinnedId) return -1;
        if (b.id === pinnedId) return 1;

        const aData = characterDatas[a.id];
        const bData = characterDatas[b.id];

        return (
          bData.version - aData.version ||
          bData.quality - aData.quality ||
          bData.id - aData.id
        );
      }),
    [builds, pinnedId, characterDatas],
  );

  return { builds, sortedKeys };
}
