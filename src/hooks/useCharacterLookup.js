import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ALL_CHARACTER_LOOKUP } from '@/lookups';

export function useCharacterLookup(characterId) {
  const { gameId } = useParams();
  return useMemo(() => {
    if (!characterId) return {};
    return ALL_CHARACTER_LOOKUP[gameId][characterId];
  }, [characterId]);
};
