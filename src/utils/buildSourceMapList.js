import { CHARACTER_LOOKUP, WEAPON_LOOKUP, GENERAL_LOOKUP } from '@/lookups';
import { combineEquipStats } from '@/utils';

export function buildSourceMapList(gameId, buildEntry, buffs = {}) {
  const [id, data] = buildEntry;
  return [
    GENERAL_LOOKUP[gameId].DEFAULT_STATS,
    CHARACTER_LOOKUP[gameId][id].FIXED_STATS ?? {},
    WEAPON_LOOKUP[gameId][data.weaponId].FIXED_STATS ?? {},
    combineEquipStats(data.equipList),
    ...(Object.keys(buffs).length ? [buffs] : []),
  ];
};
