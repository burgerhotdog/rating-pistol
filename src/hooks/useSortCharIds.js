import { useContext, useMemo } from 'react';
import { sortCharIds } from '@/utils';
import { BuildDataContext, UserDataContext } from '@/contexts';

export function useSortCharIds(gameId) {
  const pinnedId = useContext(UserDataContext).pinnedIds[gameId];
  const buildData = useContext(BuildDataContext).allBuildData[gameId] ?? {};

  return useMemo(() => {
    return sortCharIds(gameId, pinnedId, Object.keys(buildData));
  }, [gameId, pinnedId, buildData]);
};
