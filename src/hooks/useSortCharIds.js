import { useContext, useMemo } from 'react';
import { sortCharIds } from '@/utils';
import { BuildContext, UserDataContext } from '@/contexts';

export function useSortCharIds(gameId) {
  const pinnedId = useContext(UserDataContext).pinnedIds[gameId];
  const buildData = useContext(BuildContext).buildCollections[gameId] ?? {};

  return useMemo(() => {
    return sortCharIds(gameId, pinnedId, Object.keys(buildData));
  }, [gameId, pinnedId, buildData]);
};
