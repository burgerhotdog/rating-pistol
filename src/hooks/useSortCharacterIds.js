import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { sortCharacterIds } from '@/utils';
import { BuildDataContext, UserDataContext } from '@/contexts';

export function useSortCharacterIds() {
  const { gameId } = useParams();
  const pinnedId = useContext(UserDataContext).pinnedIds[gameId];
  const buildData = useContext(BuildDataContext).allBuildData[gameId];

  return useMemo(() => {
    return sortCharacterIds(gameId, pinnedId, Object.keys(buildData));
  }, [gameId, pinnedId, buildData]);
};
