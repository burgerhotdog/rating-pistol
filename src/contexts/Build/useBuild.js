import { useContext } from 'react';
import { BuildContext } from '@/contexts';

export function useBuild(gameId, characterId) {
  const context = useContext(BuildContext);
  if (!gameId && !characterId) return context;
  return context.buildsByGameId[gameId]?.[characterId];
}
