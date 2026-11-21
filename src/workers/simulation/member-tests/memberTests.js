import { CHARACTER, ECHO, SET, WEAPON } from '@/data';
import { initMember } from '@/utils';
import { buildCache } from '../cache';
import { getRotationOrder } from '../rotation-order';

export function testAltMembers(team, cache, equipMaps, charId, builds, userDps, memberId) {
  const result = [];

  for (const charData of Object.values(CHARACTER[cache.gameId])) {
    if (charData.id === memberId) {
      result.push({ id: charData.id, name: charData.name, dps: userDps });
      continue;
    }
    if (cache.memberIds.includes(charData.id)) continue;
    if (charData.disabled || !builds[charData.id]?.equipList) continue;

    const build = builds[charData.id];
    const weapon = WEAPON[cache.gameId][build.weaponId ?? charData.memberPreset?.weaponId];
    if (!weapon || weapon.disabled) continue;

    const replacement = initMember(cache.gameId, charData.id, build);
    if (Object.keys(replacement.setCounts).some((id) => !SET[cache.gameId][id] || SET[cache.gameId][id].disabled)) continue;
    if (replacement.mainEcho && (!ECHO[replacement.mainEcho] || ECHO[replacement.mainEcho].disabled)) continue;

    const testTeam = team.map((member) => member.id === memberId ? replacement : member);
    const testCache = buildCache({ gameId: cache.gameId, charId, team: testTeam });
    const testEquipMaps = { ...equipMaps, [charData.id]: testCache.member[charData.id].equipMap };
    const { dps } = getRotationOrder(testCache, testEquipMaps);

    result.push({ id: charData.id, name: charData.name, dps });
  }

  return result;
}
