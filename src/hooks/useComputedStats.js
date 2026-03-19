import { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { BuildDataContext } from '@/contexts';
import { combineBaseStats, combineEquipStats } from '@/utils';

export function useComputedStats(selectedId) {
  const { gameId } = useParams();
  const { allBuildData } = useContext(BuildDataContext);

  return useMemo(() => {
    if (!selectedId) return { baseStats: {}, equipStats: {} };

    const { weaponId, equipList } = allBuildData[gameId]?.[selectedId];

    const baseStats = combineBaseStats(gameId, selectedId, weaponId);
    const equipStats = combineEquipStats(equipList);

    return { baseStats, equipStats };
  }, [allBuildData, gameId, selectedId]);
};
