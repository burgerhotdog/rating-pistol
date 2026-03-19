import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CHARACTER_LOOKUP } from '@/lookups';

export function useCharacterLookup(charId) {
  const { gameId } = useParams();
  return useMemo(() => {
    if (!charId) return {};
    return CHARACTER_LOOKUP[gameId][charId];
  }, [charId, gameId]);
};
