import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { simulateRotation } from '@/utils';

export function useSimulateRotation(team) {
  const { gameId } = useParams();
  return useMemo(
    () => simulateRotation(gameId, team),
    [gameId, team]
  );
}
