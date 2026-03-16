import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ALL_WEAPON_LOOKUP } from '@/lookups';

export function useWeaponLookup(weaponId) {
  const { gameId } = useParams();
  return useMemo(() => {
    if (!weaponId) return {};
    return ALL_WEAPON_LOOKUP[gameId][weaponId];
  }, [weaponId]);
};
