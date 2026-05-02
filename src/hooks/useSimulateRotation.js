import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { simulateRotation, normalizeTeam } from '@/utils';

export function useSimulateRotation(team, teamFinalStats = {}) {
  const { gameId } = useParams();

  return useMemo(() => {
    const normalizedTeam = normalizeTeam(team, teamFinalStats);
    return simulateRotation(gameId, normalizedTeam);
  }, [gameId, team, teamFinalStats]);
}
