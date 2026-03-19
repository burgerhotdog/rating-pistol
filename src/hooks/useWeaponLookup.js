import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { WEAPON_LOOKUP } from '@/lookups';

export function useWeaponLookup(weaponId) {
  const { gameId } = useParams();
  return useMemo(() => {
    if (!weaponId) return {};
    return WEAPON_LOOKUP[gameId][weaponId];
  }, [gameId, weaponId]);
};
