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
    console.log(baseStats, equipStats);

    return { baseStats, equipStats };
  }, [selectedId]);
};
